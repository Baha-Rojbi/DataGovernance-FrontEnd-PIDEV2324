import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormComponent } from './form/form.component'; 
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { EditDataTableDialogComponent } from './data-table/edit-data-table-dialog/edit-data-table-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { EditSchemaDialogComponent } from './table-schema/edit-schema-dialog/edit-schema-dialog.component';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';
import { FormDataListComponent } from './form-data-list/form-data-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent, 
    FileUploadComponent,
    DataTableListComponent,
    EditDataTableDialogComponent,
    SchemasComponent,
    FormDataListComponent,
    EditSchemaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withFetch()) 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
