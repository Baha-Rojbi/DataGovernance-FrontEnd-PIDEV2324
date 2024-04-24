import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { ActivitiesComponent } from './activities.component'; // Assuming this is your component
import { ActivitiesService } from './activities.service'; // Assuming this is your service

@NgModule({
    declarations: [
        ActivitiesComponent,
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: ActivitiesComponent },
            // Add more routes as needed
        ]),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        // Add other modules you need here
    ],
    providers: [
        ActivitiesService, // Provide your service here
    ],
})
export class ActivitiesModule { }
