import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  constructor() {}
  private  TOKEN_KEY: string="";

  // Save JWT token to local storage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get JWT token from local storage
  getToken():    any  {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove JWT token from local storage
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Decode JWT token to access payload
  decodeToken(token: string): any | null{
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  }

  // Check if JWT token is expired
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(payload.exp);
    return expirationDate.valueOf() <= new Date().valueOf();
  }

  // Check if user is authenticated (token exists and not expired)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  
}
