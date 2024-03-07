import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit{
  dataTables: any[] = [];


  constructor(private uploadService: UploadService) {}

  ngOnInit() {}
  getDataTablesSorted(order: string){
    this.uploadService.getDataTablesSorted(order).subscribe(data => {
      this.dataTables = data;
    });
  }

}
