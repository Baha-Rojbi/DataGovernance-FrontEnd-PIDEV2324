import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    jwtToken!: string;
    ncin: string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _route: ActivatedRoute,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // getting the tocken and verifing it for the email reset
        this._route.queryParams.subscribe((params) => {
            this.jwtToken = params['token'];
        });
        if (this.jwtToken != null) {
            console.log(this.jwtToken);
            this.verifyToken(this.jwtToken);
        }

        if (this.jwtToken == null) {
            //getting the ncin value to reset the password with the SMS
            this._route.queryParams.subscribe((params) => {
                this.ncin = params['ncin'];
            });
        }

        console.log(this.ncin);
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', [Validators.required, this.passwordStrength()]],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        if (this.jwtToken != null && this.ncin == null) {
          this.resetPasswordEmail()
        }
        else{
          this.resetPasswordSMS()
        }
    }

    resetPasswordSMS() {
        // Send the request to the server
        this._authService
            .resetPasswordSMS(
                this.ncin,
                this.resetPasswordForm.get('password').value
            )
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset.',
                    };
                },
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.',
                    };
                }
            );
    }

    resetPasswordEmail() {
        // Send the request to the server
        this._authService
            .resetPassword(
                this.jwtToken,
                this.resetPasswordForm.get('password').value
            )
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset.',
                    };
                },
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.',
                    };
                }
            );
    }

    passwordStrength(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value: string = control.value || '';
            const errors: { [key: string]: any } = {};

            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const hasMinLength = value.length >= 8;

            if (!hasNumber) {
                errors['missingNumber'] = true;
            }

            if (!hasSpecialChar) {
                errors['missingSpecialChar'] = true;
            }

            if (!hasMinLength) {
                errors['minLength'] = true;
            }

            return Object.keys(errors).length !== 0 ? errors : null;
        };
    }

    verifyToken(token: string): void {
        this._authService
            .verifyTocken(token)
            .pipe(
                catchError((error) => {
                    if (error.status === 403) {
                        // Handle 403 Forbidden error (token verification failure)
                        console.error(
                            'Token verification failed:',
                            error.error
                        );
                        this._router.navigate(['/error/404']); // Redirect to the 404 route
                        // Perform any additional actions you need when the token verification fails
                    } else {
                        // Handle other HTTP errors
                        console.error('An error occurred:', error.error);
                    }
                    // Return an observable with a default value or rethrow the error
                    return of(null); // Example: return an observable with a default value of null
                })
            )
            .subscribe((response) => {
                console.log(response);

                if (response !== null) {
                    // Token verification successful
                    console.log('Token verification successful:', response);
                    // Proceed with password reset or other actions
                } else {
                    // Token verification failed
                    console.error('Token verification failed');
                    // Perform any additional actions you need when the token verification fails
                }
            });
    }
}
