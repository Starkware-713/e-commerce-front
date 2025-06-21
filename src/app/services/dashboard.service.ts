import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private authService: AuthService,
    private router: Router
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
}
