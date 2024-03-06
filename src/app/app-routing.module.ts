import { NgModule } from '@angular/core';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';
import { RouterModule, Routes } from '@angular/router';

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
