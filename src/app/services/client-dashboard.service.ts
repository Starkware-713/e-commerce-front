import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user`);
  }
}
