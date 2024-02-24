import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-schema-dialog',
  templateUrl: './edit-schema-dialog.component.html',
  styleUrl: './edit-schema-dialog.component.css'
})
export class EditSchemaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditSchemaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
