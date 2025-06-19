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
}
