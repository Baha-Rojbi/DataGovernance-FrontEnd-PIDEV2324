import { Injectable, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';
import { SessionService } from 'app/services/session/session.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi implements OnInit
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private  _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;
    private userRole : any

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _sessionService : SessionService)
    {
        this.setupNavigation()

 
      

    }
    ngOnInit(): void {

    }


/**
 * Set up navigation based on the user's role
 */
private setupNavigation(): void {
    console.log("******")
    this.userRole = this._sessionService.getUser().role;
    // Filter out the "Project" and "Pending User Requests" elements if the user role is not "admin"
    if (this.userRole !== 'ADMINISTRATEUR') {
        // Clone the default navigation data before modifying it
        this._defaultNavigation = cloneDeep(defaultNavigation);
        this._defaultNavigation.forEach(group => {
            if (group.id === 'dashboards' && group.children) {
                group.children = group.children.filter(child => child.id !== 'dashboards.project');
            }
        });
        this._defaultNavigation.forEach(group => {
            if (group.id === 'apps' && group.children) {
                group.children = group.children.filter(child => child.id !== 'apps.pendingRequest');
            }
        });
    }
    // Register Mock API handlers after setting up navigation
    this.registerHandlers();
}


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Return the response
                return [
                    200,
                    {
                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation)
                    }
                ];
            });
    }
}
