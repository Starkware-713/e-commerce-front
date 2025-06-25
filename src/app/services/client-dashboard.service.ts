import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface Order {
  id: number;
  productName: string;
  date: string;
  status: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`, {
      headers: this.getHeaders()
    });
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, {
      headers: this.getHeaders()
    });
  }
  
  /**
   * Actualiza el perfil del usuario
   */
  updateUserProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/profile`, profile, {
      headers: this.getHeaders()
    });
  }

  /**
   * Elimina un usuario por su ID
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Inicia el checkout del carrito
   */
  checkoutCart(cartId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/carts/${cartId}/checkout`, {}, {
      headers: this.getHeaders()
    });
  }

  /**
   * Crea la preferencia de pago en Mercado Pago
   */
  createPaymentPreference(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/create-preference`, { order_id: orderId }, {
      headers: this.getHeaders()
    });
  }

  /**
   * Endpoints para manejar el resultado del pago
   */
  paymentSuccess(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/success`, { params, headers: this.getHeaders() });
  }

  paymentFailure(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/failure`, { params, headers: this.getHeaders() });
  }

  paymentPending(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/pending`, { params, headers: this.getHeaders() });
  }
}

