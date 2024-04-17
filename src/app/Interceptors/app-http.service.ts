import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../services/jwt/jwt-token.service';


@Injectable()
export class AppHttpService implements HttpInterceptor {

  constructor(private jwtService: JwtTokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if the request URL includes "/login" or "/register"
    if (request.url.includes("auth")) {
      // If it's a login or register request, bypass interceptor logic
      return next.handle(request);
    }

    // For other requests, add Authorization header with JWT token
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.jwtService.getToken()}`
      }
    });

    return next.handle(newRequest);
  }
}
