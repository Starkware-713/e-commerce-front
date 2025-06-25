import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface PaymentProcess {
  orderId: string;
  paymentMethod: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
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

  processPayment(payment: PaymentProcess): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/payment/process`, payment, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getPaymentHistory(): Observable<any[]> {
    this.checkAuth();
    return this.http.get<any[]>(`${this.apiUrl}/payments/history`, { headers: this.getHeaders() });
  }

  /**
   * Crea una preferencia de pago enviando el order_id
   */
  createPaymentPreference(orderId: number | string): Observable<any> {
    this.checkAuth();
    return this.http.put(
      `${this.apiUrl}/payment/create-preference`,
      { order_id: orderId },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        if (error.message === 'Authentication required') {
          return throwError(() => new Error('Please log in to access this feature'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Envía un correo de procesamiento de compra
   */
  sendProcessingPurchaseEmail(userEmail: string, userName: string): Observable<any> {
    this.checkAuth();
    return this.http.post(
      `${this.apiUrl}/email/processing-purchase`,
      { user_email: userEmail, user_name: userName },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        if (error.message === 'Authentication required') {
          return throwError(() => new Error('Please log in to access this feature'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Aplica un cupón de descuento al carrito
   */
  applyCoupon(cartId: number, code: string): Observable<any> {
    this.checkAuth();
    return this.http.post(
      `${this.apiUrl}/carts/${cartId}/apply-coupon`,
      { code },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        if (error.message === 'Authentication required') {
          return throwError(() => new Error('Please log in to access this feature'));
        }
        if (error.status === 404) {
          return throwError(() => new Error('Carrito no encontrado.'));
        }
        if (error.status === 400) {
          return throwError(() => new Error('Cupón inválido o expirado.'));
        }
        return throwError(() => error);
      })
    );
  }
}
