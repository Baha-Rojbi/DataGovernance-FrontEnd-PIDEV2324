import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User, userPosteValues } from 'app/entities/User';
import { SessionService } from 'app/services/session/session.service';
import { DateTime } from 'luxon';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit {
    accountForm: FormGroup;
    user: User;
    userPosteValues = userPosteValues;
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _sessionService: SessionService,
        private _authService: AuthService,
        private sanitizer: DomSanitizer,
        private _userService: UserService,
        private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = this._sessionService.getUser();

        // Create the form
        this.intitForm();
    }

    intitForm() {
        this.user.avatar = this.user.avatar.replace(
            'C:\\fakepath\\',
            'assets/images/avatars/'
        );

        this.accountForm = this._formBuilder.group({
            nom: [
                this.user.nom,
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                    FuseValidators.stringInputValidator(),
                ],
            ],
            ncin: [
                this.user.ncin,
                [Validators.required, FuseValidators.lengthFormatValidator(8)],
            ],
            dateNaissance: [this.user.dateNaissance],
            dateEmbauche: [this.user.dateEmbauche],
            poste: [
                this.userPosteValues.includes(this.user.poste)
                    ? this.user.poste
                    : '',
                Validators.required,
            ],
            role: [{ value: this.user.role, disabled: true }],
            username: ['brianh'],
            company: [this.user.societe],
            about: [
                this.user.description
            ],
            email: [{ value: this.user.email, disabled: true }],
            numTel: [
                this.user.numTel,
                [Validators.required, FuseValidators.lengthFormatValidator(8)],
            ],
            sexe: [this.user.sexe || 'Male', Validators.required],
            avatar: [''],
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
        });
    }

    updateProfile(): void {
        // Do nothing if the form is invalid
        if (this.accountForm.invalid) {
            return;
        }

        // Disable the form
        this.accountForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._sessionService.saveUser(this.mapFormDataToUser(this.user));

        console.log(this._sessionService.getUser());
        // update Profile
        this._userService
            .updateProfile(this.mapFormDataToUser(new User()))
            .subscribe(
                (response) => {
                    //Storing the token in the localStorage forh Confirmation
                    // Navigate to the confirmation required page
                },
                (error) => {
                    // Re-enable the form
                    this.accountForm.enable();

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

    // Method to check if NCIN exists
    checkFieldExists(fieldType: string): void {
        let fieldValue: string = this.accountForm.get(fieldType).value;

        if (this.accountForm.get(fieldType).valid) {
            this._authService.checkNcinOrEmailExists(fieldValue).subscribe(
                (response) => {
                    // Field doesn't exist
                    if (response != null && fieldValue != this.user.ncin ) {
                        this.accountForm
                            .get(fieldType)
                            .setErrors({ Exist: true });
                    }
                },
                (error) => {
                    // Field exists, display error message
                    this.accountForm.get(fieldType).setErrors({ Exist: true });
                }
            );
        }
    }

    /**
     * calculating minimum for the birth date
     */
    calculateMinDate(): Date {
        // Calculate 18 years ago from today
        const eighteenYearsAgo = DateTime.now().minus({ years: 25 }).toJSDate();
        return eighteenYearsAgo;
    }

    /**
     * Opening the image trigger
     */
    onFileChange(event: any): void {
        const file = event?.target?.files?.[0];

        if (file) {
            // Extract the file extension
            const fileNameParts = file.name.split('.');
            const fileExtension =
                fileNameParts[fileNameParts.length - 1].toLowerCase();

            // Define the allowed image extensions
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

            // Check if the file extension is valid
            if (!allowedExtensions.includes(fileExtension)) {
                // Reset the file input and display an error message
                this.fileInput.nativeElement.value = '';
                alert(
                    'Please select a file with a valid image extension (jpg, jpeg, png, gif).'
                );
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                this.accountForm.patchValue({
                    avatar: file,
                });
            };

            reader.readAsDataURL(file);
   
        }
        this.cdr.detectChanges()
    }

    getImageDataUrl(): SafeUrl {
        const avatar = this.accountForm.get('avatar').value;
        if (avatar) {
            return this.sanitizer.bypassSecurityTrustUrl(
                URL.createObjectURL(avatar)
            );
        } else {
            return this.user?.avatar;
        }
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }
    
    mapFormDataToUser(user: User): User {
        const form = this.accountForm.value;
        user.idUtilisateur = this.user.idUtilisateur;
        user.nom = form.nom;
        user.dateNaissance = form.dateNaissance;
        user.ncin = form.ncin;
        user.numTel = form.numTel;
        user.sexe = form.sexe;
        console.log(this.user.avatar);
        if (this.user.avatar != form.avatar && form.avatar != '') {
            user.avatar = 'assets/images/avatars/' + form.avatar.name;
            console.log(user.avatar);
        } else {
            user.avatar = this.user.avatar;
        }
        user.adresse.idAdresse = this.user.adresse.idAdresse;
        user.adresse = form.address;
        user.motDePasse = form.motDePasse;
        user.poste = form.poste;
        user.dateEmbauche = form.dateEmbauche;
        user.description = form.about
        user.societe = form.company

        return user;
    }
}
