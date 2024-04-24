import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { pendingUserRequestComponent } from './pending-user-request.component';
import { EmailFilterPipe } from 'app/pipes/email-filter.pipe';
import { authenticationGuard } from 'app/guards/authentication/authentication.guard';
import { authorizationtionGuard } from 'app/guards/authorization/authorization.guard';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: pendingUserRequestComponent
    }
];

@NgModule({
    declarations: [
        pendingUserRequestComponent,
        EmailFilterPipe,

    ],
    imports     : [
        RouterModule.forChild(exampleRoutes),
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatDividerModule,
        FormsModule, // Add FormsModule here
        ReactiveFormsModule, // Add ReactiveFormsModule if you're using reactive forms
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule


        

    ],
    providers: [EmailFilterPipe
         ], 
})
export class pendingUserRequestModule
{
}
