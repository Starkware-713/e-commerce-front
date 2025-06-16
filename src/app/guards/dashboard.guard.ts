import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'] as UserRole;
    if (!requiredRole) {
      return true;
    }

    if (this.dashboardService.canAccessDashboard(requiredRole)) {
      return true;
    }

    // If user doesn't have the required role, redirect to their appropriate dashboard
    this.dashboardService.navigateToDashboard();
    return false;
  }
}
