import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  lastname?: string;
  is_active?: boolean;
  rol?: UserRole | string;
}

export enum UserRole {
  CLIENT = 'comprador',
  SELLER = 'vendedor'
}

interface DecodedToken {
  sub?: string;
  userId?: string | number;
  id?: string | number;
  email: string;
  rol?: string;
  role?: string;
  exp: number;
}

// Mapeo de roles a rutas de dashboard
export const ROLE_DASHBOARD_MAP: { [key: string]: string } = {
  'comprador': '/dashboard/client',
  'vendedor': '/dashboard/seller',
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';
  private isAuthenticated = false;
  private currentUser: Partial<User> | null = null;

  constructor(private http: HttpClient) {
    this.checkToken();
  }  private checkToken() {
    const token = localStorage.getItem('token');
    console.log('Checking token:', token);
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as DecodedToken;
        console.log('Decoded token:', decodedToken);
        
        // Verifica si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log('Token expirado');
          this.logout();
          return;
        }
        
        // Verifica si el token tiene la información necesaria
        const userId = decodedToken.sub || decodedToken.userId || decodedToken.id;
        const email = decodedToken.email;
        const role = decodedToken.rol || decodedToken.role;
        
        if (!userId || !email) {
          console.error('Token inválido: falta información de usuario');
          this.logout();
          return;
        }

        // Validar que el rol sea uno de los permitidos si existe
        if (role) {
          const normalizedRole = String(role).toLowerCase();
          const isValidRole = Object.keys(ROLE_DASHBOARD_MAP).some(validRole => 
            validRole.toLowerCase() === normalizedRole
          );

          if (!isValidRole) {
            console.error('Token inválido: rol no reconocido:', role);
            this.logout();
            return;
          }
        }

        this.isAuthenticated = true;
        this.currentUser = {
          id: Number(userId),
          email: email,
          rol: role
        };
        console.log('Usuario autenticado:', this.currentUser);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.logout();
      }
    }
  }

  register(user: any): Observable<any> {
    console.log('Enviando datos de registro:', user);
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap({
          next: (response) => {
            console.log('Respuesta del registro:', response);
          },
          error: (error) => {
            console.log('Error en el registro:', {
              status: error.status,
              message: error.message,
              type: error.name,
              details: error.error
            });
            
            if (error.status === 0) {
              console.log('Error de conexión: El servidor no está respondiendo');
            } else if (error.status === 409) {
              console.log('Error: El email ya está registrado');
            } else if (error.status === 400) {
              console.log('Error: Datos de registro inválidos', error.error);
            } else {
              console.log('Error inesperado:', error);
            }
          }
        })
      );
  }  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Intentando iniciar sesión con:', credentials);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            console.log('Respuesta completa del login:', response);
            // Busca el token en las diferentes posibles ubicaciones
            const token = response.access_token || response.token;
            if (token) {
              console.log('Token encontrado:', token);
              localStorage.setItem('token', token);
              
              // Actualizar el usuario con la información de la respuesta
              this.currentUser = {
                id: response.id,
                email: response.email,
                name: response.name,
                lastname: response.lastname,
                is_active: response.is_active,
                rol: response.rol
              };
              
              this.isAuthenticated = true;
              console.log('Usuario actualizado desde respuesta:', this.currentUser);
            } else {
              console.error('No se encontró token en la respuesta:', response);
            }
          },
          error: error => {
            console.error('Error en el login:', error);
            if (error.status === 401) {
              const errorDetail = error.error?.detail || 'Email o contraseña incorrectos';
              throw new Error(errorDetail);
            } else if (error.status === 0) {
              throw new Error('Error de conexión: El servidor no está respondiendo');
            } else {
              throw new Error('Error inesperado durante el inicio de sesión');
            }
          }
        })
      );
  }
  loginAndFetchProfile(credentials: { email: string; password: string }): Observable<User> {
    return this.login(credentials).pipe(
      // Después del login exitoso, devolvemos el usuario del token
      // Si el backend no tiene endpoint de perfil, al menos tendremos la info básica del token
      tap(() => {
        if (!this.currentUser) {
          throw new Error('No se pudo obtener la información del usuario');
        }
      }),
      // Intentamos obtener el perfil completo, pero si falla usamos la info del token
      switchMap(() => this.getCurrentUser().pipe(
        tap(user => console.log('Perfil obtenido:', user)),
        // Si falla la obtención del perfil, usamos la info del token
        catchError(error => {
          console.warn('No se pudo obtener el perfil completo, usando info del token:', error);
          const tokenUser = this.currentUser;
          if (!tokenUser) {
            throw new Error('No hay información del usuario disponible');
          }
          return of(tokenUser as User);
        })
      ))
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('token');
  }

  refreshToken(): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/auth/refresh`, {})
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.checkToken();
        })
      );
  }  getDashboardUrl(): string {
    const role = this.currentUser?.rol;
    if (!role) {
      console.error('No hay rol definido para el usuario');
      return '/login';
    }
    
    console.log('Rol actual:', role);
    // Convertimos el rol a string y lo normalizamos a minúsculas para la búsqueda
    const normalizedRole = String(role).toLowerCase();
    
    // Buscar la URL del dashboard para el rol
    const dashboardUrl = ROLE_DASHBOARD_MAP[normalizedRole];
    
    if (!dashboardUrl) {
      console.error('Rol no reconocido:', role);
      return '/login';
    }
    
    console.log('URL del dashboard:', dashboardUrl);
    return dashboardUrl;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`).pipe(
      tap(user => {
        this.currentUser = user;
      })
    );
  }

  getCachedUser(): Partial<User> | null {
    return this.currentUser;
  }
  getUserRole(): UserRole | string | undefined {
    return this.currentUser?.rol;
  }

  initializeAPI(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-check`).pipe(
      tap({
        next: () => console.log('API initialized successfully'),
        error: (error) => console.error('Error initializing API:', error)
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Método para obtener los headers de autenticación
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
