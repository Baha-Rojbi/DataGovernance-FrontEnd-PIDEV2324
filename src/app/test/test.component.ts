import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  testForm: FormGroup;
  testResults: any[] = [];

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService) { 
    this.testForm = this.formBuilder.group({
      testName: ['', Validators.required],
      minColumns: ['', Validators.required],
      maxColumns: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // You can initialize anything else in ngOnInit if needed
  }

  runTest(): void {
    if (this.testForm.invalid) {
      return;
    }

    const testName = this.testForm.value.testName;
    const minColumns = this.testForm.value.minColumns;
    const maxColumns = this.testForm.value.maxColumns;

    // Perform your test logic here using the provided values
    // Example:
    this.uploadService.fetchData().subscribe((data: any[]) => {
      // Filter data based on column count
      const filteredData = data.filter(item => item.columns >= minColumns && item.columns <= maxColumns);
      // Perform further actions with filteredData
      this.testResults = filteredData;
    });
  }
}
