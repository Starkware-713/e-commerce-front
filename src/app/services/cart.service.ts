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

export interface CartItemCreate {
  quantity: number;
  product: Product;
}

export interface CartCreate {
  user_id: number;
  items: CartItemCreate[];
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

  /**
   * Crear carrito (POST /carts/)
   */
  createCart(cart: CartCreate): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/carts/`, cart, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Listar carritos (GET /carts/?skip=0&limit=100)
   */
  listCarts(skip = 0, limit = 100): Observable<any[]> {
    this.checkAuth();
    return this.http.get<any[]>(`${this.apiUrl}/carts/?skip=${skip}&limit=${limit}`, { headers: this.getHeaders() });
  }

  /**
   * Ver carrito por ID (GET /carts/{cart_id})
   */
  getCartById(cartId: number): Observable<any> {
    this.checkAuth();
    return this.http.get<any>(`${this.apiUrl}/carts/${cartId}`, { headers: this.getHeaders() });
  }

  /**
   * Eliminar carrito (DELETE /carts/{cart_id})
   */
  deleteCart(cartId: number): Observable<any> {
    this.checkAuth();
    return this.http.delete(`${this.apiUrl}/carts/${cartId}`, { headers: this.getHeaders() });
  }

  /**
   * Agregar producto al carrito (PUT /carts/{cart_id}/add)
   * Body: { quantity, product }
   */
  addProductToCart(cartId: number, item: CartItemCreate): Observable<any> {
    this.checkAuth();
    return this.http.put(`${this.apiUrl}/carts/${cartId}/add`, item, { headers: this.getHeaders() });
  }

  /**
   * Actualizar cantidad de producto (PUT /carts/{cart_id}/product/{product_id}?quantity=number)
   */
  updateProductQuantity(cartId: number, productId: number, quantity: number): Observable<any> {
    this.checkAuth();
    return this.http.put(`${this.apiUrl}/carts/${cartId}/product/${productId}?quantity=${quantity}`, {}, { headers: this.getHeaders() });
  }

  /**
   * Eliminar producto del carrito (DELETE /carts/{cart_id}/product/{product_id})
   */
  deleteProductFromCart(cartId: number, productId: number): Observable<any> {
    this.checkAuth();
    return this.http.delete(`${this.apiUrl}/carts/${cartId}/product/${productId}`, { headers: this.getHeaders() });
  }

  /**
   * Aplicar cupón (POST /carts/{cart_id}/apply-coupon)
   */
  applyCoupon(cartId: number, code: string): Observable<any> {
    this.checkAuth();
    return this.http.post(`${this.apiUrl}/carts/${cartId}/apply-coupon`, { code }, { headers: this.getHeaders() });
  }

  /**
   * Checkout del carrito (PUT /carts/{cart_id}/checkout)
   */
  checkoutCart(cartId: number): Observable<any> {
    this.checkAuth();
    return this.http.put(`${this.apiUrl}/carts/${cartId}/checkout`, {}, { headers: this.getHeaders() });
  }

  /**
   * Alias para compatibilidad: obtener el carrito del usuario autenticado (GET /carts/)
   */
  getCart(): Observable<any> {
    this.checkAuth();
    return this.http.get(`${this.apiUrl}/carts/`, { headers: this.getHeaders() });
  }

  /**
   * Alias para compatibilidad: removeProductFromCart (llama a deleteProductFromCart)
   */
  removeProductFromCart(cartId: number, productId: number): Observable<any> {
    return this.deleteProductFromCart(cartId, productId);
  }

  /**
   * Wrapper para compatibilidad: updateItemQuantity (llama a updateProductQuantity)
   * Permite que cartId sea opcional para compatibilidad legacy.
   */
  updateItemQuantity(item: { productId: number, quantity: number, cartId?: number }): Observable<any> {
    if (item.cartId === undefined) {
      throw new Error('cartId es requerido para actualizar la cantidad de un producto en el carrito');
    }
    return this.updateProductQuantity(item.cartId, item.productId, item.quantity);
  }
}
