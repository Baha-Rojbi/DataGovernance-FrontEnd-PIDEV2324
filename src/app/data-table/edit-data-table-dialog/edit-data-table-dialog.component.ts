import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataTable } from '../../models/data-table';


@Component({
  selector: 'app-edit-data-table-dialog',
  templateUrl: './edit-data-table-dialog.component.html',
  styleUrls: ['./edit-data-table-dialog.component.css']
})
export class EditDataTableDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDataTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataTable
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}
