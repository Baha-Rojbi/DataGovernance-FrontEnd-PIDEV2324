import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { EmailConfirmationRequest } from 'app/entities/requests/sendEmailConfirmation';
import { catchError, of } from 'rxjs';

@Component({
    selector     : 'auth-confirmation-validation',
    templateUrl  : './confirmation-validation.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationValidationComponent
{
    jwtToken!: string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {}


    /**
     * On init
     */
    ngOnInit(): void {

        // getting the tocken and verifing it for the email reset 
        this._route.queryParams.subscribe(params => {
            this.jwtToken = params['token'];
          });
          if(this.jwtToken!=null){
            this.verifyToken(this.jwtToken)
          }
    }
                  
    verifyToken(token: string): void {
        this._authService.verifyTocken(token).pipe(
          catchError((error) => {
            if (error.status === 403) {
              // Handle 403 Forbidden error (token verification failure)
              console.error('Token verification failed:', error.error);
              this._router.navigate(['/error/404']); // Redirect to the 404 route
              // Perform any additional actions you need when the token verification fails
            } else {
              // Handle other HTTP errors
              console.error('An error occurred:', error.error);
            }
            // Return an observable with a default value or rethrow the error
            return of(null); // Example: return an observable with a default value of null
            
          })
        ).subscribe(
          (response) => {
      
            if (response !== null) {
              // Token verification successful
              console.log('Token verification successful:', response);
              this.confirmAccount()

              // Proceed with password reset or other actions
            } else {
              // Token verification failed
              console.error('Token verification failed');
              // Perform any additional actions you need when the token verification fails
            }
          }
        );
    }

    
  confirmAccount(): void {
    this._authService.confirmAccount(this.jwtToken).subscribe(
      response => {
        
      },
      error => {
        // Handle error response
        //this._router.navigate(['/error/505']); // Redirect to the 404 route

      }
    )
}

}
