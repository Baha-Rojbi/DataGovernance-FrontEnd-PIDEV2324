import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CryptoService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    getDatabaseMetadata(dbName: string, tableName: string): Observable<any> {
        let url = `http://localhost:8000/get-database-metadata/${dbName}/`;
        if (tableName.trim() !== '') {
          url += `?table_name=${tableName}`;
        }
        return this._httpClient.get<any>(url);
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/crypto').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
