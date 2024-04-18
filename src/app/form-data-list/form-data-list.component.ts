import { Component, OnInit } from '@angular/core';
import { FormDataService } from '../services/form-data.service';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-form-data-list',
  templateUrl: './form-data-list.component.html',
  styleUrls: ['./form-data-list.component.css']
})
export class FormDataListComponent implements OnInit {
  formDataList: any[] = [];
  selectedFormData: any;

  constructor(private formDataService: FormDataService) { }

  ngOnInit(): void {
    this.getFormDataList();
  }

  getFormDataList(): void {
    this.formDataService.getAllFormData().subscribe(data => {
      this.formDataList = data;
    });
  }

  getFormDataDetails(formData: any): void {
    this.selectedFormData = formData;
  }

exportPdf(formData: any): void {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 10;

  doc.text('Selected Form Data', 10, y);
  y += lineHeight;

  // Loop through form data and add to PDF
  Object.keys(formData).forEach(key => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const value = formData[key];
    doc.text(`${label}: ${value}`, 10, y);
    y += lineHeight;
  });

  // Save the PDF
  doc.save('form-data.pdf');
}
}
