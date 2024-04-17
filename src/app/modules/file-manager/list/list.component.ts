import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { Item, Items } from 'app/modules/file-manager/file-manager.types';
import { DataTable } from 'app/modules/models/data-table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CreateDataTableFormComponent } from '../create-data-table-form/create-data-table-form.component';

@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    styleUrls: ['./list.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    dataTables: DataTable[] = [];
    selectedDataTable: DataTable | null = null;
     selectedFile: File | null = null; // Make selectedFile nullable
  description: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    showArchived: boolean = false;
    filteredDataTables: DataTable[] = [];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        public dialog: MatDialog
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
        // Fetch the list of DataTables
        this.fetchDataTables();
        this._fileManagerService.getDataTables()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((dataTables: DataTable[]) => {
          console.log("DataTables fetched: ", dataTables); // Detailed log
          if (dataTables.length > 0) {
            console.log("First DataTable name: ", dataTables[0].name); // Check the first item
          }
          this.dataTables = dataTables;
          this._changeDetectorRef.markForCheck();
        });

      
        // Fetch a single DataTable by ID when needed
        
        const selectedDataTableId: number = this.getSelectedDataTableId(); 
        this._fileManagerService.getDataTableById(selectedDataTableId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((dataTable: DataTable) => {
            this.selectedDataTable = dataTable;
            this._changeDetectorRef.markForCheck();
          });
      
        // Media query change subscription
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((state) => {
            this.drawerMode = state.matches ? 'side' : 'over';
            this._changeDetectorRef.markForCheck();
          });
      }
      getSelectedDataTableId(): number {
      
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
    
    drop(event: CdkDragDrop<DataTable[]>): void {
      moveItemInArray(this.dataTables, event.previousIndex, event.currentIndex);
      this._changeDetectorRef.markForCheck();
    }
    fetchDataTables(): void {
      this._fileManagerService.getDataTables()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((dataTables: DataTable[]) => {
              this.dataTables = dataTables;
              this.filterDataTables();
          });
  }

  filterDataTables(): void {
      this.filteredDataTables = this.dataTables.filter(dataTable => this.showArchived ? true : !dataTable.archived);
      this._changeDetectorRef.markForCheck(); // Ensure Angular updates the view
  }

  onToggleChange(): void {
      this.filterDataTables(); // Filter the list of dataTables based on the new toggle state
  }
  openCreateForm(): void {
    const dialogRef = this.dialog.open(CreateDataTableFormComponent, {
      width: '600px', // Set your desired width
      height: '400px', // Set your desired height
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // You can use the result from the dialog if needed
    });
  }
}
