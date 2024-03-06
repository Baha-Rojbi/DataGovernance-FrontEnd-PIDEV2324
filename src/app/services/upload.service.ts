import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataTable, Schema } from '../models/data-table';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private baseUrl = 'http://localhost:8075/api';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getDataTables(): Observable<DataTable[]> {
    return this.http.get<DataTable[]>(`${this.baseUrl}/tables`);
  }

  updateDataTable(dataTable: DataTable): Observable<any> {
    return this.http.put(`${this.baseUrl}/tables/${dataTable.idTable}`, dataTable);
  }

  getSchemasForTable(tableId: number): Observable<Schema[]> {
    return this.http.get<Schema[]>(`${this.baseUrl}/tables/${tableId}/schemas`);
  }

  updateSchema(schema: Schema): Observable<any> {
    return this.http.put(`${this.baseUrl}/schemas/${schema.idSchema}`, schema);
  }

  updateTags(idSchema: number, tags: string[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/schemas/${idSchema}/tags`, tags);
  }
  
}
