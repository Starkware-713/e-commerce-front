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
export class Dashboard {

}
