
import { User } from 'app/entities/User';
import { AffectRoleAndChangeStatus } from 'app/entities/requests/AffectRoleAndChangeStatusRequest';
import { AdminService } from 'app/services/admin/admin.service';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {ChangeDetectorRef, Component,ViewChild,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EmailFilterPipe } from 'app/pipes/email-filter.pipe';
@Component({
    selector: 'pending-user-request',
    templateUrl: './pending-user-request.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class pendingUserRequestComponent {
    searchTerm: string | any = null;
    pendingUsersRequests!: User[];
    userStatusValues = ['PENDING', 'APPROVED', 'REJECTED'];
    userRoleValues = [
        'AUDITEUR',
        'RESPONSABLE_ANALYSE',
        'RESPONSABLE_ADMINISTRATION',
    ];

    pendingUserRequestColumns: string[] = [
        'name',
        'email',
        'status',
        'role',
        'affectedRole',
        'confirmation',
    ];
    pendingUsersRequestsLength: number;

    dataSource: any;
    configForm!: UntypedFormGroup;
    emailForm: FormGroup;



    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private adminService: AdminService,
        private _liveAnnouncer: LiveAnnouncer,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private fb: FormBuilder,
        private emailFilterPipe: EmailFilterPipe,
        private changeDetectorRefs: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getListPendingUsers();
        this.initForm()
        this.emailForm = this.fb.group({
            email: ['',] // Email field with required and email validators
          });
    }

    initForm(): void {
        this.configForm = this._formBuilder.group({
          title: 'Reject User',
          message: 'Are you sure you want to remove this user permanently? <span class="font-medium">This action cannot be undone!</span>',
          icon: this._formBuilder.group({
            show: true,
            name: 'heroicons_outline:exclamation',
            color: 'warn'
          }),
          actions: this._formBuilder.group({
            confirm: this._formBuilder.group({
              show: true,
              label: 'Remove',
              color: 'warn'
            }),
            cancel: this._formBuilder.group({
              show: true,
              label: 'Cancel'
            })
          }),
          dismissible: true
        });
      }

    getListPendingUsers() {
        this.adminService.getPendingUsersRequests().subscribe(
            (users: User[]) => {
                this.pendingUsersRequests = users;
                this.dataSource = new MatTableDataSource(users);
                this.dataSource.sort = this.sort;
                this.pendingUsersRequestsLength =
                    this.pendingUsersRequests.length;
            },
            (error) => {
                // Handle error, e.g., log it or show a user-friendly message
                console.error('Error fetching pending users:', error);
            }
        );
    }

    updateStatus(user: any, newStatus: string): void {
        user.status = newStatus;
        const affectRoleAndChangeStatusRequest = new AffectRoleAndChangeStatus(
            user.idUtilisateur,
            user.role,
            user.status
        );

        this.adminService
            .affectRoleAndChangeStatus(affectRoleAndChangeStatusRequest)
            .subscribe(
                (response) => {
                    const index = this.dataSource.data.findIndex(
                        (u) => u.idUtilisateur === user.idUtilisateur
                    );
                    // if (index !== -1) {
                    //     // If the user is found, remove it from the data source
                    //     this.dataSource.data.splice(index, 1);
                    //     // Trigger change detection to ensure the table updates
                    //     this.changeDetectorRefs.detectChanges();
                    // }
                },
                (error) => {
                    console.error('An error occurred:', error); // Log the error to the console
                    // Optionally, you can display an error message to the user or perform other actions
                }
            );
    }

    onSearchChange(event: Event) {
        this.searchTerm = (event.target as HTMLInputElement).value;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }


    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }
        /**
     * Open confirmation dialog
     */
        openConfirmationDialog(user: any, newStatus: string): void
        {
            // Open the dialog and save the reference of it
            if(newStatus == "APPROVED"){
                this.configForm.get('title').setValue('Approve User')
                this.configForm.get('message').setValue('Are you sure you want to approve this user? <span class="font-medium">This action cannot be undone!</span>')
                this.configForm.get('actions.confirm.label').setValue('Approve')
                this.configForm.get('actions.confirm.color').setValue('primary')
                this.configForm.get('icon.name').setValue('heroicons_outline:question-mark-circle')
                this.configForm.get('icon.color').setValue('primary')
            }
            else{
                this.initForm()
            }

            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
            
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if(result=='confirmed'){
                    this.updateStatus(user, newStatus);
                }
            });
        }

        applyFilter(searchTerm: string): void {
            this.searchTerm = searchTerm.trim().toLowerCase();
            this.dataSource.data = this.emailFilterPipe.transform(this.pendingUsersRequests, this.searchTerm);
          }
}
