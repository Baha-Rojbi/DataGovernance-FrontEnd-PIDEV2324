import { Route } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectResolver } from './project.resolvers';

export const projectRoutes: Route[] = [
    {
        path     : '',
        component: ProjectComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
