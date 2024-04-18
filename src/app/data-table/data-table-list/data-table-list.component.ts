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

  mappingObject = {
    'union|membership|labor|labor|rights': 'GDPR:Trade union',
    'race|ethnicity|nationality|ancestry|background': 'GDPR:race/ethnic',
    'health|condition|illness|disease|diagnosis|treatment|prescription': 'Medical information',
    'fingerprint|dna|voiceprint|scan': 'Biometric information',
    'income|assets|debts|bank|credit|investment|card': 'Financial information',
    'dna|genome|genetic|genealogy|inherited|traits|predisposition': 'Genetic information',
    'ideology|political|party|voting|affiliation': 'Political opinions',
    'religion|faith|belief|religious|worship': 'Religious beliefs',
    'lgbtq+|sexual|gender|queer|trans': 'Sexual orientation',
    'child|minor|youth|underage|guardian|kids': 'About children',
  };

  getTagsForDataTable(dataTable: DataTable): string[] {
    let tags: string[] = [];
    for (const pattern in this.mappingObject) {
      const words = pattern.split('|');
      const found = words.some(word => dataTable.name.toLowerCase().includes(word));
      if (found) {
        tags.push((this.mappingObject as any)[pattern]);
      }
    }
    return tags;
  }

  getTagsForSchema(schema: Schema): string[] {
    let tags: string[] = [];
    for (const pattern in this.mappingObject) {
      const words = pattern.split('|');
      const found = words.some(word => schema.name.toLowerCase().includes(word));
      if (found) {
        tags.push((this.mappingObject as any)[pattern]);
      }
    }
    return tags;
  }

  // Function to check if any schema has tags
  hasTagsForAnySchema(schemas: Schema[]): boolean {
    return schemas.some(schema => this.getTagsForSchema(schema).length > 0);
  }

  openDetailsPanel(dataTable: any) {
    
    if (dataTable && dataTable.idTable) {
      console.log("Opening details panel for data table:", dataTable);
      // Navigate to a new route with details panel at the top
      this.router.navigate(['/test', dataTable.idTable]);
    } else {
      console.error("Data table or its ID is undefined:", dataTable);
    }
  }

}
