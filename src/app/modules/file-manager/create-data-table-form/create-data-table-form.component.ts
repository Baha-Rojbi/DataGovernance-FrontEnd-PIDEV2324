import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileManagerService } from '../file-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-data-table-form',
  templateUrl: './create-data-table-form.component.html',
  styleUrls: ['./create-data-table-form.component.scss']
})
export class CreateDataTableFormComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateDataTableFormComponent>,
    private formBuilder: FormBuilder,
    private _fileManagerService: FileManagerService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      description: ['', Validators.required]
    });
  }

  createDataTable(): void {
    if (this.form.valid) {
      this._fileManagerService.createDataTable(this.form.value.name, this.form.value.description).subscribe({
        next: (response) => {
          console.log('DataTable created:', response);
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error creating DataTable:', error);
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
