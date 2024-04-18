import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, retry, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'app/apis/environment';
import { User } from 'app/entities/User';
import { JwtTokenService } from 'app/services/jwt/jwt-token.service';
import { SessionService } from 'app/services/session/session.service';
import { EmailConfirmationRequest } from 'app/entities/requests/sendEmailConfirmation';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private _authApiUrl: string = environment.AuthApiUrl;
    private _userApiUrl: string = environment.UserApiUrl;
    private _countryApiUrl : string = environment.apiUrl
    private _adminApiUrl : string = environment.AdminApiUrl

     _user : User
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _jwtService : JwtTokenService,
        private _sessionService : SessionService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password Email
     *
     * 
     */
    resetPassword(token: string, password: string): Observable<any> {
        return this._httpClient.put<any>(`${this._authApiUrl}/resetPassword/${token}/${password}`, null); 
      }

    /**
     * Reset password Email
     *
     * 
     */
    resetPasswordSMS(ncin: string, password: string): Observable<any> {
        return this._httpClient.put<any>(`${this._authApiUrl}/resetPasswordSMS/${ncin}/${password}`, null); 
      }
    /**
     * Sign in
     * there is multiple call because all the method needs each other and they are async 
     * @param credentials
     */ 
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(`${this._authApiUrl}/login`, credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.jwtToken;

                this._jwtService.saveToken(this.accessToken)
                // Set the authenticated flag to true
                this._authenticated = true;
                // Store the user on the user service
            
                return this.getUserInformation(AuthUtils._decodeToken(this.accessToken).sub).pipe(
                    switchMap((resp) => {
                        // Return a new observable with the response
                        //Saving the user in the session
                         this._user= resp
                         this._user.avatar=this._user.avatar.replace('C:\\fakepath\\', 'assets/images/avatars/');

                         if (this._user.ownedTeam != null) {
                            this._userService.getOwnedTeamMemebers(this._user.ownedTeam.id).subscribe(
                                (teamMembers: User[]) => {
                                    this._user.ownedTeamMembers = teamMembers;
                                    this._sessionService.saveUser(this._user);

                                },
                                (error) => {
                                    console.error('Error fetching team members:', error);
                                }
                            );
                        }
                        this._sessionService.saveUser(this._user);

                        return of(response);
                    })
                    
                );
            })
        );
        
    }


    /**
     * Sending the account confirmation Email
     */
    sendEmailConfirmation(request: EmailConfirmationRequest): Observable<any> {
        return this._httpClient.post<any>(`${this._authApiUrl}/send-email-confirmation`, request);
    }

    /**
     * Confirm Account through clicking on the link 
     */
    confirmAccount(token: string): Observable<string> {
        return this._httpClient.get<string>(`${this._authApiUrl}/confirm-account?token=${token}`);
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                this._sessionService.updateAuthentication(true)


                // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        //deleting the user from the session
        this._sessionService.clearUser()

        //removing the jwt Token 
        this._jwtService.removeToken()

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: User): Observable<any> {
        return this._httpClient.post<any>(`${this._authApiUrl}/register`, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
    /**
     * get user information 
     *
     * 
     */
    getUserInformation(email :any ): Observable<any>
    {
          return this._httpClient.get<any>(`${this._userApiUrl}/getUserInformationByLoggedEmail/${email}`).pipe(
            switchMap((response: any) => {
                // Store the user on the user service
                 this._user=response.user

                // Return a new observable with the response
                return of(response);
            })
        );
      
    }

    /**
     * send mail for forget password 
     *
     * 
     */
    sendMailForgetPassword(email: string): Observable<User> {

    return this._httpClient.get<any>(`${this._authApiUrl}/sendMailForgetPassword/${email}`)
    }

    /**
     * returns user object if the ncin or Email already exists 
     *
     * 
     */
    checkNcinOrEmailExists(value: string): Observable<User> {
        return this._httpClient.get<any>(`${this._authApiUrl}/getNcinOrEmail/${value}`)
    }


    /**
     * Verifying the jwt tocken 
     */
    verifyTocken(request: String): Observable<any> {
         return this._httpClient.post<any>(`${this._authApiUrl}/verifyToken`, request);
    }

    /**
     * Sending the account confirmation Email
     */
    sendOTPCode(request: String ): Observable<any>{
        return this._httpClient.post<any>(`${this._authApiUrl}/send-SMS-confirmation/${request}`,null)

    }

    /**
     * verify the otp code 
     */
    verifyOTP(phoneNumber: string, otp: string) {
        return this._httpClient.post<boolean>(`${this._authApiUrl}/verifyOTP/${phoneNumber}/${otp}`, {});
    }
    /**
     * gettinhg the user owned team members  
     */
    getOwendTeamMembers(ownedTeamId: number):User[]{
        let result : User[]
        this._userService.getOwnedTeamMemebers(ownedTeamId).subscribe(
            (teamMembers: User[]) => {
            result = teamMembers
            console.log(teamMembers)
              // Process the list of team members as needed
            },
            (error) => {
              console.error('Error fetching team members:', error);
            }
          );
          return result;
    }
    
    /**
     * gettinhg the user owned team members  
     */
    getAllCountries(): Observable<any> {
        return this._httpClient.get(this._countryApiUrl);  
    }


}
