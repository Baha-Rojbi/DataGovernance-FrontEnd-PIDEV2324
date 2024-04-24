import { Route } from '@angular/router';

import { ActivitiesResolver } from './activities.resolvers';
import { ActivitiesComponent } from './activities.component';


export const activitiesRoutes: Route[] = [
    {
        path     : '',
        component: ActivitiesComponent,
        resolve  : {
            activities: ActivitiesResolver
        }
    }
];
