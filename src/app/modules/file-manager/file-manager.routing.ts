import { Route } from '@angular/router';
import { CanDeactivateFileManagerDetails } from 'app/modules//file-manager/file-manager.guards';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';
import { FileManagerListComponent } from 'app/modules/file-manager/list/list.component';
import { FileManagerDetailsComponent } from 'app/modules//file-manager/details/details.component';
import {  FileManagerItemResolver, FileManagerItemsResolver } from 'app/modules/file-manager/file-manager.resolvers';
import { SchemasListComponent } from './schemas-list/schemas-list.component';

export const fileManagerRoutes: Route[] = [
    {
        path     : '',
        component: FileManagerComponent,
        children : [

            {
                path     : '',
                component: FileManagerListComponent,
                resolve  : {
                    items: FileManagerItemsResolver
                },
                children : [
                    {
                        path         : 'details/:id',
                        component    : FileManagerDetailsComponent,
                        resolve      : {
                            item: FileManagerItemResolver
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails]
                    }
                ]
                
            },
            {
                path: 'schemas/:id',
                component: SchemasListComponent
                // No need for resolve or canActivate here unless you have specific requirements
            }
        ]
    }
];
