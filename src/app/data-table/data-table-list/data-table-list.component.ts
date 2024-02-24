import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

import { DataTable, Schema } from '../../models/data-table';
import { EditDataTableDialogComponent } from '../edit-data-table-dialog/edit-data-table-dialog.component';

@Component({
  selector: 'app-data-table-list',
  templateUrl: './data-table-list.component.html',
  styleUrls: ['./data-table-list.component.css']
})
export class DataTableListComponent implements OnInit {
  dataTables: DataTable[] = [];
  selectedDataTable: DataTable | null = null; 
  selectedSchemas: Schema[] = []; 
  constructor(private dataService: UploadService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.fetchDataTables();
  }

  fetchDataTables(): void {
    this.dataService.getDataTables().subscribe(data => {
      this.dataTables = data;
    });
  }
  selectDataTable(dataTable: DataTable): void {
    this.selectedDataTable = dataTable;
    this.fetchSchemas(dataTable.idTable); // Fetch schemas when a data table is selected
  }

  fetchSchemas(tableId: number): void {
    this.dataService.getSchemasForTable(tableId).subscribe(schemas => {
      this.selectedSchemas = schemas; // Store fetched schemas
    });
  }

  openEditForm(dataTable: DataTable): void {
    const dialogRef = this.dialog.open(EditDataTableDialogComponent, {
      width: '500px',
      data: dataTable
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateDataTable(result);
      }
    });
  }

  updateDataTable(updatedDataTable: DataTable): void {
    this.dataService.updateDataTable(updatedDataTable).subscribe({
      next: (response) => console.log("Update successful", response),
      error: (error) => console.error("Update failed", error)
    });
  }

  openSchemas(dataTable: DataTable): void {
    this.router.navigate(['/schemas', dataTable.idTable]);
  }

 
}
