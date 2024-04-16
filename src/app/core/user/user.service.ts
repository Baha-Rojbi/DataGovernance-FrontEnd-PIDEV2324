import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Team, User } from 'app/entities/User';
import { environment } from 'app/apis/environment';
import { JwtTokenService } from 'app/services/jwt/jwt-token.service';
import { AuthUtils } from '../auth/auth.utils';
import { VerifyOldPasswordRequest } from 'app/entities/requests/VerifyOldPasswordRequest ';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _userApiUrl: string = environment.UserApiUrl;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _jwtService:JwtTokenService
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<any>
    {
        const email = AuthUtils._decodeToken(this._jwtService.getToken()).sub

        return this._httpClient.get<any>(`${this._userApiUrl}/getUserInformationByLoggedEmail/${email}`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * 
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    /**
     * verify the old password 
     *
     */
    verifyOldPassword(verifyOldPasswordRequest : VerifyOldPasswordRequest){
        return this._httpClient.post<boolean>(`${this._userApiUrl}/verifyOldPassword`, verifyOldPasswordRequest);
    }
    /**
     * updating the password
     *
     */
    updatePassword(userId: number, newPassword: string): Observable<any> {
        return this._httpClient.post<any>(`${this._userApiUrl}/updatePassword/${userId}`, newPassword);
     }
    /**
     * updating the password
     *
     */
     updateProfile(utilisateur: User): Observable<User> {
        return this._httpClient.post<any>(`${this._userApiUrl}/updateProfile`, utilisateur);
    }
     /**
     * gettting all the approved users
     *
     */
    getAllApprovedUsers(UserId: Number,ownedTeamId : number): Observable<User[]> {
        return this._httpClient.get<any>(`${this._userApiUrl}/getAllApprovedUsers/${UserId}/${ownedTeamId}`)
    }

    /**
     * Adding a user in a team 
     *
    */
    addUserToTeam (leaderEmail: string, memberEmail : string ): Observable<any> {
        return this._httpClient.post<any>(`${this._userApiUrl}/addUserToTeam/${leaderEmail}/${memberEmail}`,null)
    }

    /**
     * Adding a user in a team 
     *
    */
    getOwnedTeamMemebers (ownedTeamId: number): Observable<User[]> {
        return this._httpClient.get<any>(`${this._userApiUrl}/getOwnedTeamMemebers/${ownedTeamId}`)
    }

    /**
     * Deleting a team member
     *
    */
    removeMemberFromTeam(teamId : number, teamMemberId):Observable<any>{
        return this._httpClient.delete<any>(`${this._userApiUrl}/removeMemberFromTeam/${teamId}/${teamMemberId}`)
    }

    /**
     * clearing the images paths 
     *
    */
    clearOwnedTeamMembersImagesPath(members : User[]):User[]{
        members.forEach(member => {
            if (member.avatar) {
                // Replace the 'C:\\fakepath\\' with 'assets/images/avatars/'
                member.avatar = member.avatar.replace('C:\\fakepath\\', 'assets/images/avatars/');
            }
        });
        return members
    }
}
