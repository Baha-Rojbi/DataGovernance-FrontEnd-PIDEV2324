import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseValidators } from '@fuse/validators';
import { User } from 'app/entities/User';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    emailForm: FormGroup;
    alternativeForm: FormGroup;
    otpForm: FormGroup;

    showAlert: boolean = false;
    showEmailField: boolean = true;
    showAlternativeFields: boolean = false;
    foundNcinUser: User;
    displayMessage: string = "No Access to your Email?";
    showOtpField : boolean = false
    lengthProperty: { length: number };

    countdownDisplay: string;
    isUnderOneMinute: boolean = false;
    countdownInterval: any; 

    resendAttempts : number = 3



    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _route : ActivatedRoute,
        private _router :Router
    ) {}

    ngOnInit(): void {


        // Create the forms;
        this.emailForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });

        this.alternativeForm = this._formBuilder.group({
            ncin: [
                '',
                [Validators.required, FuseValidators.lengthFormatValidator(8)],
            ],
            numTel: [
                '',
                [Validators.required, FuseValidators.lengthFormatValidator(8)],
            ],
        });

        this.otpForm = this._formBuilder.group({
            otp: [
                '',
                [Validators.required, FuseValidators.lengthFormatValidator(6)],
            ]
        });
    }

    sendResetLinkEmail(): void {
        const form = this.showEmailField ? this.emailForm : this.alternativeForm;

        if (form.invalid) {
            return;
        }

        form.disable();
        this.showAlert = false;

        this._authService
            .sendMailForgetPassword(
                form.get('email').value
            )
            .pipe(
                finalize(() => {
                    form.enable();
                    this.forgotPasswordNgForm.resetForm();
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    this.alert = {
                        type: 'success',
                        message:
                            "Password reset sent! You'll receive an email if you are registered on our system.",
                    };
                },
                (response) => {
                    this.alert = {
                        type: 'error',
                        message:
                            'Email does not found! Are you sure you are already a member?',
                    };
                }
            );
    }

    sendOTPCode(): void {
        const form = this.showEmailField ? this.emailForm : this.alternativeForm;

        if (form.invalid) {
            return;
        }

        form.disable();
        this.showAlert = false;
        console.log( "+216"+form.get('numTel').value)
        this._authService
            .sendOTPCode(
                "+216"+form.get('numTel').value
            )
            .pipe(
                finalize(() => {
                    form.enable();
                    this.forgotPasswordNgForm.resetForm();
                    this.showAlert = true;
                
                })
            )
            .subscribe(
                (response) => {
                    console.log(response)
                    this.alert = {
                        type: 'success',
                        message:
                            "Password reset sent! You'll receive an email if you are registered on our system.",
                    };
                    // Reset countdown to avoid lagigng the countdown 
                    this.countdownDisplay = null;
                    this.isUnderOneMinute = false;
                    this.startCountdownTimer(response);
                    this.showAlternativeFields=false
                    this.showOtpField=true


                },
                
                (error) => {
                    this.alert = {
                        type: 'error',
                        message:
                            'Email does not found! Are you sure you are already a member?',
                    };

                }
            );
    }

    verifyOtpCode(): void {
        const form = this.otpForm
        if (form.invalid) {
            return;
        }

        form.disable();
        this.showAlert = false;
        this._authService
            .verifyOTP(
                "+216"+this.alternativeForm.get('numTel').value,
                form.get('otp').value
            )
            .pipe(
                finalize(() => {
                    form.enable();
                    this.forgotPasswordNgForm.resetForm();
                    this.showAlert = true;
                
                })
            )
            .subscribe(
                (response) => {
                    console.log(response)
                    this.alert = {
                        type: 'success',
                        message:
                            "Password reset sent! You'll receive an email if you are registered on our system.",
                    };
                    // Redirecting to the reset password 
                    if(response){
                        this._router.navigate(['/reset-password'], { queryParams: { ncin: this.alternativeForm.get('ncin').value } });
                    }
                    else{
                        this.alert = {
                            type: 'error',
                            message:
                                'Something went wrong with the otp code',
                        };
                        this.showAlert = true
                    }
                },
                
                (error) => {
                    this.alert = {
                        type: 'error',
                        message:
                            'Something went wrong with the server ',
                    };
                }
            );
    }


    toggleEmailField(): void {
        if (this.showEmailField) {
            this.showEmailField = false;
            this.showAlternativeFields = true;
            this.displayMessage = "Remember your Email?";
            this.emailForm.reset();
        } else {
            this.showEmailField = true;
            this.showAlternativeFields = false;
            this.displayMessage = "No access to your Email?";
            this.alternativeForm.reset();
        }
    }

    checkPhoneNcinValid(): void {
        const numTel = this.alternativeForm.get('numTel');
        if (numTel.valid && numTel.value !== this.foundNcinUser.numTel) {
            numTel.setErrors({ NoMatch: true });
        }
    }

    checkFieldExists(fieldType: string): void {
        const fieldValue = this.alternativeForm.get(fieldType).value;

        if (this.alternativeForm.get(fieldType).valid) {
            this._authService.checkNcinOrEmailExists(fieldValue).subscribe(
                (response) => {
                    if (response == null) {
                        this.alternativeForm.get(fieldType).setErrors({ NotExist: true });
                    } else {
                        this.foundNcinUser = response;
                    }
                },
                (error) => {
                    this.alternativeForm.get(fieldType).setErrors({ Exist: true });
                }
            );
        }
    }

    startCountdownTimer(expirationTime: number): void {
        // Clear any existing countdown interval
        clearInterval(this.countdownInterval);
    
        let countdown = expirationTime * 60; // Convert minutes to seconds
        this.countdownInterval = setInterval(() => {
            countdown--;
    
            // Calculate remaining minutes and seconds
            const minutes = Math.floor(countdown / 60);
            const seconds = countdown % 60;
    
            // Update countdown display
            this.countdownDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
            // Check if countdown is under one minute
            this.isUnderOneMinute = countdown < 60;
    
            // Redirect if countdown has expired
            if (countdown <= 0) {
                clearInterval(this.countdownInterval);
                this._router.navigate(['/sign-up']); // Redirect to sign-up page
            }
        }, 1000); // Update countdown every second
    }
    
    
    
    resendOTP(): void {
        if (this.resendAttempts >0 ) {
            this.sendOTPCode();
            this.resendAttempts--;

        } else {
            this._router.navigate(['/signup']);
        }
    }
    
    ngOnDestroy(): void {
        // Clear the countdown interval when the component is destroyed
        clearInterval(this.countdownInterval);
    }


}

