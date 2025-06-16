import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService, UserRole, User } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { Client } from './client/client';
import { Seller } from './seller/seller';
import { SellerBoss } from './seller-boss/seller-boss';

interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  orders?: Order[];
  loading?: boolean;
  error?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true,
  imports: [CommonModule, Client, Seller, SellerBoss],
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  userRole?: UserRole;
  UserRole = UserRole;
  userProfile: UserProfile = {
    email: '',
    password: '',
    loading: true
  };
  orders: Order[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadUserProfile();
    this.loadOrders();
  }

  private loadUserProfile() {
    this.userProfile.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userProfile = { ...user, loading: false };
      },
      error: (error) => {
        this.userProfile.error = 'Error loading profile';
        this.userProfile.loading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadOrders() {
    if (this.userRole === UserRole.CLIENT) {
      this.orderService.getOrders().subscribe({
        next: (orders) => {
          this.orders = orders;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
        }
      });
    }
  }
}
