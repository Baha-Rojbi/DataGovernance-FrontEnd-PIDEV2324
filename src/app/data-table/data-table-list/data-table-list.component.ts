import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UploadService } from '../../services/upload.service';

import { DataTable, Schema } from '../../models/data-table';
import { EditDataTableDialogComponent } from '../edit-data-table-dialog/edit-data-table-dialog.component';

import { map, startWith } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-table-list',
  templateUrl: './data-table-list.component.html',
  styleUrls: ['./data-table-list.component.css']
})
export class DataTableListComponent implements OnInit {
  dataTables: DataTable[] = [];
  selectedDataTable: DataTable | null = null;
  selectedSchemas: Schema[] = [];
  allSchemas: Schema[] = []; // Stores all schemas for filtering

  // Form controls for search and filters
  searchQuery: string = '';
  ownersFormControl = new FormControl();
  ownerSearchControl = new FormControl();
  schemaSearchControl = new FormControl();

  // Data for dropdowns and filters
  uniqueOwners: { owner: string; count: number }[] = [];
  selectedOwners: { owner: string; count: number }[] = [];
  selectedSchemasFilter: Schema[] = [];
  filteredDataTables: DataTable[] = [];
  filteredOwners!: Observable<{ owner: string; count: number }[]>;
  filteredSchemas!: Observable<Schema[]>;
  
  // Aggregate data
  aggregatedTags: Set<string> = new Set(); // Store for aggregated tags

  constructor(
    private dataService: UploadService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDataTables();
    this.fetchAllSchemas();
    this.setupFilteredOwners();
    this.setupFilteredSchemas();
  }
   // Fetch all schemas from the backend
   fetchAllSchemas(): void {
    this.dataService.getSchemasForTable(0) // Assuming 0 fetches all
      .subscribe(schemas => {
        this.allSchemas = schemas;
      });
  }
  // Setup observables for filtering owners and schemas dynamically
  setupFilteredOwners(): void {
    this.filteredOwners = this.ownerSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.owner),
        map(owner => owner ? this.filterOwners(owner) : this.uniqueOwners.slice())
      );
  }
  setupFilteredSchemas(): void {
    this.filteredSchemas = this.schemaSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterSchemas(name) : this.allSchemas.slice())
      );
  }
  // Fetch all data tables and prepare unique owners list
  fetchDataTables(): void {
    this.dataService.getDataTables().subscribe(data => {
      this.dataTables = data;
      this.filteredDataTables = data;
      this.prepareOwnersList();
  
      // Check if dataTables is not empty and select the first one by default
      if (this.dataTables.length > 0) {
        this.selectDataTable(this.dataTables[0]);
      }
    });
  }
  
// Utility functions for filtering, selecting, and managing data tables and schemas
filterOwners(value: string): { owner: string; count: number }[] {
  const filterValue = value.toLowerCase();
  return this.uniqueOwners.filter(option => option.owner.toLowerCase().includes(filterValue));
}

filterSchemas(value: string): Schema[] {
  const filterValue = value.toLowerCase();
  return this.allSchemas.filter(schema => schema.name.toLowerCase().includes(filterValue));
}
filterDataTables(): void {
  let initialFilteredTables = this.dataTables.filter(table =>
    (this.selectedOwners.length === 0 || this.selectedOwners.map(owner => owner.owner).includes(table.creator)) &&
    (table.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
    (table.creator && table.creator.toLowerCase().includes(this.searchQuery.toLowerCase())))
  );

  if (this.selectedSchemasFilter.length > 0) {
    this.filteredDataTables = initialFilteredTables.filter(table =>
      // Safely check if schemas exist and then use `.some`
      table.schemas && table.schemas.some(schema => 
        this.selectedSchemasFilter.some(selectedSchema => selectedSchema.idSchema === schema.idSchema))
    );
  } else {
    this.filteredDataTables = initialFilteredTables;
  }
}
// Add or remove selections from filters
selectOwner(event: any): void {
  const selectedValue = event.option.value;
  if (!this.selectedOwners.find(owner => owner.owner === selectedValue.owner)) {
    this.selectedOwners.push(selectedValue);
  }
  this.ownerSearchControl.setValue('');
  this.filterDataTablesByOwner();
}
removeOwner(owner: { owner: string; count: number }): void {
  const index = this.selectedOwners.indexOf(owner);
  if (index >= 0) {
    this.selectedOwners.splice(index, 1);
  }
  this.filterDataTablesByOwner();
}
  selectSchema(event: any): void {
    const selectedValue = event.option.value;
    if (!this.selectedSchemasFilter.find(schema => schema.idSchema === selectedValue.idSchema)) {
      this.selectedSchemasFilter.push(selectedValue);
    }
    this.schemaSearchControl.setValue('');
    this.filterDataTables();
  }

  removeSchema(schema: Schema): void {
    const index = this.selectedSchemasFilter.indexOf(schema);
    if (index >= 0) {
      this.selectedSchemasFilter.splice(index, 1);
    }
    this.filterDataTables();
  }

  displayFnSchema(schema?: Schema): string | undefined {
    return schema ? schema.name : undefined;
  }
  
  
  displayFn(owner?: { owner: string; count: number }): string | undefined {
    return owner ? owner.owner : undefined;
  }
  
 
  prepareOwnersList(): void {
    const ownerMap = new Map<string, number>();
    this.dataTables.forEach(table => {
      const owner = table.creator;
      if (owner) {
        ownerMap.set(owner, (ownerMap.get(owner) || 0) + 1);
      }
    });

    this.uniqueOwners = Array.from(ownerMap, ([owner, count]) => ({ owner, count }));
  }
  filterDataTablesByOwner(): void {
    const selectedOwners = this.ownersFormControl.value || [];
    if (this.selectedOwners.length) {
      this.filteredDataTables = this.dataTables.filter(table => 
        this.selectedOwners.map(owner => owner.owner).includes(table.creator)
      );
    } else {
      this.filteredDataTables = this.dataTables;
    }
  }
  
  
  selectDataTable(dataTable: DataTable): void {
    this.selectedDataTable = dataTable;
    this.fetchSchemas(dataTable.idTable); // Fetch schemas when a data table is selected
  }

  fetchSchemas(tableId: number): void {
    this.dataService.getSchemasForTable(tableId).subscribe(schemas => {
      this.selectedSchemas = schemas;
      this.aggregateTags(); // Call the method to aggregate tags after schemas are fetched
    });
  }
  aggregateTags(): void {
    this.aggregatedTags.clear(); // Clear previous tags
    this.selectedSchemas.forEach(schema => {
      if (schema.tags) { // Check if tags are defined
        schema.tags.forEach(tag => this.aggregatedTags.add(tag));
      }
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
