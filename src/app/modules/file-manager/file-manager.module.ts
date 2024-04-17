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
import { FormsModule } from '@angular/forms';
import { SchemasListComponent } from './schemas-list/schemas-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SchemaDetailsComponent } from './schema-details/schema-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MetadataListComponent } from './metadata/metadata.component';
import { MatSelectModule } from '@angular/material/select';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FileManagerListComponent } from './list/list.component';


@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        SchemasListComponent,
        SchemaDetailsComponent,MetadataListComponent,StatistiquesComponent
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatSelectModule, // Make sure MatSelectModule is imported here

        MatButtonModule,MatMenuModule,NgApexchartsModule,   
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

    ]
})
export class FileManagerModule
{
}
