import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt/jwt-token.service';
import { SessionService } from '../services/session/session.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtTokenService,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      ememberMe: [false], // Adding the rememberMe control with a default value of false
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const credentials = this.loginForm.value;
    //sending request to the back end
    this.authService.login(credentials).subscribe(
      (response) => {
        // Handle successful login response
      
      if(this.authService.loadProfile(response)){
        this.router.navigate(['/Admin']);

      }

      

      },
      (error) => {
        // Handle login error
        console.error('Login failed:', error);
        // You can display error messages to the user here
      }
    );
  }
}
