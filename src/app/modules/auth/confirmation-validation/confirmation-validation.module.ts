import { NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthConfirmationValidationComponent } from './confirmation-validation.component';
import { authConfirmationValidationRoutes } from './confirmation-validation.routing';
import { AuthService } from 'app/core/auth/auth.service';
import { catchError, of } from 'rxjs';

@NgModule({
    declarations: [AuthConfirmationValidationComponent],
    imports: [
        RouterModule.forChild(authConfirmationValidationRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule,
    ],
})
export class AuthConfirmationValidationModule  {



}
