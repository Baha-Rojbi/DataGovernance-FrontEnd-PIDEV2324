import { Injectable } from '@angular/core';
import { User } from 'src/app/entities/User';



@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  public isAuthenticated : boolean = false

  saveUser(user: User): any {
    return sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const userString = sessionStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;
    return user; // Return the user object instead of the userString
  }
  
  
  clearUser(): void {
    sessionStorage.removeItem('user');
  }
  
  updateAuthentication(state:boolean){
    this.isAuthenticated = state;
    sessionStorage.setItem("isAuthenticated", JSON.stringify(this.isAuthenticated));
  }

  getisAuthenticated(key: string): boolean  {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}
