import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppHttpInterceptorService } from './services/interceptor/app-http-interceptor.service';
import { AppHttpService } from './Interceptors/app-http.service';
import { UserValidationListComponent } from './user-validation-list/user-validation-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { EmailFilterPipe } from './pipes/email-filter.pipe';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // Import MessageService
import { ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { authenticationGuard } from './guards/authentication/authentication.guard';
import { authorizationtionGuard } from './guards/authorization/authorization.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    UserValidationListComponent,
    EmailFilterPipe,
    ConfirmEmailComponent,
    AdminTemplateComponent,
    NotAuthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    CarouselModule,
    DividerModule,
    CheckboxModule,
    ButtonModule,
    RippleModule,
    NavbarComponent,
    TableModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    InputTextModule,
    TagModule,
    SidebarModule,
    ConfirmPopupModule,
    ToastModule,
    
    
    
  ],
  providers: [{provide : HTTP_INTERCEPTORS, useClass : AppHttpService , multi : true }
    ,MessageService,
    ConfirmationService,
    authenticationGuard,
    authorizationtionGuard ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
