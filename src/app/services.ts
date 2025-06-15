
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface User {
  id?: string;
  email: string;
  password: string;
  role?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: string;
}

export interface Sale {
  id?: string;
  orderId: string;
  total: number;
  date: Date;
}

export interface PaymentProcess {
  orderId: string;
  paymentMethod: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/auth/login`, credentials);
  }

  refreshToken(): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/auth/refresh`, {});
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  createCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/carts`, {});
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carts`);
  }

  addItem(item: CartItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/carts/items`, item);
  }

  removeItem(item: CartItem): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carts/items`, { body: item });
  }

  updateItemQuantity(item: CartItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/carts/items`, item);
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  createOrder(): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, {});
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  processPayment(payment: PaymentProcess): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/process`, payment);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`);
  }

  getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/sales/${id}`);
  }
}
