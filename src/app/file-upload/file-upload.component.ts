import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  selectedFile: File | null = null; // Make selectedFile nullable
  description: string = '';

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null; // Ensure this.selectedFile is null if no file is selected
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('description', this.description);
      this.uploadService.uploadFile(formData).subscribe(response => {
        console.log(response);
      });
    } else {
      console.error('No file selected');
    }
  }
}
