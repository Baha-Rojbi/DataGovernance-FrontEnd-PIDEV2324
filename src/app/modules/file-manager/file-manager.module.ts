import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { fileManagerRoutes } from 'app/modules/file-manager/file-manager.routing';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';
import { FileManagerDetailsComponent } from 'app/modules/file-manager/details/details.component';
import { FileManagerListComponent } from 'app/modules/file-manager/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemasListComponent } from './schemas-list/schemas-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SchemaDetailsComponent } from './schema-details/schema-details.component';
import { AddSchemaDialogComponent } from './add-schema-dialog/add-schema-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateDataTableFormComponent } from './create-data-table-form/create-data-table-form.component';

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        SchemasListComponent,
        SchemaDetailsComponent,
        AddSchemaDialogComponent,
        CreateDataTableFormComponent,
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SharedModule,
        FormsModule,
        DragDropModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        FuseMasonryModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        ReactiveFormsModule
        

    ]
})
export class FileManagerModule
{
}
