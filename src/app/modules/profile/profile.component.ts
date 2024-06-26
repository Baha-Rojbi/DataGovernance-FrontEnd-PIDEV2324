import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'app/entities/User';
import { SessionService } from 'app/services/session/session.service';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit
{

    User : User
    /**
     * Constructor
     */
    constructor(private _sessionService : SessionService) 
    {
        
    }
    ngOnInit(): void {

        this.User = this._sessionService.getUser()
        this.User.avatar=this.User.avatar.replace('C:\\fakepath\\', 'assets/images/avatars/');
    }
}
