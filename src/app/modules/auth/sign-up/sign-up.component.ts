import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
    FormGroup,
    FormControl,
    ValidatorFn,
    AbstractControl,
    FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { User, userPosteValues } from 'app/entities/User';
import { user } from 'app/mock-api/common/user/data';
import { JwtTokenService } from 'app/services/jwt/jwt-token.service';
import { SessionService } from 'app/services/session/session.service';
import { DateTime } from 'luxon';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
    [x: string]: any;
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    // Define task and initialize it with an empty object
    task: any = {};
    confirmPassword: string;
    userRoleValues = [
        'AUDITEUR',
        'RESPONSABLE_ANALYSE',
        'RESPONSABLE_ADMINISTRATION',
    ];
    userPosteValues = userPosteValues;
    user: User = new User();
    ncinExistsError: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _jwtService: JwtTokenService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                nom: [
                    'qsd',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(20),
                        FuseValidators.stringInputValidator(),
                    ],
                ],
                ncin: [
                    '12121212',
                    [
                        Validators.required,
                        FuseValidators.lengthFormatValidator(8),
                    ],
                ],
                numTel: [
                    '12121212',
                    [
                        Validators.required,
                        FuseValidators.lengthFormatValidator(8),
                    ],
                ],
                email: [
                    'qsdqsd@gmail.com',
                    [Validators.required, Validators.email],
                ],
                dateNaissance: [],
                sexe: ['', Validators.required],
            }),
            address: this._formBuilder.group({
                pays: [
                    'qsd',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        FuseValidators.stringInputValidator(),
                    ],
                ],
                ville: [
                    'qsd',
                    [
                        Validators.required,
                        FuseValidators.stringInputValidator(),
                    ],
                ],
                numRue: [
                    '12',
                    [
                        Validators.required,
                        FuseValidators.lengthFormatValidator(2),
                    ],
                ],
                codePostale: [
                    '1211',
                    [
                        Validators.required,
                        FuseValidators.lengthFormatValidator(4),
                    ],
                ],
            }),
            step3: this._formBuilder.group({
                motDePasse: [
                    'Mohamed123@',
                    [Validators.required, FuseValidators.passwordStrength()],
                ],
                poste: ['', Validators.required],
                role: ['', Validators.required],
                dateEmbauche: [],
            }),
            step4: this._formBuilder.group({
                avatar: ['', Validators.required],
            }),
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        //Extracting data
        this.mapFormDataToUser();

        // Sign up
        this._authService.signUp(this.user).subscribe(
            (response) => {
                //Storing the token in the localStorage forh Confirmation

                // Navigate to the confirmation required page
                this._router.navigate(['/confirmation-required'], {
                    queryParams: {
                        email: this.user.email,
                        jwtToken: response.jwtToken,
                    },
                });
            },
            (error) => {
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message:
                        error.message +
                        ' Something went wrong, please try again.',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }
    /**
     * calculating minimum for the birth date
     */
    calculateMinDate(): Date {
        // Calculate 18 years ago from today
        const eighteenYearsAgo = DateTime.now().minus({ years: 25 }).toJSDate();
        return eighteenYearsAgo;
    }

    // Method to check if NCIN exists
    checkFieldExists(fieldType: string): void {
        let fieldValue: string = this.signUpForm.get(
            'step1.' + fieldType
        ).value;

        if (this.signUpForm.get('step1.' + fieldType).valid) {
            this._authService.checkNcinOrEmailExists(fieldValue).subscribe(
                (response) => {
                    // Field doesn't exist
                    if (response != null) {
                        this.signUpForm
                            .get('step1.' + fieldType)
                            .setErrors({ Exist: true });
                    }
                },
                (error) => {
                    // Field exists, display error message
                    this.signUpForm
                        .get('step1.' + fieldType)
                        .setErrors({ Exist: true });
                }
            );
        }
    }

    /**
     * Loading the data form the form
     */
    mapFormDataToUser(): void {
        const { step1, address, step3, step4 } = this.signUpForm.value;

        this.user.nom = step1.nom;
        this.user.dateNaissance = step1.dateNaissance;
        this.user.ncin = step1.ncin;
        this.user.numTel = step1.numTel;
        this.user.email = step1.email;
        this.user.sexe = step1.sexe;
        this.user.avatar = step4.avatar;

        this.user.adresse = address;

        this.user.motDePasse = step3.motDePasse;
        this.user.poste = step3.poste;
        this.user.role = step3.role;
        this.user.dateEmbauche = step3.dateEmbauche;
    }

    /**
     * Opening the image trigger
     */
    onFileChange(event: any): void {
        const file = event?.target?.files?.[0];
        // Define the allowed image extensions
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    
        // Check if the file extension is valid
        const isImageFileValid = allowedExtensions.includes(fileExtension);
    
        if (isImageFileValid) {
            // If the file is valid, proceed with processing it
            const reader = new FileReader();
    
            reader.onload = (e) => {
                this.signUpForm.patchValue({
                    step4: {
                        avatar: file.name,
                    },
                });
    
                reader.readAsDataURL(file);
                // Set isImageUploaded to true
                this.isImageUploaded = true;
            };
        } else {
            // If the file is not a valid image, display an alert or perform any other action
            alert('Please upload a valid image file (jpg, jpeg, png, gif)');
            // Set isImageUploaded to false
            this.isImageUploaded = false;
        }
    }
}
