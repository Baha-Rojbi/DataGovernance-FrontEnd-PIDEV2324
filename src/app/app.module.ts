<<<<<<< Updated upstream
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTableListComponent } from './data-table/data-table-list/data-table-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { SchemasComponent } from './table-schema/table-schemas/schemas.component';
import { EditSchemaDialogComponent } from './table-schema/edit-schema-dialog/edit-schema-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { EditDataTableDialogComponent } from './data-table/edit-data-table-dialog/edit-data-table-dialog.component';
import { TagStatsComponent } from './tag-stats/tag-stats.component';
import { DropdownComponent } from './dropdown/dropdown.component';




@NgModule({
  
  declarations: [
    AppComponent,
    FileUploadComponent,
    DataTableListComponent,
    EditDataTableDialogComponent,
    SchemasComponent,
    EditSchemaDialogComponent,
    TagStatsComponent,
    DropdownComponent

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
    MatIconModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
=======
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { StatistiquesComponent } from './modules/file-manager/statistiques/statistiques.component';
//import { ChartsModule } from 'ng2-charts';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
        
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        
        RouterModule.forRoot(appRoutes, routerConfig),
       

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        FormsModule,MatSelectModule
        
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
>>>>>>> Stashed changes
