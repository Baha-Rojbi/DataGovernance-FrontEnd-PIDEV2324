import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { UserService } from 'app/core/user/user.service';
import { VerifyOldPasswordRequest } from 'app/entities/requests/VerifyOldPasswordRequest ';
import { SessionService } from 'app/services/session/session.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: UntypedFormGroup;
    oldPassword : string
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _sessionService : SessionService,
        private _userService : UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword  : ['',[ Validators.required,FuseValidators.passwordStrength()]],
            newPassword      : ['',[ Validators.required,FuseValidators.passwordStrength()]],
            twoStep          : [true],
            askPasswordChange: [false]
        });
    }

    verifyOldPassword(): void{
        this.oldPassword = this._sessionService.getUser().motDePasse
       let field = this.securityForm.get('currentPassword')
       let  newPassword = field.value
       const request: VerifyOldPasswordRequest = new VerifyOldPasswordRequest(newPassword,this.oldPassword);
       if(field.valid){
        this._userService.verifyOldPassword(request).subscribe(
            (result) => {
              if (result) {

                console.log('Old password verified successfully.');

              } else {
                console.log('Old password verification failed.');

                field.setErrors({ 'Exist': true });
              }
            },
            (error) => {
              console.error('Error verifying old password:', error);
            }
          );
       }
    }
    updatePassword(): void {
        if(this.securityForm.valid){
            let oldPassword = this.securityForm.get('currentPassword')
            let newPassword = this.securityForm.get('newPassword')
            if(oldPassword != newPassword)
            {
                this._userService.updatePassword(this._sessionService.getUser().idUtilisateur, newPassword.value)
                .subscribe(
                  response => {
                    console.log('Password updated successfully:', response);
                     // Set the alert
                     this.alert = {
                        type   : 'success',
                        message: 'Password updated succesfull'
                    };

                // Show the alert
                this.showAlert = true;                   
                // Handle success
                this._sessionService.saveUser(response);
                // Clear the form fields after successful update
                this.securityForm.reset();
                  },
                  error => {
                    console.error('Error updating password:', error);
                    // Handle error
                  }
                );
            }
            else{
                newPassword.setErrors({ 'SamePassword': true });
                console.log('same password ');
            }
        }
    }
    //verifying if the new password is the same as the old one 
    similarPassword(){
        let newPassword = this.securityForm.get('newPassword')
        if( this.securityForm.get('currentPassword').value==newPassword.value&&newPassword.valid){
            this.securityForm.get('newPassword').setErrors({ 'SamePassword': true });
        }
    }
}
