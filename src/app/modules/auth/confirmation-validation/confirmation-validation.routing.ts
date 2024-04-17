import { Route } from '@angular/router';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';
import { AuthConfirmationValidationComponent } from './confirmation-validation.component';

export const authConfirmationValidationRoutes: Route[] = [
    {
        path     : '',
        component: AuthConfirmationValidationComponent
    }
];
