import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';
import { FormComponent } from './form/form.component'
import { FormDataListComponent } from './form-data-list/form-data-list.component';


const routes: Routes = [
  { path: 'form-data-list', component: FormDataListComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: 'form', component: FormComponent },
  { path: 'tables', component:DataTableListComponent },
  
  { path: 'schemas/:id', component: SchemasComponent },
  { path: '', redirectTo: '/tables', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
