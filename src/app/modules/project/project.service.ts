import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    private baseUrl = 'http://localhost:8000/get-tables-number';

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }
    
    getTableCount(): Observable<any> {
        const dbName = 'uploadcsv'; // Fixed database name
        return this._httpClient.get<any>(`${this.baseUrl}/${dbName}/`);
      }


  

      getTableelementCounts(): Observable<any> {
        return this._httpClient.get<any>('http://localhost:8000/count_elements_in_each_table_by_db_name/uploadcsv/');
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
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

}