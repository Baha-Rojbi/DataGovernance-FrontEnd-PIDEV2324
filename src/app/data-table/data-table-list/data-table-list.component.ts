import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

import { DataTable, Schema } from '../../models/data-table';
import { EditDataTableDialogComponent } from '../edit-data-table-dialog/edit-data-table-dialog.component';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-data-table-list',
  templateUrl: './data-table-list.component.html',
  styleUrls: ['./data-table-list.component.css']
})
export class DataTableListComponent implements OnInit {
  dataTables: DataTable[] = [];
  selectedDataTable: DataTable | null = null; 
  selectedSchemas: Schema[] = []; 
  aggregatedTags: Set<string> = new Set(); // Store for aggregated tags
  searchQuery: string = '';// property for storing search query
  filteredDataTables: DataTable[] = []; // To store filtered data tables
  ownersFormControl = new FormControl(); // For selecting owners
  uniqueOwners: { owner: string; count: number }[] = []; // Array of unique owners with counts
  ownerSearchControl = new FormControl();
  selectedOwners: { owner: string; count: number }[] = []; // For tracking selected owners
  filteredOwners!: Observable<{ owner: string; count: number }[]>;

  
  constructor(private dataService: UploadService, private dialog: MatDialog, private router: Router) {
    this.setupFilteredOwners();
  }


  ngOnInit(): void {
    this.fetchDataTables();
    this.setupFilteredOwners();
    
  }
  setupFilteredOwners(): void {
    this.filteredOwners = this.ownerSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.owner),
        map(owner => owner ? this.filterOwners(owner) : this.uniqueOwners.slice())
      );
  }
  filterOwners(value: string): { owner: string; count: number }[] {
    const filterValue = value.toLowerCase();
    return this.uniqueOwners.filter(option => option.owner.toLowerCase().includes(filterValue));
  }
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
  displayFn(owner?: { owner: string; count: number }): string | undefined {
    return owner ? owner.owner : undefined;
  }
  
  fetchDataTables(): void {
    this.dataService.getDataTables().subscribe(data => {
      this.dataTables = data;
      this.filteredDataTables = data;
      this.prepareOwnersList();
    });
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
  filterDataTables(): void {
    this.filteredDataTables = this.dataTables.filter(table =>
      table.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (table.creator && table.creator.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
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
