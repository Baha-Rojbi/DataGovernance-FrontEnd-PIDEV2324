import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private baseUrl = 'http://localhost:8075/api';
  private endpoint = '/form/all';

  constructor(private http: HttpClient) { }

  getAllFormData(): Observable<any> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return this.http.get<any>(url);
  }
}
