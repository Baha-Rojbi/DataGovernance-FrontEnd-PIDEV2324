import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Role } from 'src/app/entities/User';
import { SessionService } from 'src/app/services/session/session.service';
import { Observable } from 'rxjs';

@Injectable()
export class authorizationtionGuard implements CanActivate {
  constructor(private router : Router ,private session : SessionService, private authService : AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
   if(this.session.getUser().role=="ADMINISTRATEUR"){
        console.log("test        "+this.session.getisAuthenticated("isAuthenticated"))
    return true;

   }
   else{
    this.router.navigate(['/notAuthorized'])

    
    return false;
   }
  }
}
