import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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
  createProduct(product: Product): Observable<Product> {
    this.checkAuth();
    return this.http.post<Product>(`${this.apiUrl}/products`, product, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }
  // Public methods - no authentication required
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => throwError(() => error))
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => throwError(() => error))
      );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    this.checkAuth();
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  deleteProduct(id: string): Observable<void> {
    this.checkAuth();
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/search`, {
      params: { q: query },
      headers: this.getHeaders()
    });
  }
}
