import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { Item, Items } from 'app/modules/file-manager/file-manager.types';
import { DataTable } from 'app/modules/models/data-table';

@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
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

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
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
        // This example assumes you have a way to get the selected DataTable ID (e.g., from the URL or a selection event)
        const selectedDataTableId: number = this.getSelectedDataTableId(); // Implement this method based on your app logic
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
