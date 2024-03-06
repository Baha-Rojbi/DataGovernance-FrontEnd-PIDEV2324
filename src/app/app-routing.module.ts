import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';

const routes: Routes = [
  { path: 'upload', component: FileUploadComponent },
  { path: 'tables', component:DataTableListComponent },
  { path: 'schemas/:id', component: SchemasComponent },
  { path: '', redirectTo: '/tables', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
