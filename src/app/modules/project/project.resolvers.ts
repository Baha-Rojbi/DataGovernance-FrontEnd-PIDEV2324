import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from './project.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _projectService: ProjectService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._projectService.getData();
    }
}
