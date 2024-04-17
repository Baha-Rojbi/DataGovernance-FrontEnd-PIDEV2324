import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FileManagerListComponent } from 'app/modules/file-manager/list/list.component';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { DataTable, Schema } from 'app/modules/models/data-table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'file-manager-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
    
    dataTable: DataTable | null = null; // Replace `item: Item` with this
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    schemas: Schema[] = []; // Store fetched schemas here
    isEditingDescription = false; // Track if we're editing the description
    isUpdating = false; // To track if the update form should be shown
  
    editedName: string | undefined;
    editedCreator: string | undefined;
    editedDescription: string | undefined;
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private _activatedRoute: ActivatedRoute,
        public dialog: MatDialog, 
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this._fileManagerListComponent.matDrawer.open();
    
        const dataTableId = this.getSelectedDataTableId();
        if (dataTableId > 0) {
            this._fileManagerService.getDataTableById(dataTableId)
  .pipe(
    takeUntil(this._unsubscribeAll),
    switchMap((dataTable: DataTable) => {
      this.dataTable = dataTable;
      return this._fileManagerService.getSchemasForTable(dataTableId);
    })
  )
  .subscribe({
    next: (schemas: Schema[]) => {
      console.log("Fetched schemas:", schemas); // Check what you're receiving
      this.schemas = schemas;
      this._changeDetectorRef.markForCheck();
    },
    error: error => {
      console.error("Failed to fetch DataTable or its schemas:", error);
    }
  });

        } else {
            console.error("Invalid DataTable ID:", dataTableId);
            
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._fileManagerListComponent.matDrawer.close();
    }

    trackByFn(index: number, item: any): any {
        return item.idTable || index;
    }


    getSelectedDataTableId(): number {

        return Number(this._activatedRoute.snapshot.paramMap.get('id'));
      }
      
      startEditDescription(): void {
        this.editedDescription = this.dataTable?.description; 
        this.isEditingDescription = true; 
    }
//description update
    confirmEditDescription(): void {
        if (this.dataTable && this.editedDescription !== undefined) {
            const updatedDataTable = { ...this.dataTable, description: this.editedDescription };
            this._fileManagerService.updateDataTable(updatedDataTable).subscribe({
                next: () => {
                    this.dataTable!.description = this.editedDescription; 
                    this.isEditingDescription = false; 
                    this._changeDetectorRef.markForCheck(); 
                   
                },
                error: (error) => {
                    console.error("Failed to update description:", error);
                   
                }
            });
        }
    }
    

    cancelEditDescription(): void {
        this.isEditingDescription = false; 
    }
    //update

    startUpdate(): void {
       
        if (this.dataTable) {
            this.editedName = this.dataTable.name;
            this.editedCreator = this.dataTable.creator;
            this.editedDescription = this.dataTable.description;
            this.isUpdating = true; // Enter update mode
            
        }
    }

    confirmUpdate(): void {
      if (this.dataTable) {
          const updatedDataTable: DataTable = {
              ...this.dataTable,
              name: this.editedName || this.dataTable.name, 
              creator: this.editedCreator || this.dataTable.creator,
              description: this.editedDescription || ''
          };
          
          this._fileManagerService.updateDataTable(updatedDataTable).subscribe({
              next: () => {
                  this.dataTable = updatedDataTable; 
                  alert("DataTable updated successfully!"); 
                  this.isUpdating = false; 
                  this._changeDetectorRef.markForCheck(); // Trigger change detection
              },
              error: (error) => {
                  console.error("Failed to update DataTable:", error);
                  
              }
          });
      }
  }
  

    cancelUpdate(): void {
        this.isUpdating = false; // Exit update mode without saving changes
    }
    downloadPdf(tableId: number): void {
        this._fileManagerService.downloadDataTablePdf(tableId).subscribe(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'datatable-details.pdf';
          link.click();
          URL.revokeObjectURL(link.href);
        });
      }
 toggleArchiveStatus(archived: boolean): void {
    if (this.dataTable) {
      this._fileManagerService.toggleArchiveStatus(this.dataTable.idTable).subscribe({
        next: () => {
          this.dataTable.archived = archived;
          const message = archived ? 'Data table archived' : 'Data table unarchived';
          this._snackBar.open(message, 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          console.error('Failed to toggle archive status:', error);
          this._snackBar.open('Failed to toggle archive status', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}
