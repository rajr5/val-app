import { Component } from "@angular/core";

import { ApiService } from "../pages/mirror/api.service";

@Component({
  selector: "calendar-events",
  template: `
    <div class='calendar-events'>
      <span class='event' *ngFor='let event of apiService.calendars?.events; let i=index'>
        <span class='time'>{{ getTime(event) }}</span>
        <span class='event-name'>{{ event.summary }}</span>
      </span>
    </div>
    <div class='time'>{{ date | async | date:'shortTime' }}</div>
    <div class='date'>{{ date | async | date:'shortDate' }}</div>
  `,
  styles: [`
     .time {
     }
     .event {
      width: 100%;
    }
  `],
  providers: [ ApiService ],
})
export class CalendarComponent {
  constructor(public apiService: ApiService) {
    this.apiService.fetch();
  }

  getTime(e: any): string {
    return "date";
  }

}
