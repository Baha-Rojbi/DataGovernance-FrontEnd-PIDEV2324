import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/apis/environment';
import { User } from 'src/app/entities/User';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { AffectRoleAndChangeStatus } from 'src/app/entities/requests/AffectRoleAndChangeStatusRequest';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private jwtService : JwtTokenService) { }

  private UserApiUrl: string = environment.UserApiUrl;
  
  getPendingUsersRequests(): Observable<User[]> {
    return this.http.get<User[]>(`${this.UserApiUrl}/getPendingUsersRequests`)
  }

  affectRoleAndChangeStatus(affectRoleAndChangeStatus:  AffectRoleAndChangeStatus): Observable<User> {
    return this.http.put<User>(`${this.UserApiUrl}/affectRoleAndChangeStatus`,affectRoleAndChangeStatus)
  }
}
