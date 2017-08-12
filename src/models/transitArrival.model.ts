let colors = {
  Brn: "brown",
  Red: "red",
  P: "purple",
};

export class TransitArrival {
  stationId: string;
  stopId: string;
  stationName: string;
  stopDescription: string;
  runNumber: number;
  route: string;
  terminalDestination: string;
  terminalDestinationName: string;
  trainRoute: string;
  predictionTimestamp: Date;
  arrivalTime: Date;
  isApproaching: boolean;
  isSchedule: boolean;
  isDelayed: boolean;
  isFaulted: boolean;
  color: string;

  constructor(arrivalData: any) {
    for (let key of ["route", "terminalDestination", "terminalDestinationName", "arrivalTime",
         "isApproaching", "isDelayed", "isFaulted"]) {
      this[key] = arrivalData[key];
    }
    this.color = colors[this.route];
  }
}
