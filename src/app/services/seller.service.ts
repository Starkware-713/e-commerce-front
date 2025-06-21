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

// Interfaz para usuario según el formato solicitado
export interface SellerUser {
  email: string;
  name: string;
  lastname: string;
  id: number;
  is_active: boolean;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly apiUrl = 'https://e-comerce-backend-kudw.onrender.com';
  private readonly router = inject(Router);

  constructor(private http: HttpClient) {}

  private checkAuth(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      throw new Error('Se requiere autenticación');
    }
  }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // User Management
  getUsers(): Observable<User[]> {
    this.checkAuth();
    return this.http.get<User[]>(`${this.apiUrl}/user`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getUserById(userId: string): Observable<User> {
    this.checkAuth();
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Cambiar el rol de un usuario
  updateUserRole(userId: number, newRole: string): Observable<any> {
    this.checkAuth();
    return this.http.put<any>(
      `${this.apiUrl}/user/update/${userId}`,
      { rol: newRole },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Actualiza los datos del usuario (name, lastname, email)
  updateUserData(userId: number, data: { name: string; lastname: string; email: string; rol?: string }): Observable<any> {
    this.checkAuth();
    return this.http.put<any>(
      `${this.apiUrl}/user/update/${userId}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Order Management
  getAllOrders(): Observable<OrderDetail[]> {
    this.checkAuth();
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/orders/management`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getPendingOrders(): Observable<OrderDetail[]> {
    this.checkAuth();
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/orders/management/pending`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getOrderById(orderId: string): Observable<OrderDetail> {
    this.checkAuth();
    return this.http.get<OrderDetail>(`${this.apiUrl}/orders/${orderId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  markOrderAsDelivered(orderId: string): Observable<OrderDetail> {
    this.checkAuth();
    return this.http.post<OrderDetail>(`${this.apiUrl}/orders/management/${orderId}/deliver`, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  cancelOrder(orderId: string): Observable<OrderDetail> {
    this.checkAuth();
    return this.http.post<OrderDetail>(`${this.apiUrl}/orders/management/${orderId}/cancel`, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Order Statistics
  getOrderStats(): Observable<OrderStats> {
    this.checkAuth();
    return this.http.get<OrderStats>(`${this.apiUrl}/orders/stats/summary`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Dashboard Analytics
  getDashboardStats(): Observable<{
    recentOrders: OrderDetail[];
    stats: OrderStats;
    topCustomers: {
      customer: CustomerInfo;
      orderCount: number;
      totalSpent: number;
    }[];
    salesTrend: {
      date: string;
      sales: number;
    }[];
  }> {
    this.checkAuth();
    return this.http.get<any>(`${this.apiUrl}/orders/stats/summary`, { headers: this.getHeaders() }).pipe(
      tap(response => {
        if (!response) throw new Error('No data received from the server');
      }),
      map(response => ({
        recentOrders: response.recentOrders || [],
        stats: response.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          dailySales: 0,
          monthlySales: 0
        },
        topCustomers: response.topCustomers || [],
        salesTrend: response.salesTrend || []
      })),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.status === 401) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta operación';
    } else if (error.status === 422) {
      errorMessage = error.error?.detail || 'Error de validación en los datos enviados';
    } else if (error.status === 404) {
      errorMessage = 'El recurso solicitado no fue encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor. Por favor, intente más tarde';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    }

    return throwError(() => new Error(errorMessage));
      
        errorMessage += `\nDetail: ${error.error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Utility methods for dashboard
  getOrderStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  getOrderStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'check_circle';
      case 'pending':
        return 'hourglass_empty';
      case 'cancelled':
        return 'cancel';
      default:
        return 'info';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getDateDifference(date: string): string {
    const now = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays} Dias`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atras`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atras`;
    return `${Math.floor(diffDays / 365)} años atras`;
  }
}
