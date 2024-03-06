import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: false,
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit{
  jwtToken !: string;

  constructor(private route: ActivatedRoute, private authService : AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jwtToken = params['token'];
      if (this.jwtToken) {


        this.confirmAccount();
      }
    });
  }

  confirmAccount(): void {
        this.authService.confirmAccount(this.jwtToken).subscribe(
          response => {
            // Account confirmed successfully, handle success response
            console.log(this.jwtToken)
          },
          error => {
            // Handle error response
          }
        )
      }
}




