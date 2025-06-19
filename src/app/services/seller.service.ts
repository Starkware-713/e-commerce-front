import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  dailySales: number;
  monthlySales: number;
}

export interface OrderDetail {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  customerInfo: CustomerInfo;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller';
  createdAt: string;
  lastLogin: string;
  orderCount: number;
  totalSpent: number;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }

  getDashboardStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.apiUrl}/seller/stats`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getOrders(status?: string): Observable<OrderDetail[]> {
    const url = status 
      ? `${this.apiUrl}/seller/orders?status=${status}`
      : `${this.apiUrl}/seller/orders`;
    return this.http.get<OrderDetail[]>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getOrderDetails(orderId: string): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/seller/orders/${orderId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateOrderStatus(orderId: string, status: string): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(
      `${this.apiUrl}/seller/orders/${orderId}/status`,
      { status },
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }
}
