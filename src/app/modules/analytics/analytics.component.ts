import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AnalyticsService} from './analytics.service';

interface TableData {
  table_name: string;
  metadata: Array<any>;
}

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent 
{
    fileToUpload: File | null = null;
  constructor(private http: HttpClient) { }
 
   onFileSelected(event: any) {
     this.fileToUpload = event.target.files[0];
   }
 
   uploadCSV() {
     if (!this.fileToUpload) {
       console.error('No file selected.');
       return;
     }
 
     const formData = new FormData();
     formData.append('csv_file', this.fileToUpload, this.fileToUpload.name);
     this.http.post<any>('http://localhost:8000/upload-csv/', formData).subscribe(
       response => {
         console.log(response);
       },
       error => {
         console.error(error);
       }
     );
   }
}
