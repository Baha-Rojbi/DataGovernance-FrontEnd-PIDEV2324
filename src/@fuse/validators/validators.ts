import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export class FuseValidators {
    /**
     * Check for empty (optional fields) values
     *
     * @param value
     */
    static isEmptyInputValue(value: any): boolean {
        return value == null || value.length === 0;
    }

    /**
     * Must match validator
     *
     * @param controlPath A dot-delimited string values that define the path to the control.
     * @param matchingControlPath A dot-delimited string values that define the path to the matching control.
     */
    static mustMatch(
        controlPath: string,
        matchingControlPath: string
    ): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            // Get the control and matching control
            const control = formGroup.get(controlPath);
            const matchingControl = formGroup.get(matchingControlPath);

            // Return if control or matching control doesn't exist
            if (!control || !matchingControl) {
                return null;
            }

            // Delete the mustMatch error to reset the error on the matching control
            if (matchingControl.hasError('mustMatch')) {
                delete matchingControl.errors.mustMatch;
                matchingControl.updateValueAndValidity();
            }

            // Don't validate empty values on the matching control
            // Don't validate if values are matching
            if (
                this.isEmptyInputValue(matchingControl.value) ||
                control.value === matchingControl.value
            ) {
                return null;
            }

            // Prepare the validation errors
            const errors = { mustMatch: true };

            // Set the validation error on the matching control
            matchingControl.setErrors(errors);

            // Return the errors
            return errors;
        };
    }

    /**
     * Validator for the phone and the ncin
     */
    static lengthFormatValidator(length: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const input = control.value;
            const numericPattern = /^[0-9]*$/;

            if (!input || !numericPattern.test(input)) {
                return { invalidFormat: true };
            }

            if (input.length !== length) {
                return { invalidLength: true };
            }

            return null;
        };
    }
    /**
     * Validator for the city and the country
     */
    static stringInputValidator(): ValidatorFn {
        return (control: FormControl): { [key: string]: any } | null => {
            const forbidden = !/^[a-zA-Z\s]+$/.test(control.value);
            return forbidden
                ? { invalidFormat: { value: control.value } }
                : null;
        };
    }

    /**
     * Strong password Validator
     */
    static passwordStrength(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value: string = control.value || '';
            const errors: { [key: string]: any } = {};

            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const hasMinLength = value.length >= 8;
            const hasUpperCase = /[A-Z]/.test(value);

            if (!hasNumber) {
                errors['missingNumber'] = true;
            }

            if (!hasSpecialChar) {
                errors['missingSpecialChar'] = true;
            }

            if (!hasMinLength) {
                errors['minLength'] = true;
            }
            
            if (!hasUpperCase) {
                errors['missingUpperCase'] = true;
            }
            return Object.keys(errors).length !== 0 ? errors : null;
        };
    }

    
}
