import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private checkAuth() {
    if (!this.authService.isLoggedIn()) {
      throw new Error('Authentication required');
    }
  }

  createOrder(order: Order): Observable<Order> {
    this.checkAuth();
    return this.http.post<Order>(`${this.apiUrl}/orders`, order, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getOrders(): Observable<Order[]> {
    this.checkAuth();
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getOrder(id: string): Observable<Order> {
    this.checkAuth();
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    this.checkAuth();
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status }, { headers: this.getHeaders() });
  }

  cancelOrder(orderId: string): Observable<Order> {
    this.checkAuth();
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/cancel`, {}, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<Order[]> {
    this.checkAuth();
    return this.http.get<Order[]>(`${this.apiUrl}/orders/management/`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getPendingOrdersForSeller(): Observable<Order[]> {
    this.checkAuth();
    return this.http.get<Order[]>(`${this.apiUrl}/orders/management/pending`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  deliverOrder(orderId: string): Observable<Order> {
    this.checkAuth();
    return this.http.put<Order>(`${this.apiUrl}/orders/management/${orderId}/deliver`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  cancelOrderManagement(orderId: string): Observable<Order> {
    this.checkAuth();
    return this.http.put<Order>(`${this.apiUrl}/orders/management/${orderId}/cancel`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }
}
