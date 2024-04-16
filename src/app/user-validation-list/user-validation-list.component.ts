import { Component, OnInit } from '@angular/core';
import { User } from '../entities/User';
import { AdminService } from '../services/admin/admin.service';
import { AffectRoleAndChangeStatus } from '../entities/requests/AffectRoleAndChangeStatusRequest';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-validation-list',
  standalone: false,
  templateUrl: './user-validation-list.component.html',
  styleUrl: './user-validation-list.component.css'
})
export class UserValidationListComponent implements OnInit{
  searchTerm: string | any = null; 
  pendingUsersRequests !: User[]
  userStatusValues = ['PENDING', 'APPROVED', 'REJECTED']
  userRoleValues = ['AUDITEUR', 'RESPONSABLE_ANALYSE', 'RESPONSABLE_ADMINISTRATION']


  constructor(private adminService : AdminService,private confirmationService: ConfirmationService, private messageService: MessageService){}
  ngOnInit(): void {
    this.getListPendingUsers()
  }


  getListPendingUsers(){
    this.adminService.getPendingUsersRequests()
    .subscribe(
      (users: User[]) => {
        this.pendingUsersRequests = users 
        console.log(users)
      },
      (error) => {
        // Handle error, e.g., log it or show a user-friendly message
        console.error('Error fetching pending users:', error);
      }
    )
  }


  updateStatus(user: any, newStatus: string): void {
    user.status = newStatus;
    const affectRoleAndChangeStatusRequest = new AffectRoleAndChangeStatus(user.idUtilsateur,user.role,user.status)
    
    this.adminService.affectRoleAndChangeStatus(affectRoleAndChangeStatusRequest).subscribe(
      response => {
        const index = this.pendingUsersRequests.findIndex(u => u.idUtilisateur === user.idUtilisateur);
        if (index !== -1) {
          // If the user is found, remove it from the array
          this.pendingUsersRequests.splice(index, 1);
        }

      },
      error => {
        console.error('An error occurred:', error); // Log the error to the console
        // Optionally, you can display an error message to the user or perform other actions
      }
    )
  }


  onSearchChange(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  confirm1(event: Event,user: any, newStatus: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'User Modified ', life: 3000 })
            this.updateStatus(user,newStatus)
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'User was not modified ', life: 3000 });
        }
    });
}









}
