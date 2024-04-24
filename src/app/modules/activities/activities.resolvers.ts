import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivitiesService } from './activities.service';
import { TraceLog } from '../models/Trace-log';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesResolver implements Resolve<Observable<TraceLog[]>> {
  constructor(private activitiesService: ActivitiesService) {}

  resolve(): Observable<TraceLog[]> {
    return this.activitiesService.getLogs();
  }
}
