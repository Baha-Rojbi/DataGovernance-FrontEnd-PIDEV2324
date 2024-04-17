import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MetadataService } from './metatadata.service';

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataListComponent {
  metadata: any = {}; 
  dataTableId: number | undefined;

  constructor(
    private metadataService: MetadataService, 
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<MetadataListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataTableId = data.dataTableId;

    // If metadata is passed from the parent component, populate the form fields with it
    if (data.metadata) {
      this.metadata = data.metadata;
      this.metadata.accessRights = this.data.metadata.accessRights.split(',').map((item: string) => item.trim());

    }
  }
  

  closeModal(): void {
    this.dialogRef.close();
  }
  
  saveMetadata() {
    if (this.dataTableId !== undefined) {
      this.metadata.accessRights = this.metadata.accessRights.join(', ');
      this.metadata.sensitive = parseInt(this.metadata.sensitive); // Convert to number

      this.metadataService.createMetadata(this.dataTableId, this.metadata)
    
        .subscribe(
          response => {
            console.log('Metadata created successfully:', response);
            // Optionally, reset the form
            this.metadata = {}; // Clear metadata fields

            // If used in a modal, close the modal after successful submission
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error creating metadata:', error);
            // Handle error and display message to user
          }
        );
    } else {
      console.error('dataTableId is undefined');
      // Handle the case when dataTableId is undefined
    }
  }
}
