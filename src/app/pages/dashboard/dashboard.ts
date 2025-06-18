import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService, UserRole, User } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Client } from './client/client';
import { Seller } from './seller/seller';

interface UserProfile {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  orders?: Order[];
  loading: boolean;
  error: string;
  rol?: UserRole | string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, Client, Seller],
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  userProfile: UserProfile = {
    email: '',
    loading: true,
    error: ''
  };
  userRole: UserRole | string | null = null;
  UserRole = UserRole; // Make enum available to template

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user) {
          this.userProfile.error = 'User not found';
          this.userProfile.loading = false;
          return;
        }

        this.userRole = user.rol || null;
        this.userProfile = {
          id: user.id,
          email: user.email,
          rol: user.rol,
          loading: false,
          error: ''
        };

        // Load user's orders if they exist
        if (this.userRole === UserRole.CLIENT) {
          this.orderService.getOrders().subscribe({
            next: (orders) => {
              this.userProfile.orders = orders;
            },
            error: (err: Error) => {
              console.error('Error loading orders:', err);
            }
          });
        }
      },
      error: (err: Error) => {
        console.error('Error loading user profile:', err);
        this.userProfile.error = 'Error loading user profile';
        this.userProfile.loading = false;
      }
    });
  }
}
