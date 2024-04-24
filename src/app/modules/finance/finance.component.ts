import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FinanceService } from './finance.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector       : 'finance',
    templateUrl    : './finance.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent 
{

    data: any;
    

    /**
     * Constructor
     */
    constructor(private _financeService: FinanceService ,private http: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
   
    /**
     * On destroy
     */
   

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
fileToUpload: File | null = null;
  pdfToUpload: File | null = null; // Add this line
  imageToUpload: File | null = null; // Add this line

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const fileType = file.type;
      switch (fileType) {
        case 'text/csv':
          this.fileToUpload = file;
          break;
        case 'application/pdf':
          this.pdfToUpload = file;
          break;
        case 'image/jpeg':
        case 'image/png':
          this.imageToUpload = file;
          break;
        default:
          console.error('Unsupported file type.');
          break;
      }
    }
  }

  uploadFiles() {
    const formData = new FormData();
    if (this.fileToUpload) {
      formData.append('csv_file', this.fileToUpload, this.fileToUpload.name);
    }
    if (this.pdfToUpload) {
      formData.append('pdf_file', this.pdfToUpload, this.pdfToUpload.name);
    }
    if (this.imageToUpload) {
      formData.append('image_file', this.imageToUpload, this.imageToUpload.name);
    }

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
