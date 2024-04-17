import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { Item, Items } from 'app/modules/file-manager/file-manager.types';
import { DataTable } from 'app/modules/models/data-table';
import { MetadataService } from '../metadata/metatadata.service';
import { MatDialog } from '@angular/material/dialog';
import { MetadataListComponent } from '../metadata/metadata.component';
import { isPlatformBrowser } from '@angular/common';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import {  ChartDataset } from 'chart.js';

@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerListComponent implements OnInit, OnDestroy
{@ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('sensitiveChartCanvas') sensitiveChartCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('fileCountByDateChartCanvas', { static: true }) fileCountByDateChartCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('keywordchartCanvas') keywordchartCanvas!: ElementRef<HTMLCanvasElement>;




    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    
    selectedItem: Item;
    dataTables: DataTable[] = [];
    selectedDataTable: DataTable | null = null;
     selectedFile: File | null = null; // Make selectedFile nullable
  description: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
  metadata: any;
  csvCount: number;
  xlsCount: number;
  csvPercentage: number;
  xlsPercentage: number;
  allMetadata: any[];
  sensitiveMetadata: any[];
  nonSensitiveMetadata: any[];
  keywordFrequency: any;

    /**
     * Constructor
     */
    constructor(
      private _activatedRoute: ActivatedRoute,
      private metadataService: MetadataService,
      
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      @Inject(PLATFORM_ID) private platformId: Object,
      private _fileManagerService: FileManagerService,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private dialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
  



    ngOnInit(): void {
      this.fetchDataTables();
      this.fetchAllMetadata();
      //
   this.fetchKeywordFrequency();
    //
    }
    //
    fetchKeywordFrequency(): void {
      this._fileManagerService.getKeywordFrequency()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (frequencyData: Record<string, number>) => {
            this.keywordFrequency = frequencyData;
            this.createKeywordFrequencyChart();
            this._changeDetectorRef.markForCheck();
          },
          error: error => console.error('Error fetching keyword frequency:', error)
        });
    }
    
    createKeywordFrequencyChart(): void {
      if (isPlatformBrowser(this.platformId) && this.chartCanvas) {
        const canvas = this.keywordchartCanvas.nativeElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
        // Convert data for the chart
        const labels = Object.keys(this.keywordFrequency);
        const data = Object.values(this.keywordFrequency).map(value => value as number);  // Ensure the data is treated as numbers
    
        const keyconfig: ChartConfiguration = {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Keyword Frequency',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
    maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        };
    
        new Chart(ctx, keyconfig);
      }
    }

    deleteMetadata(id:any){
console.log(id)
      this._fileManagerService.deleteMetadaById(id).subscribe();


    }
  
    //
    fetchDatables(){  this._fileManagerService.getDataTables()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((dataTables: DataTable[]) => {
        console.log("DataTables fetched: ", dataTables); // Detailed log
        if (dataTables.length > 0) {
          console.log("First DataTable name: ", dataTables[0].name); // Check the first item
        }
        this.dataTables = dataTables;
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();


      });
  
    // Fetch a single DataTable by ID when needed
    // This example assumes you have a way to get the selected DataTable ID (e.g., from the URL or a selection event)
    const selectedDataTableId: number = this.getSelectedDataTableId(); // Implement this method based on your app logic
    this._fileManagerService.getDataTableById(selectedDataTableId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((dataTable: DataTable) => {
        this.selectedDataTable = dataTable;
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
      });
  
    // Media query change subscription
    this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((state) => {
        this.drawerMode = state.matches ? 'side' : 'over';
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
      });}

    
 
      ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.calculateFilePercentage();
            this.createChart();
            this.createFileCountByDateChart();
            this.createKeywordFrequencyChart();

          }, 500); // 10000 milliseconds = 10 seconds
        }
      }
      
   calculateFilePercentage(): void {
  const totalFiles = this.dataTables.length;

  if (totalFiles > 0) {
    this.csvCount = this.dataTables.filter(table => this.getFileExtension(table.source) === 'csv').length;
    this.xlsCount = this.dataTables.filter(table => this.getFileExtension(table.source) === 'xlsx').length;
  
    this.csvPercentage = (this.csvCount / totalFiles) * 100;
    this.xlsPercentage = (this.xlsCount / totalFiles) * 100;
  } else {
    // Handle the scenario where there are no files
    // For example, set percentages to 0 or display a message
    this.csvCount = 0;
    this.xlsCount = 0;
    this.csvPercentage = 0;
    this.xlsPercentage = 0;
  }
}
createFileCountByDateChart(): void {
  if (isPlatformBrowser(this.platformId)) {
    const canvas = this.fileCountByDateChartCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    // Extract creation dates from DataTables
    const creationDates = this.dataTables.map(dataTable => new Date(dataTable.creationDate));

    // Count the number of files created on each date
    const fileCountsByDate = creationDates.reduce((countMap, currentDate) => {
      const dateString = currentDate.toDateString();
      countMap[dateString] = (countMap[dateString] || 0) + 1;
      return countMap;
    }, {});

    // Extract unique dates and sort them
    const uniqueDates = [...new Set(creationDates.map(date => date.toDateString()))].sort();

    // Populate file counts for each date, filling in 0 for dates with no files
    const fileCounts = uniqueDates.map(dateString => fileCountsByDate[dateString] || 0);

    const config: ChartConfiguration = {
      type: 'bar', // Change the chart type to 'bar'
      data: {
        labels: uniqueDates,
        datasets: [{
          label: 'File Count by Date',
          data: fileCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Turquoise color with transparency
          borderColor: 'rgba(75, 192, 192, 1)', // Turquoise color for the border
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
        new Chart(ctx, config);
  }
}



    
    getFileExtension(filename: string): string {
      return filename.split('.').pop() || '';
    }
    
    createChart(): void {
      if (isPlatformBrowser(this.platformId)) {
        const canvas = this.chartCanvas.nativeElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
        const config: ChartConfiguration = {
          type: 'pie', // Change the chart type to 'pie'
          data: {
            labels: ['CSV', 'XLS'],
            datasets: [{
              data: [this.csvCount, this.xlsCount],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)', // Red color with transparency
                'rgba(54, 162, 235, 0.5)', // Blue color with transparency
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((prev: any, curr: any) => prev + curr);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
              }
            },
            responsive: true,
      maintainAspectRatio: false
          }
        };
    
        new Chart(ctx, config);
      }

      
      const canvas = this.sensitiveChartCanvas.nativeElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  

      const nonSensitiveCount = this.allMetadata.length > 0 ? this.allMetadata.filter(table => table.sensitive === false).length : 0;
      const sensitiveCount = this.allMetadata.length > 0 ? this.allMetadata.filter(table =>  table.sensitive === true).length : 0;
      

      const sensitiveConfig: ChartConfiguration = {
        type: 'line', // Change the chart type to 'line'
        data: {
          labels: ['Sensitive', 'Non-Sensitive'],
          datasets: [{
            label: 'Sensitive vs Non-Sensitive',
            data: [sensitiveCount, nonSensitiveCount],
            borderColor: 'rgba(255, 99, 132, 1)', // Red color for the line
            fill: false // Do not fill the area under the line
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true // Start the y-axis from zero
            }
          }}}
      new Chart(ctx, sensitiveConfig);
    
    }
    
    
    
      getSelectedDataTableId(): number {
        // Assuming the route parameter name is 'id'
        return Number(this._activatedRoute.snapshot.paramMap.get('id'));
      }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fetchDataTables(){
      this._fileManagerService.getDataTables()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((dataTables: DataTable[]) => {
        console.log("DataTables fetched: ", dataTables); // Detailed log
        if (dataTables.length > 0) {
          console.log("First DataTable name: ", dataTables[0].name); // Check the first item
        }
        this.dataTables = dataTables;
        this._changeDetectorRef.markForCheck();
           this._changeDetectorRef.detectChanges();
      });
    }
    fetchAllMetadata(): void {
      this._fileManagerService.getAllMetadata().subscribe({
        next: (metadata: any[]) => {
          this.allMetadata = metadata;
          this.categorizeMetadata();
        },
        error: (error: any) => {
          console.error('Error fetching metadata:', error);
          // Handle error appropriately (e.g., display error message to user)
        }
      });
    }
    categorizeMetadata(): void {
      this.sensitiveMetadata = this.allMetadata.filter(meta => meta.sensitive === 1);
      this.nonSensitiveMetadata = this.allMetadata.filter(meta => meta.sensitive === 0);
    }
    
    openModal(dataTableId: number): void {
      // Call your backend service to check if metadata exists for this dataTableId
      this.metadataService.findMetadataByDataTableId(dataTableId).subscribe(response => {
          // Store fetched metadata
          this.metadata = response;
  
          // Check if metadata exists
          if (this.metadata) {
              // If metadata exists, open modal to show existing metadata
              this.openModalWithMetadata(dataTableId, this.metadata);
          } else {
              // If metadata does not exist, open modal to create new metadata
              this.openModal(dataTableId);
          }
      }, error => {
          // Handle error appropriately
          if (error.status === 404) {
              // If the error status is 404 (Not Found), it means metadata doesn't exist
              if (!this.metadata) {
                  // Open the modal only if metadata doesn't exist
                  console.log('Metadata not found for dataTableId:', dataTableId);
                  this.openModal(dataTableId);
              } else {
                  console.log('Metadata already exists for dataTableId:', dataTableId);
              }
          } else {
              // For other error statuses, log the error and handle it appropriately
              console.error('Error checking metadata:', error);
              // Handle error appropriately (e.g., display error message to user)
          }
      });
  }
  
  
    
    openModalWithMetadata(dataTableId: number, metadata: any): void {
      const dialogRef = this.dialog.open(MetadataListComponent, {
        width: '500px',
        data: { dataTableId: dataTableId, metadata: metadata } // Pass both dataTableId and metadata to MetadataListComponent
      });
    
      // After the modal is closed, update the dataTables list if needed
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Fetch dataTables again or update specific data
          this.fetchDataTables();
        }
      });
    }
    metadataExists(dataTable: DataTable): boolean {
      return dataTable.metadata !== null && dataTable.metadata !== undefined;
  }
    openModalview(dataTableId: number): void {
      const dialogRef = this.dialog.open(MetadataListComponent, {
        width: '500px',
        data: { dataTableId: dataTableId } // Pass both dataTableId and metadata to MetadataListComponent
      });
    
      // After the modal is closed, update the dataTables list if needed
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Fetch dataTables again or update specific data
          this.fetchDataTables();
        }
      });
    }
    
  
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

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
    onFileSelected(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList) {
          this.selectedFile = fileList[0];
        } else {
          this.selectedFile = null;
        }
      }
    
      onUpload() {
        if (!this.description.trim()) { // Check if description is empty or only whitespace
          alert('Please enter a description for the file.');
          return;
        }
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile, this.selectedFile.name);
          formData.append('description', this.description);
          this._fileManagerService.uploadFile(formData).subscribe({
            next: () => {
                window.location.reload(); // or use Angular Router for a more SPA-friendly approach
              },
            error: (error) => {
              console.error('Upload failed', error);
            }
          });
        } else {
          alert('No file selected');
        }
      }


      //navigation 
      navigateToSchemas(idTable: number): void {
        this._router.navigate(['./schemas/', idTable], { relativeTo: this._activatedRoute });
    }
    
}
