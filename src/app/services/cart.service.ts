import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface CartItem {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
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

  createCart(): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/carts`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getCart(): Observable<any> {
    this.checkAuth();
    return this.http.get(`${this.apiUrl}/carts`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  addItem(item: CartItem): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/carts/items`, item, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  removeItem(item: CartItem): Observable<any> {
    this.checkAuth();
    return this.http.delete(`${this.apiUrl}/carts/items`, { body: item, headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  updateItemQuantity(item: CartItem): Observable<any> {
    this.checkAuth();
    return this.http.put(`${this.apiUrl}/carts/items`, item, { headers: this.getHeaders() })
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
