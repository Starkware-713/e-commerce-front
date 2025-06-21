import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  navigateToDashboard(): void {
    // Obtiene la URL del dashboard según el rol actual del token
    const dashboardUrl = this.authService.getDashboardUrl();
    if (!dashboardUrl || dashboardUrl === '/login') {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate([dashboardUrl]);
  }

  canAccessDashboard(requiredRole: UserRole): boolean {
    const userRole = this.authService.getUserRole();
    if (!userRole) return false;
    
    console.log('Verificando acceso:', { userRole, requiredRole });
    return userRole === requiredRole;
  }

  /**
   * Obtener resumen de órdenes (GET /orders/stats/summary)
   */
  getOrderStats(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/orders/stats/summary`, { headers });
  }
}
