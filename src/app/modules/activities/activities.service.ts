import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { orderBy } from 'lodash'; // Import orderBy function from lodash
import { TraceLog } from '../models/Trace-log';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private baseUrl = 'http://localhost:8075/api';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<TraceLog[]> {
    return this.http.get<TraceLog[]>(`${this.baseUrl}/logs/getAlllogs`).pipe(
      map(logs => orderBy(logs, ['timestamp'], ['desc'])) // Sort logs by timestamp in descending order
    );
  }
}
