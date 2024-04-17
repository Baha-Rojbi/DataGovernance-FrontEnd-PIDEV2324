import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileManagerService } from '../file-manager.service';
@Component({
  selector: 'app-create-data-table-form',
  templateUrl: './create-data-table-form.component.html',
  styleUrls: ['./create-data-table-form.component.scss']
})
export class CreateDataTableFormComponent {
  name: string = '';
  description: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateDataTableFormComponent>,
    private _fileManagerService: FileManagerService
  ) {}

  createDataTable(): void {
    this._fileManagerService.createDataTable(this.name, this.description).subscribe({
      next: (response) => {
        console.log('DataTable created:', response);
        this.dialogRef.close(); // Close the dialog upon successful submission
      },
      error: (error) => {
        console.error('Error creating DataTable:', error);
      }
    });
  }

  // Optionally, a method to close the dialog without submitting
  closeDialog(): void {
    this.dialogRef.close();
  }
}
