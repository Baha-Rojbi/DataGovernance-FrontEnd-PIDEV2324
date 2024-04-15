import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { FileManagerService } from 'app/modules/file-manager/file-manager.service';
import { DataTable } from '../models/data-table';


@Injectable({
    providedIn: 'root'
})
export class FileManagerItemsResolver implements Resolve<any> {
    constructor(private _fileManagerService: FileManagerService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataTable[]> {
        return this._fileManagerService.getDataTables(); // Assuming getDataTables() fetches all DataTable entities
    }
}




@Injectable({
    providedIn: 'root'
})
export class FileManagerItemResolver implements Resolve<any> {
    constructor(private _fileManagerService: FileManagerService, private _router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DataTable> {
        const id = Number(route.paramMap.get('id'));
        if (!id) {
            // Handle invalid or missing ID
            console.error('DataTable ID is invalid or missing');
            this._router.navigate(['/']); // Adjust as needed
            return throwError(() => new Error('DataTable ID is invalid or missing'));
        }
        return this._fileManagerService.getDataTableById(id)
                   .pipe(catchError((error) => {
                       console.error(error);
                       this._router.navigate(['/']); // Adjust as needed
                       return throwError(() => new Error('Error fetching DataTable by ID'));
                   }));
    }
}
