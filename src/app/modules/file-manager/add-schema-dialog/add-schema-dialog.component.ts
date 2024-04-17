import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-schema-dialog',
  templateUrl: './add-schema-dialog.component.html',
  styleUrls: ['./add-schema-dialog.component.scss']
})
export class AddSchemaDialogComponent {
  addSchemaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addSchemaForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['']
    });
  }
}
