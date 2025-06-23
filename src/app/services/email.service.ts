import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/send-email`, data, { headers: this.getHeaders() });
  }

  generateHtmlWithIA(prompt: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/prompt-IA`, { prompt }, { headers: this.getHeaders() });
  }
}
