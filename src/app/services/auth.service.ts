import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id?: string;
  email: string;
  password: string;
  role?: UserRole;
}

export enum UserRole {
  CLIENT = 'comprador',
  SELLER = 'vendedor',
  SELLER_BOSS = 'jefe_ventas'
}

// Mapeo de roles a rutas de dashboard
export const ROLE_DASHBOARD_MAP: { [key: string]: string } = {
  'comprador': '/dashboard/client',
  'vendedor': '/dashboard/seller',
  'jefe_ventas': '/dashboard/seller-boss',
  'CLIENT': '/dashboard/client',
  'SELLER': '/dashboard/seller',
  'SELLER_BOSS': '/dashboard/seller-boss'
}

interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

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
        const decodedToken = jwtDecode(token) as any;
        console.log('Decoded token:', decodedToken);
        
        // Verifica si el token tiene la información necesaria
        const userId = decodedToken.sub || decodedToken.userId || decodedToken.id;
        const email = decodedToken.email;
        const role = decodedToken.rol || decodedToken.role;
        
        if (userId && email) {
          this.isAuthenticated = true;
          this.currentUser = {
            id: userId,
            email: email,
            role: role || UserRole.CLIENT // Si no hay rol, asumimos que es cliente
          };
          console.log('Usuario autenticado:', this.currentUser);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }  register(user: any): Observable<any> {
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
              this.checkToken();
            } else {
              console.error('No se encontró token en la respuesta:', response);
            }
          },
          error: error => {
            console.error('Error en el login:', error);
          }
        })
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
    const role = this.currentUser?.role;
    if (!role) return '/login';
    
    console.log('Rol actual:', role);
    const dashboardUrl = ROLE_DASHBOARD_MAP[role] || '/dashboard/client';
    console.log('URL del dashboard:', dashboardUrl);
    
    return dashboardUrl;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): Partial<User> | null {
    return this.currentUser;
  }

  getUserRole(): UserRole | undefined {
    return this.currentUser?.role;
  }

  initializeAPI(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-check`).pipe(
      tap({
        next: () => console.log('API initialized successfully'),
        error: (error) => console.error('Error initializing API:', error)
      })
    );
  }
}
