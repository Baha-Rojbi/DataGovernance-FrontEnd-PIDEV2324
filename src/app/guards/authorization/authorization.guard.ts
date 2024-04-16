import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { SessionService } from '../../services/session/session.service';

@Injectable()
export class authorizationtionGuard implements CanActivate {
  constructor(private router : Router ,private session : SessionService, private authService : AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
   if(this.session.getUser().role=="ADMINISTRATEUR"){//nbadlou role
        console.log("test        "+this.session.getisAuthenticated("isAuthenticated"))
    return true;

   }
   else{
    this.router.navigate(['/notAuthorized'])

    
    return false;
   }
  }
}
