import { Component, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnDestroy {
  menuOpen = false;
  isLoggedIn = false;
  user: Partial<User> | null = null;
  private authSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.updateAuthState();
    this.authSub = this.authService.authState$.subscribe(() => {
      this.updateAuthState();
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  updateAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getCachedUser();
    // Si no hay usuario cacheado pero hay sesión, intenta decodificar del token
    if (this.isLoggedIn && !this.user) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const decoded: any = (window as any).jwt_decode ? (window as any).jwt_decode(token) : undefined;
          if (decoded) {
            this.user = { email: decoded.email, rol: decoded.rol };
          }
        } catch {}
      }
    }
  }

  logout() {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}