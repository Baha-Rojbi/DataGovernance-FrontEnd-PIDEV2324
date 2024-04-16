import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signupForm!: FormGroup;
  signUpSucceded : boolean = false;

  userRoleValues = ['AUDITEUR', 'RESPONSABLE_ANALYSE', 'RESPONSABLE_ADMINISTRATION']

  constructor(private fb: FormBuilder, private authService: AuthService, private router : Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      dateNaissance: new FormControl('', [Validators.required]),
      dateEmbauche: new FormControl('', [Validators.required]),
      ncin: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      motDePasse: new FormControl('', [Validators.required, Validators.minLength(8)]),
      numTel: new FormControl('', [Validators.required, Validators.minLength(8)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      poste: new FormControl('', [Validators.required]),
      status: new FormControl('PENDING'),
      adresse: new FormGroup({
        pays: new FormControl('', [Validators.required]),
        ville: new FormControl('', [Validators.required]),
        codePostale: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
        numRue: new FormControl('', [Validators.required, Validators.min(1)]),
      })
    });
  }

  signup(): void {
    if (this.signupForm.invalid) {
      return;
    }
    const user = this.signupForm.value;
    console.log(user)
    this.authService.registerUser(user).subscribe(
      response => {
        // Handle successful registration
        console.log('User registered:', response);
        this.signUpSucceded = true;
        this.router.navigate(['/login']); // Navigate to login page 
        // Optionally, navigate to another page
      },
      error => {
        // Handle registration error
        console.error('Registration failed:', error);
        // Optionally, display an error message to the user
      }
    );
  }
}
