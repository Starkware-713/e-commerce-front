import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

// Interfaces según OpenAPI
export interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
}

export interface OrderDetail {
  id: number;
  order_number: string;
  user: any;
  items: any[];
  status: string;
  total_amount: number;
  shipping_address?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  payment_status?: string | null;
  tracking_number?: string | null;
  estimated_delivery?: string | null;
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

  /**
   * Crear orden (POST /orders/create?cart_id=...)
   */
  createOrder(cartId: number): Observable<OrderDetail> {
    this.checkAuth();
    return this.http.post<OrderDetail>(`${this.apiUrl}/orders/create?cart_id=${cartId}`, {}, { headers: this.getHeaders() });
  }

  /**
   * Listar órdenes (GET /orders/?skip=0&limit=100&status=...)
   */
  getOrders(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    sort?: 'date_asc' | 'date_desc' | 'total_asc' | 'total_desc';
  }): Observable<OrderSummary[]> {
    this.checkAuth();
    let query = '';
    if (params) {
      const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (entries.length > 0) {
        query = '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v as any)}`).join('&');
      }
    }
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/orders/${query}`, { headers: this.getHeaders() });
  }

  /**
   * Ver detalle de orden (GET /orders/{order_id})
   */
  getOrderById(orderId: number): Observable<OrderDetail> {
    this.checkAuth();
    return this.http.get<OrderDetail>(`${this.apiUrl}/orders/${orderId}`, { headers: this.getHeaders() });
  }

  /**
   * Ver todas las órdenes (GET /orders/management?skip=0&limit=100&status=...)
   */
  getAllOrdersManagement(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Observable<OrderDetail[]> {
    this.checkAuth();
    let query = '';
    if (params) {
      const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (entries.length > 0) {
        query = '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v as any)}`).join('&');
      }
    }
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/orders/management/${query}`, { headers: this.getHeaders() });
  }

  /**
   * Marcar como entregada (POST /orders/management/{order_id}/deliver)
   */
  deliverOrderManagement(orderId: number): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/orders/management/${orderId}/deliver`, {}, { headers: this.getHeaders() });
  }

  /**
   * Cancelar orden (POST /orders/management/{order_id}/cancel)
   */
  cancelOrderManagement(orderId: number): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/orders/management/${orderId}/cancel`, {}, { headers: this.getHeaders() });
  }

  /**
   * Estadísticas de órdenes (GET /orders/stats/summary)
   */
  getOrderStats(): Observable<any> {
    this.checkAuth();
    return this.http.get(`${this.apiUrl}/orders/stats/summary`, { headers: this.getHeaders() });
  }

  // Alias para compatibilidad: getAllOrders (devuelve OrderDetail[])
  getAllOrders(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    sort?: 'date_asc' | 'date_desc' | 'total_asc' | 'total_desc';
  }): Observable<OrderDetail[]> {
    // getAllOrders debe devolver detalles completos, así que usamos getAllOrdersManagement
    return this.getAllOrdersManagement(params);
  }

  // Alias para compatibilidad: getPendingOrdersForSeller (devuelve OrderDetail[])
  getPendingOrdersForSeller(): Observable<OrderDetail[]> {
    return this.getAllOrdersManagement({ status: 'pending' });
  }
}
