

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private baseUrlMetadata = 'http://localhost:8075/api/Metadata';
  private baseUrldataTable = 'http://localhost:8075/api/datatable';


  constructor(private http: HttpClient) { }

  createMetadata(dataTableId: number, metadata: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrlMetadata}/${dataTableId}`, metadata);
  
}
findMetadataByDataTableId(dataTableId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrldataTable}/${dataTableId}`);
  
}
//getKeywordFrequency(): Observable<any> {
  //return this.http.get(`${this.baseUrlMetadata}/keywords`);
//}


}
