import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({name: "arrivalTime"})
export class ArrivalTimePipe implements PipeTransform {
  transform(value: string): string {
    let now = moment();
    let arrival = moment(value, "YYYYMMDD HH:mm:dd");
    let diff = arrival.diff(now);
    let mins = Math.round(((diff % 86400000) % 3600000) / 60000);
    if (mins <= 0) {
      return "Now";
    } else if (mins === 1) {
      return String(mins) + "min";
    } else {
      return String(mins) + "mins";
    }
  }
}
