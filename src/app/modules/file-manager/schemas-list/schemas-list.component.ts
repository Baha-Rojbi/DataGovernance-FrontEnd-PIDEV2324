import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schema } from 'app/modules/models/data-table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FileManagerService } from '../file-manager.service';
import { SchemaDetailsComponent } from '../schema-details/schema-details.component';
import { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AddSchemaDialogComponent } from '../add-schema-dialog/add-schema-dialog.component';

@Component({
  selector: 'app-schemas-list',
  templateUrl: './schemas-list.component.html',
  styleUrls: ['./schemas-list.component.scss']
})
export class SchemasListComponent implements OnInit, OnDestroy{
  schemas: Schema[] = [];
  filteredSchemas: Schema[] = []; // Add this line
  selectedTag: string | null = null;
 drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  private subscriptions = new Subscription();
  tableId: number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fileManagerService: FileManagerService,
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

 
  ngOnInit(): void {
    this.subscriptions.add(
      this._activatedRoute.params.subscribe(params => {
        this.tableId = +params['id'];
        this._fileManagerService.getSchemasForTable(this.tableId).subscribe(
          data => {
            this.schemas = data;
            console.log("Schemas fetched successfully:", data);
            this.filteredSchemas = [...this.schemas]; 
            this._changeDetectorRef.detectChanges(); // Manually trigger change detection
          },
          error => console.error('Error retrieving schemas', error)
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  trackByFn(index: number, item: any): any {
    return item.id; 
  }
  filterByQuery(query: string): void
  {
      this.searchQuery$.next(query);
  }

  // In your component that lists schemas
  openSchemaDialog(schema: Schema): void {
    this._matDialog.open(SchemaDetailsComponent, {
        autoFocus: false,
        data: { schema: schema }
    });
}
filterByTag(tag: string): void {
  if (this.selectedTag === tag) {
    this.selectedTag = null;
    this.filteredSchemas = [...this.schemas];
  } else {
    this.selectedTag = tag;
    this.filteredSchemas = this.schemas.filter(schema => schema.tags.includes(tag));
  }
}
openAddSchemaDialog(tableId: number): void {
  const dialogRef = this._matDialog.open(AddSchemaDialogComponent, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this._fileManagerService.createSchema(tableId, result).subscribe({
        next: (newSchema) => {
          // Optionally refresh the list or add the new schema to the view
          console.log('New schema added:', newSchema);
          this.schemas.push(newSchema);
          this.filteredSchemas.push(newSchema); 
          this._changeDetectorRef.markForCheck(); // Ensure UI update
        },
        error: (error) => console.error('Error adding schema:', error)
      });
    }
  });
}

}
