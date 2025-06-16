import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export interface Sale {
  id?: string;
  orderId: string;
  total: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private checkAuth() {
    if (!this.authService.isLoggedIn()) {
      throw new Error('Authentication required');
    }
  }

  getSales(): Observable<Sale[]> {
    this.checkAuth();
    return this.http.get<Sale[]>(`${this.apiUrl}/sales`)
      .pipe(
        catchError(error => {
          if (error.message === 'Authentication required') {
            return throwError(() => new Error('Please log in to access this feature'));
          }
          return throwError(() => error);
        })
      );
  }

  getSale(id: string): Observable<Sale> {
    this.checkAuth();
    return this.http.get<Sale>(`${this.apiUrl}/sales/${id}`)
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
