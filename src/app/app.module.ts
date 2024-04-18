import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';
import { EditSchemaDialogComponent } from './table-schema/edit-schema-dialog/edit-schema-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TestComponent } from './test/test.component';
import { FetchHttpClientModule, provideHttpClient, withFetch } from '@nguniversal/common/http';
import { EditDataTableDialogComponent } from './data-table/edit-data-table-dialog/edit-data-table-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    DataTableListComponent,
    EditDataTableDialogComponent,
    SchemasComponent,
    EditSchemaDialogComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FetchHttpClientModule.forRoot({
      provide: provideHttpClient,
      useFactory: withFetch,
      deps: [HttpClient]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
