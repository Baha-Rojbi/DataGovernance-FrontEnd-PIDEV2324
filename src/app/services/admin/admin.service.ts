import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JwtTokenService } from '../jwt/jwt-token.service';
import { environment } from '../../apis/environment';
import { User } from '../../entities/User';
import { AffectRoleAndChangeStatus } from '../../entities/requests/AffectRoleAndChangeStatusRequest';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private jwtService : JwtTokenService) { }

  private AdminApiUrl: string = environment.AdminApiUrl;
  
  getPendingUsersRequests(): Observable<User[]> {
    return this.http.get<User[]>(`${this.AdminApiUrl}/getPendingUsersRequests`)
  }

  affectRoleAndChangeStatus(affectRoleAndChangeStatus:  AffectRoleAndChangeStatus): Observable<User> {
    return this.http.put<User>(`${this.AdminApiUrl}/affectRoleAndChangeStatus`,affectRoleAndChangeStatus)
  }

    /**
     * gettinhg the stats 
     */
      getUserStatusCount(): Observable<any> {
        return this.http.get<User[]>(`${this.AdminApiUrl}/getUserStatusCount`)
      }
}
