import { Injectable } from '@angular/core';
import { environment } from '../../apis/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/entities/requests/AuthRequest';
import {  User } from 'src/app/entities/User';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user ! : User

  private authApiUrl: string = environment.AuthApiUrl;

  constructor(
    private http: HttpClient, 
    private jwtService: JwtTokenService,
    private sessionService: SessionService,
    private userService: UserService,) { }
  
  login(credentials: AuthRequest): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, credentials);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/register`, user);
  }

  loadProfile(data : any):boolean{
    this.jwtService.saveToken(data.jwtToken);
    let userEmail =  this.jwtService.decodeToken(this.jwtService.getToken()).sub
    this.userService
    .getUserInformationByEmail(userEmail)
    .subscribe(
      (user) => {
        this.sessionService.saveUser(user);
        this.sessionService.updateAuthentication(true)
        this.user = user
        console.log('User data saved in session:', this.sessionService.getUser());
      },
      (error) => {
        console.error('Error fetching user information:', error);
      }
    );
    return this.sessionService.getisAuthenticated("isAuthenticated");
    
  }

  confirmAccount(token: string): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/confirm-account?token=${token}`);
  }

  logout(){

    this.sessionService.updateAuthentication(false)
    this.jwtService.removeToken()
    this.sessionService.clearUser()
     
  }
  

  
}
