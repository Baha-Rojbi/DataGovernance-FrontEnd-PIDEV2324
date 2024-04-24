import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/entities/User';
import { SessionService } from 'app/services/session/session.service';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTeamComponent implements OnInit {
    members: any[];
    roles: any[];
    approvedUsers: User[];
    emailForm: FormGroup;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: 'User found ',
    };
    showAlert: boolean;
    configForm!: UntypedFormGroup;
    currentUser: User;
    searchedEmail : any
    foundUser : any
    existingMembers: any = [];

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _sessionService: SessionService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _authService: AuthService,
        private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        //getting the user
        this.currentUser = this._sessionService.getUser()
        
        //getting all the approved members that the user could add
        this.getAllApprovedUsers(this.currentUser.idUtilisateur)

        //getting all the memebers of the owned team
        this.members = this._userService.clearOwnedTeamMembersImagesPath(this.currentUser.ownedTeamMembers);

        console.log(this.currentUser.ownedTeamMembers)


        //creating the form
        this.emailForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });

       
    }

    initForm(element: any): void {
        this.configForm = this._formBuilder.group({
            title: 'Remove User from your team ',
            message:
                'Are you sure you want to remove <span class="font-medium">' +
                element.nom +
                ' with the email ' +
                element.email +
                '</span> from your team?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel',
                }),
            }),
            dismissible: true,
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
    * adding a new team member
    */
    addUserToTeam(leaderEmail: string, memberEmail: string): void {
            this._userService.addUserToTeam(leaderEmail, memberEmail).subscribe(
                (response) => {
                    //adding the added user to the existing users list 
                    this.existingMembers.push(response)

                    //adding the added user the members list
                    this.members.push(response)

                    //removing the member form the approved List
                    this.approvedUsers = this.approvedUsers.filter(member => member.idUtilisateur !== response.idUtilisateur);

                    //updating the user owned team members 
                    if (!this.currentUser.ownedTeamMembers.some(member => member.idUtilisateur === response.idUtilisateur)) {
                        // If response does not exist, push it to ownedTeamMembers
                        this.currentUser.ownedTeamMembers.push(response);
                    }
                    //saving the changes in the user 
                    this._sessionService.saveUser(this.currentUser)

                    //reloving avatar photos 
                    this.members = this._userService.clearOwnedTeamMembersImagesPath(this.currentUser.ownedTeamMembers)

                    //removing the alert 
                    this.showAlert = false



                    // Trigger change detection to update the UI
                    this.cdr.detectChanges();

                },
                (error) => {
                    console.error('An error occurred:', error); // Log the error to the console
                    // Optionally, you can display an error message to the user or perform other actions
             }
        );
    }



    /**
     * removing  a  team member
     */
    deleteTeamMember(selectedMember: User): void {
            this.initForm(selectedMember);
            this._userService.removeMemberFromTeam(
                selectedMember.idUtilisateur,
                this._sessionService.getUser().ownedTeam.id
            ).subscribe(
                (response) => {

    
                    // Remove the member from existingMembers array
                    this.existingMembers = this.existingMembers.filter(member => member.idUtilisateur !== selectedMember.idUtilisateur);
                    
                    console.log(this.existingMembers)

                    //Remove from the member list 
                    this.members = this.members.filter(member => member.idUtilisateur !== selectedMember.idUtilisateur);

                    //readding the user to the approved list
                    this.approvedUsers.push(selectedMember)

                    //updating the user informations
                    this.currentUser.ownedTeamMembers = this.currentUser.ownedTeamMembers.filter(member => member.idUtilisateur !== selectedMember.idUtilisateur);

                    //saving the user with new informations 
                    this._sessionService.saveUser(this.currentUser)
                    
                    // Trigger change detection to update the UI
                    this.cdr.detectChanges();

    
                },
                (error) => {
                    console.error('An error occurred:', error);
                    // Optionally, handle error
                }
            );
    }

    /**
     * getting all the possible users to add
     */
    getAllApprovedUsers(userId: number): void {
        this._userService.getAllApprovedUsers(userId,this.currentUser.ownedTeam.id).subscribe(
            (users: User[]) => {
                this.approvedUsers = users;
                console.log(users)
                //verify the existing user List and the approved List
                this.checkForExistingMembers()
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    /**
     * verifying if the mail the user provided exist in the list
     */
    verifyEmail(): void {
        const email = this.emailForm.get('email');
        if (email.valid) {
            this.foundUser = this.approvedUsers.find(
                (user) => user.email === email.value
            );
            if (!this.foundUser) {
                this.emailForm.get('email').setErrors({ emailNotFound: true });
                this.showAlert = false;
            }
            if (
                this.existingMembers.find((user) => user.email === email.value)
            ) {
                this.emailForm.get('email').setErrors({ memberExist: true });
                this.showAlert = false;
            }
            if (this.foundUser) {
                this.emailForm.get('email').setErrors(null);
                // Show the alert
                this.showAlert = true;
                // Setup the dialog
                this.initForm(this.foundUser);
            }
        }
    }

    /**
     * verifying if the mail the user provided exist in the list
     */
    checkForExistingMembers() {
        if (this.approvedUsers != null) {
            // Create a copy of the approvedUsers array
            const updatedApprovedUsers = [...this.approvedUsers];

            // Iterate through the members list
            this.members.forEach((member) => {
                // Find index of the member in the approvedUsers list by comparing a unique identifier, such as idUtilisateur
                const index = updatedApprovedUsers.findIndex(
                    (user) => user.idUtilisateur === member.idUtilisateur
                );

                // If the member is found in the approvedUsers list, remove it
                if (index !== -1) {
                    this.existingMembers = updatedApprovedUsers.splice(
                        index,
                        1
                    );
                }
            });

            this.approvedUsers = updatedApprovedUsers;
            return updatedApprovedUsers;
        }
    }

    /**
     * Handeling confirmation
     */
        openConfirmationDialog(operation: string, member: User): void {
            if (operation == 'ADD') {
                this.configForm.get('title').setValue('Add User To team ');
                this.configForm
                    .get('message')
                    .setValue(
                        'Are you sure you want to add <span class="font-medium">' +
                            this.foundUser.nom +
                            ' with the email ' +
                            this.foundUser.email +
                            '</span> to your team?'
                    );
                this.configForm.get('actions.confirm.label').setValue('Add');
                this.configForm.get('actions.confirm.color').setValue('primary');
                this.configForm
                    .get('icon.name')
                    .setValue('heroicons_outline:question-mark-circle');
                this.configForm.get('icon.color').setValue('primary');
            } else {
                this.initForm(member);
            }
            const dialogRef = this._fuseConfirmationService.open(
                this.configForm.value
            );
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (operation == 'ADD' && result == 'confirmed') {
                    this.addUserToTeam(this.currentUser.email,this.foundUser.email)

                    this.emailForm.reset()

                    // Clear the validation errors for the email field
                    this.emailForm.get('email').setErrors(null);
                }
                if (operation == 'DELETE' && result == 'confirmed') {
                    this.deleteTeamMember(member)
                }
            });
        }


}
