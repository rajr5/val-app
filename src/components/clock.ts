import { Component } from "@angular/core";
import { Observable } from "rxjs/Rx";

@Component({
  selector: "clock",
  template: `
    <div class='time'>{{ date | async | date:'shortTime' }}</div>
    <div class='date'>{{ date | async | date:'shortDate' }}</div>
  `,
  styles: [`
     .date {
       margin-left: 20px;
       font-size: 170%;
     }

     .time {
       font-size: 300%;

     }
  `],
  providers: [ ],
})
export class ClockComponent {
  public date = Observable
       .interval(1000)
       .map(() => new Date());

  constructor() {}
}
