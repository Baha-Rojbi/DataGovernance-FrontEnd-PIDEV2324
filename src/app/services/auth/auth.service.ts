import { Injectable } from '@angular/core';
import { environment } from '../../apis/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtTokenService } from '../jwt/jwt-token.service';
import { SessionService } from '../session/session.service';
import { User } from '../../entities/User';
import { AuthRequest } from '../../entities/requests/AuthRequest';


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
  ) { }
  
  signIn(credentials: AuthRequest): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/login`, credentials);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/register`, user);
  }



  confirmAccount(token: string): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/confirm-account?token=${token}`);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.put<any>(`${this.authApiUrl}/resetPassword/${token}/${password}`, null); 
  }

  logout(){

    this.sessionService.updateAuthentication(false)
    this.jwtService.removeToken()
    this.sessionService.clearUser()
     
  }
  

  
}
