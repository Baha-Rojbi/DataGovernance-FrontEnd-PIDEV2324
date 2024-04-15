import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FileManagerListComponent } from 'app/modules/file-manager/list/list.component';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { DataTable, Schema } from 'app/modules/models/data-table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

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
    // Temporary storage for edited values
    editedName: string | undefined;
    editedCreator: string | undefined;
    editedDescription: string | undefined;
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private _activatedRoute: ActivatedRoute,
        public dialog: MatDialog, // Add this line
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
            // Handle the case where dataTableId is not valid (e.g., show an error or redirect)
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

    // Implement getSelectedDataTableId based on your app's routing logic
    getSelectedDataTableId(): number {
        // Assuming the route parameter name is 'id'
        return Number(this._activatedRoute.snapshot.paramMap.get('id'));
      }
      
      startEditDescription(): void {
        this.editedDescription = this.dataTable?.description; // Initialize with the current description
        this.isEditingDescription = true; // Enter editing mode
    }
//description update
    confirmEditDescription(): void {
        if (this.dataTable && this.editedDescription !== undefined) {
            const updatedDataTable = { ...this.dataTable, description: this.editedDescription };
            this._fileManagerService.updateDataTable(updatedDataTable).subscribe({
                next: () => {
                    this.dataTable!.description = this.editedDescription; // Update the local state
                    this.isEditingDescription = false; // Ensure this line is executed after a successful update
                    this._changeDetectorRef.markForCheck(); // Notify Angular to check for changes
                    // Optional: Show a success message
                },
                error: (error) => {
                    console.error("Failed to update description:", error);
                    // Optional: Handle error, potentially setting isEditingDescription based on the error
                }
            });
        }
    }
    

    cancelEditDescription(): void {
        this.isEditingDescription = false; // Exit editing mode without saving changes
    }
    //update

    startUpdate(): void {
        // Initialize the edited values with the current dataTable values
        if (this.dataTable) {
            this.editedName = this.dataTable.name;
            this.editedCreator = this.dataTable.creator;
            this.editedDescription = this.dataTable.description;
            this.isUpdating = true; // Enter update mode
            
        }
    }

    confirmUpdate(): void {
        if (this.dataTable) {
            // Update the dataTable with the edited values
            const updatedDataTable: DataTable = {
                ...this.dataTable,
                name: this.editedName || this.dataTable.name, // Fallback to original if undefined
                creator: this.editedCreator || this.dataTable.creator,
                description: this.editedDescription || ''
            };
            
            this._fileManagerService.updateDataTable(updatedDataTable).subscribe({
                next: () => {
                    this.dataTable = updatedDataTable; // Update local state
                    alert("DataTable updated successfully!"); // Show success message
                    this.isUpdating = false; // Exit update mode
                    this._changeDetectorRef.markForCheck(); // Trigger change detection
                },
                error: (error) => {
                    console.error("Failed to update DataTable:", error);
                    // Optionally handle error, e.g., show an error message
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

}
