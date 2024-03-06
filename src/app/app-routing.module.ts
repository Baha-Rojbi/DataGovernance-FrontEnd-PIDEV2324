import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserValidationListComponent } from './user-validation-list/user-validation-list.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AdminService } from './services/admin/admin.service';
import { authenticationGuard } from './guards/authentication/authentication.guard';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { authorizationtionGuard } from './guards/authorization/authorization.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

const routes: Routes = [

  { path: '', component:SignUpComponent },
  { path: 'login', component:LoginComponent },
  { path: 'signUp', component:SignUpComponent },
  { path: 'ConfirmEmail', component:ConfirmEmailComponent },
  { path: 'notAuthorized', component:NotAuthorizedComponent },
  {path : 'Admin',component:AdminTemplateComponent, canActivate:[authenticationGuard],
  children:[
    { path: 'userList', component:UserValidationListComponent,canActivate:[authorizationtionGuard] },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
