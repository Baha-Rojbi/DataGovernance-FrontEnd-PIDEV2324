import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator

import { ActivitiesService } from './activities.service';
import { TraceLog } from '../models/Trace-log';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  logs$: Observable<TraceLog[]>;
  searchText: string = '';
  sortByDateAscending: boolean = true;

  constructor(private route: ActivatedRoute, private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.logs$ = this.activitiesService.getLogs();
    this.logs$.subscribe({
      next: logs => {
        console.log('Received logs:', logs); // Add this console log
      },
      error: err => {
        console.error('Error fetching logs:', err); // Add this console log
      }
    });
  }

  filteredLogs(logs: TraceLog[]): TraceLog[] {
    if (!this.searchText.trim()) {
      return logs;
    }

    return logs.filter(log => log.fileName.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  sortLogsByDate(): void {
    this.sortByDateAscending = !this.sortByDateAscending;
    this.logs$ = this.logs$.pipe(map(logs => this.sortLogs(logs)));
  }

  private sortLogs(logs: TraceLog[]): TraceLog[] {
    return logs.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return this.sortByDateAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }

 
}
