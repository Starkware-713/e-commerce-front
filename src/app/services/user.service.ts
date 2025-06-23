import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface UserProfile {
  id?: number;
  email: string;
  name: string;
  lastname: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, { headers: this.getHeaders() });
  }

  updateProfile(data: Partial<UserProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update-profile`, data, { headers: this.getHeaders() });
  }

  listUsers(skip = 0, limit = 100): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/user/?skip=${skip}&limit=${limit}`, { headers: this.getHeaders() });
  }

  getUserById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  updateUser(userId: number, data: Partial<UserProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update/${userId}`, data, { headers: this.getHeaders() });
  }
}
