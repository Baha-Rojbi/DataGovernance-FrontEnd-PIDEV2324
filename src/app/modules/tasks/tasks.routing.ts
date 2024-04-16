import { Route } from '@angular/router';
import { TasksDetailsComponent } from './details/details.component';
import { TasksListComponent } from './list/list.component';
import { TasksComponent } from './tasks.component';
import { CanDeactivateTasksDetails } from './tasks.guards';
import { TasksTagsResolver, TasksResolver, TasksTaskResolver } from './tasks.resolvers';



export const tasksRoutes: Route[] = [
    {
        path     : '',
        component: TasksComponent,
        resolve  : {
            tags: TasksTagsResolver
        },
        children : [
            {
                path     : '',
                component: TasksListComponent,
                resolve  : {
                    tasks: TasksResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : TasksDetailsComponent,
                        resolve      : {
                            task: TasksTaskResolver
                        },
                        canDeactivate: [CanDeactivateTasksDetails]
                    }
                ]
            }
        ]
    }
];
