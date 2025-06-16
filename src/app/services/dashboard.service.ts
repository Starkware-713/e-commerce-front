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
    const role = this.authService.getUserRole();

    if (!role) {
      this.router.navigate(['/auth/login']);
      return;
    }

    switch (role) {
      case UserRole.CLIENT:
        this.router.navigate(['/dashboard/client']);
        break;
      case UserRole.SELLER:
        this.router.navigate(['/dashboard/seller']);
        break;
      case UserRole.SELLER_BOSS:
        this.router.navigate(['/dashboard/seller-boss']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
  canAccessDashboard(requiredRole: UserRole): boolean {
    const userRole = this.authService.getUserRole();
    if (!userRole) return false;
    
    console.log('Verificando acceso:', { userRole, requiredRole });
    return userRole === requiredRole;
  }
}
