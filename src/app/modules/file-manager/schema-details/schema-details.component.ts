import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Schema } from 'app/modules/models/data-table';
import { FileManagerService } from '../file-manager.service';


@Component({
    selector: 'app-schema-details',
    templateUrl: './schema-details.component.html',
    styleUrls: ['./schema-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaDetailsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    schema$: BehaviorSubject<Schema> = new BehaviorSubject<Schema>(null);
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { schema: Schema },
      private _changeDetectorRef: ChangeDetectorRef,
      private _fileManagerService: FileManagerService,
      private _dialogRef: MatDialogRef<SchemaDetailsComponent>,
      private _dialog: MatDialog
  ) {
      console.log(data.schema); // Check if the schema data is correct
  }

    ngOnInit(): void {
        this.schema$.next(this.data.schema);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    updateSchemaDetails(schema: Schema): void {
        this._fileManagerService.updateSchema(schema).subscribe({
            next: () => {
                this.schema$.next(schema);
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => console.error('Error updating schema', error)
        });
    }

    addTagToSchema(schema: Schema, tag: string): void {
      if (!tag.trim()) {
          return;
      }

      const updatedTags = schema.tags ? [...schema.tags, tag] : [tag];
      this.updateTagsInSchema(schema.idSchema, updatedTags);
  }

  removeTagFromSchema(schema: Schema, tag: string): void {
      const updatedTags = schema.tags.filter(t => t !== tag);
      this.updateTagsInSchema(schema.idSchema, updatedTags);
  }

  private updateTagsInSchema(idSchema: number, tags: string[]): void {
      this._fileManagerService.updateTags(idSchema, tags).subscribe(() => {
       
          const currentSchema = this.schema$.getValue();
          currentSchema.tags = tags;
          this.schema$.next(currentSchema);
          this._changeDetectorRef.markForCheck();
      });
  }
  deleteSchema(schema: Schema): void {
    if(confirm("Are you sure you want to delete this schema?")) {
      console.log('Attempting to delete schema with ID:', schema.idSchema);
      this._fileManagerService.deleteSchema(schema.idSchema).subscribe({
        next: () => {
          console.log('Schema deleted successfully');
          this._dialogRef.close(); 
          
        },
        error: (error) => {
          console.error('There was an error deleting the schema', error);

        }
      });
    }
  }
  
  
    // Implement openTagAddDialog(schema) and deleteSchema(schema) as needed

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    
}
