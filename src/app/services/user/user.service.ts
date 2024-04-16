import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/apis/environment';

import { JwtTokenService } from '../jwt/jwt-token.service';
import { User } from 'src/app/entities/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private jwtService : JwtTokenService) { }

  private UserApiUrl: string = environment.UserApiUrl;
  
  getUserInformationByEmail(email: string): Observable<User> {

    return this.http.get<any>(`${this.UserApiUrl}/getUserInformationByLoggedEmail/${email}`)
  }





}
