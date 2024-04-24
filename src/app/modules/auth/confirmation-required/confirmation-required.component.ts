import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { EmailConfirmationRequest } from 'app/entities/requests/sendEmailConfirmation';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    //Global Variables 
    _userEmail : String 
    _emailConfirmationRequest : EmailConfirmationRequest
    


    /**
     * Constructor
     */
    constructor(
        private _route: ActivatedRoute,
        private _authService : AuthService,
        
    )
    {   
        //getting the user email from the sign up component 
        this._route.queryParams.subscribe(params => {
            this._emailConfirmationRequest = new EmailConfirmationRequest(params['email'], params['jwtToken']);
        });
        this.sendConfirmationEmail()

    }
    sendConfirmationEmail(): void {
        console.log(this._emailConfirmationRequest)
        this._authService.sendEmailConfirmation(this._emailConfirmationRequest)
            .subscribe(
                response => {
                    console.log('Email confirmation sent successfully:', response);
                },
                error => {
                    console.error('Error sending email confirmation:', error);
                }
            );
    }


}
