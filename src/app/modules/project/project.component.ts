import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from './project.service';

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements  OnDestroy
{
   
    data: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    

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
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    
    tableCount: number | undefined; // Define the 'tableCount' property here
    tableelementCount: any;

  

  ngOnInit(): void {
    this.getTableCount();
  }

  getTableCount(): void {
    this._projectService.getTableCount().subscribe(
      (data) => {
        console.log('Response data:', data); // Log the response data
        this.tableCount = data.table_count;
      },
      (error) => {
        console.error('Error fetching table count:', error);
      }
    );
  }
  
  gettablelements(): void {
    this._projectService.getTableelementCounts().subscribe(
        (response) => {
          this.tableelementCount = response;
        },
        (error) => {
          console.error('Error fetching table counts:', error);
        }
      );
    }

  
}
