import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';
import { CryptoService } from './crypto.service';

@Component({
    selector       : 'crypto',
    templateUrl    : './crypto.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoComponent implements OnInit, OnDestroy
{
    
  @ViewChild('btcChartComponent') btcChartComponent: ChartComponent;
  appConfig: any;
  btcOptions: ApexOptions = {};
    data: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _cryptoService: CryptoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    metadata: any;
    dbName: string = ''; // Initialize dbName as empty string
    tableName: string = ''; // Initialize tableName as empty string
    isLoading = false;

  
    getMetadata(): void {
      this.isLoading = true;
      if (this.dbName.trim() !== '') {
        this._cryptoService.getDatabaseMetadata(this.dbName, this.tableName).subscribe(
          (response) => {
            this.metadata = response.metadata; 
            this.isLoading = false; // Set the metadata received from the backend
          },
          (error) => {
            console.error(error);
            this.isLoading = false; // Handle errors here
          }
        );
      }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened if 'lg' breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

      
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
  
}
