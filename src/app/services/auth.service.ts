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

export const ROLE_DASHBOARD_MAP: { [key: string]: string } = {
  'comprador': '/dashboard/client',
  'vendedor': '/dashboard/seller',
  'jefe_ventas': '/dashboard/seller-boss',
  'CLIENT': '/dashboard/client',
  'SELLER': '/dashboard/seller',
  'SELLER_BOSS': '/dashboard/seller-boss'
};

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
  }

  private checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as any;
        const userId = decodedToken.sub || decodedToken.userId || decodedToken.id;
        const email = decodedToken.email;
        const role = decodedToken.rol || decodedToken.role;
        if (userId && email) {
          this.isAuthenticated = true;
          this.currentUser = {
            id: userId,
            email: email,
            role: role || UserRole.CLIENT
          };
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap({
          next: (response) => {
            // Registro exitoso
          },
          error: (error) => {
            // Manejo de errores
          }
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            const token = response.access_token || response.token;
            if (token) {
              localStorage.setItem('token', token);
              this.checkToken();
            }
          },
          error: error => {
            // Manejo de errores
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
  }

  getDashboardUrl(): string {
    const role = this.currentUser?.role;
    if (!role) return '/login';
    return ROLE_DASHBOARD_MAP[role] || '/dashboard/client';
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Devuelve un usuario seller-boss para pruebas
  getCurrentUser(): Partial<User> | null {
    return {
      id: '1',
      email: 'sellerboss@demo.com',
      role: UserRole.SELLER_BOSS
    };
  }

  getUserRole(): UserRole | undefined {
    return this.currentUser?.role;
  }

  initializeAPI(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-check`).pipe(
      tap({
        next: () => {},
        error: (error) => {}
      })
    );
  }
}