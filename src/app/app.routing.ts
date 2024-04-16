import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { Error404Component } from './modules/error/error-404/error-404.component';
import { authorizationtionGuard } from './guards/authorization/authorization.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [


     // Error
    {
        path: 'error',
        children: [
         { path: '404', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module) },
         { path: '500', loadChildren: () => import('app/modules/error/error-500/error-500.module').then(m => m.Error500Module) },
        ]
    },
    
    // Redirect empty path to '/sign-up'
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'project'},

    // Auth routes for guests
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
            {path: 'confirmation-validation', loadChildren: () => import('app/modules/auth/confirmation-validation/confirmation-validation.module').then(m => m.AuthConfirmationValidationModule)},

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path: '',
        component: LayoutComponent,
        canMatch:[AuthGuard],
        canActivate:[authorizationtionGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.module').then(m => m.ProjectModule)},
            // Settings
            {path: 'example', loadChildren: () => import('app/modules/admin/pending-user-request/pending-user-request.module').then(m => m.pendingUserRequestModule)},

        ]
    },
    // user routes
        {
            path: '',
            component: LayoutComponent,
            canMatch:[AuthGuard],
            resolve: {
                initialData: InitialDataResolver,
            },
            children: [
                // Settings
                {path: 'settings', loadChildren: () => import('app/modules/settings/settings.module').then(m => m.SettingsModule)},
                {path: 'tasks', loadChildren: () => import('app/modules/tasks/tasks.module').then(m => m.TasksModule)},
    
            ]
        },




];

