import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private apiUrl = 'https://e-comerce-backend-kudw.onrender.com';

  constructor(private http: HttpClient) {}

  getBetterTitle(title: string): Observable<{ title?: string; better_title?: string }> {
    return this.http.post<{ title?: string; better_title?: string }>(`${this.apiUrl}/ia/better-title`, { title });
  }

  getBetterDescription(description: string): Observable<{ better_description: string }> {
    return this.http.post<{ better_description: string }>(`${this.apiUrl}/ia/better-descripcion`, { description });
  }
}
