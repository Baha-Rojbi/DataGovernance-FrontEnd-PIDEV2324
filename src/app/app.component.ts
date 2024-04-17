import { Component } from '@angular/core';
import { SessionService } from './services/session/session.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(private _sessionService : SessionService)
    {
        
    }

    
}
