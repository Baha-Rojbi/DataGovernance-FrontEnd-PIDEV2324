import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item, Items } from 'app/modules/file-manager/file-manager.types';
import { DataTable, Schema } from '../models/data-table';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService
{
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
    private baseUrl = 'http://localhost:8075/api';
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }
    getDataTables(): Observable<DataTable[]> {
        return this._httpClient.get<DataTable[]>(`${this.baseUrl}/tables`);
      }
      getDataTableById(id: number): Observable<DataTable | null> {
        if (id <= 0) {
            // Return null or throw a custom error
            return of(null);
          }
        return this._httpClient.get<DataTable>(`${this.baseUrl}/tables/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
              // Handle the HTTP error here
              console.error('Error fetching DataTable by ID:', error);
              return of(null); 
            })
        );
      }
      uploadFile(formData: FormData): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}/upload`, formData);
      }
      updateDataTable(dataTable: DataTable): Observable<any> {
        return this._httpClient.put(`${this.baseUrl}/tables/${dataTable.idTable}`, dataTable);
      }
      getSchemasForTable(tableId: number): Observable<Schema[]> {
        return this._httpClient.get<Schema[]>(`${this.baseUrl}/tables/${tableId}/schemas`).pipe(
            tap(data => console.log('Fetched schemas with tags:', data)),
            catchError(error => {
                console.error('Error fetching schemas:', error);
                return throwError(() => new Error('Error fetching schemas'));
            })
        );
    }
    

      updateSchema(schema: Schema): Observable<any> {
        return this._httpClient.put(`${this.baseUrl}/schemas/${schema.idSchema}`, schema);
      }
    
      updateTags(idSchema: number, tags: string[]): Observable<any> {
        return this._httpClient.put(`${this.baseUrl}/schemas/${idSchema}/tags`, tags);
      }
      deleteSchema(schemaId: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}/schemas/${schemaId}`);
    }
      downloadDataTablePdf(tableId: number): Observable<Blob> {
        return this._httpClient.get(`${this.baseUrl}/tables/${tableId}/download`, { responseType: 'blob' });
      }
      createSchema(tableId: number, schema: Schema): Observable<Schema> {
        return this._httpClient.post<Schema>(`${this.baseUrl}/tables/${tableId}/schemas`, schema);
      }
      toggleArchiveStatus(dataTableId: number): Observable<void> {
        return this._httpClient.put<void>(`${this.baseUrl}/tables/${dataTableId}/toggle-archive`, null);
      }
      createDataTable(name: string, description: string): Observable<any> {
        const payload = { name, description };
        return this._httpClient.post(`${this.baseUrl}/tables/create`, payload);
      }

}
