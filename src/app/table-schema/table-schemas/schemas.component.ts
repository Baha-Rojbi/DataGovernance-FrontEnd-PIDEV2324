import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import { Schema } from '../../models/data-table';
import { EditSchemaDialogComponent } from '../edit-schema-dialog/edit-schema-dialog.component';


@Component({
  selector: 'app-schemas',
  templateUrl: './schemas.component.html',
  styleUrl: './schemas.component.css'
})
export class SchemasComponent implements OnInit, OnDestroy  {
  schemas: Schema[] = [];
  newTag: string = '';
  showEditIcon: boolean[] = [];
  editMode: boolean[] = [];
  private subscriptions = new Subscription();

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        const tableId = +params['id'];
        this.uploadService.getSchemasForTable(tableId).subscribe(
          data => this.schemas = data,
          error => console.error('Error retrieving schemas', error)
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openEditDialog(schema: Schema): void {
    const dialogRef = this.dialog.open(EditSchemaDialogComponent, {
      width: '250px',
      data: { description: schema.description }
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          schema.description = result;
          this.uploadService.updateSchema(schema).subscribe(
            success => console.log('Update successful'),
            error => console.error('Error updating schema', error)
          );
        }
      })
    );
  }
  addTag(schema: Schema, idx: number): void {
    if (!schema.tags) {
      schema.tags = []; // Initialize tags array if it's undefined
      this.editMode[idx] = false;
    }

    if (this.newTag) {
      schema.tags.push(this.newTag);
      this.updateTags(schema);
      this.newTag = ''; // Clear the input after adding
    }
  }

  removeTag(schema: Schema, tagIndex: number): void {
    if (schema.tags) {
      schema.tags.splice(tagIndex, 1);
      this.updateTags(schema);
    }
  }

  updateTags(schema: Schema): void {
    // Use 'schema.tags || []' to provide an empty array if tags are undefined
    this.uploadService.updateTags(schema.idSchema, schema.tags || []).subscribe(
      success => console.log('Tags updated successfully'),
      error => console.error('Error updating tags', error)
    );
  }

  cancelEdit(): void {
    // Handle cancelation logic here, if necessary
  }
  

}
