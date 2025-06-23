import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

// Interfaces según OpenAPI
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string | null;
  sku?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string | null;
  created_by?: number;
  updated_by?: number | null;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string | null;
  sku?: string | null;
}

export interface ProductUpdate {
  name?: string | null;
  description?: string | null;
  price?: number | null;
  category?: string | null;
  stock?: number | null;
  image_url?: string | null;
  sku?: string | null;
  is_active?: boolean | null;
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

  /**
   * Crear producto (POST /products/)
   */
  createProduct(product: ProductCreate): Observable<Product> {
    this.checkAuth();
    return this.http.post<Product>(`${this.apiUrl}/products/`, product, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Por favor inicie sesión para acceder a esta función'));
          }
          if (error.status === 422) {
            const validationErrors = error.error?.detail || 'Error de validación en los datos del producto';
            return throwError(() => new Error(validationErrors));
          }
          return throwError(() => new Error('Error al crear el producto. Por favor, verifique los datos e intente nuevamente'));
        })
      );
  }

  /**
   * Listar productos (GET /products/)
   */
  getProducts(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?: 'none' | 'price_asc' | 'price_desc' | 'newest';
    in_stock?: boolean;
  }): Observable<Product[]> {
    let query = '';
    if (params) {
      const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
      if (entries.length > 0) {
        query = '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v as any)}`).join('&');
      }
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products/${query}`);
  }

  /**
   * Buscar productos (POST /products/search?toFind=...)
   */
  searchProducts(toFind: string): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/products/search?toFind=${encodeURIComponent(toFind)}`, {});
  }

  /**
   * Ver producto por ID (GET /products/{product_id})
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  /**
   * Actualizar producto (PUT /products/{product_id})
   */
  updateProduct(id: number, product: ProductUpdate): Observable<Product> {
    this.checkAuth();
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product, { headers: this.getHeaders() });
  }

  /**
   * Eliminar producto (DELETE /products/{product_id})
   */
  deleteProduct(id: number): Observable<any> {
    this.checkAuth();
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Actualizar stock (PATCH /products/{product_id}/stock)
   */
  updateStock(id: number, stock: number): Observable<Product> {
    this.checkAuth();
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}/stock`, { stock }, { headers: this.getHeaders() });
  }
}
