import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  formDataService: UploadService;



  constructor(private fb: FormBuilder, private route: ActivatedRoute,private uploadService: UploadService) {
    this.formDataService = uploadService;
   } // Inject ActivatedRoute

  ngOnInit(): void {
    this.form = this.fb.group({
      tableName: ['', Validators.required], // Add validation rules as needed
      owner: ['', Validators.required], // Add validation rules as needed
      completeness: ['', Validators.required],
      conformity: ['', Validators.required],
      uniqueness: ['', Validators.required],
      accuracy: ['', Validators.required],
      validity: ['', Validators.required],
      consistency: ['', Validators.required],
      integrity: ['', Validators.required]
    });

    // Fetch the table name and owner from the route params
    this.route.queryParams.subscribe(params => {
      this.form.patchValue({
        tableName: params['name'],
        owner: params['creator'] 
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formDataService.saveFormData(this.form.value).subscribe(
        response => {
          console.log('Form data saved successfully:', response);
          // Optionally, reset the form
          // this.form.reset();
        },
        error => {
          console.error('Error saving form data:', error);
        }
      );
    }
  }
}
