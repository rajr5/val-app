import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../config";
import { Forecast } from "../../models/forecast.model";
import { TransitArrival } from "../../models/transitArrival.model";

@Injectable()
export class ApiService {
  private forecastUpdateInterval = 60 * 1000;
  private forecastUrl = AppSettings.API_ENDPOINT + "forecastio";
  public forecast: Forecast;

  private quoteUpdateInterval = 15 * 60 * 1000;
  private quoteUrl = AppSettings.API_ENDPOINT + "inspirationalQuote";
  private quotes: string[];
  public quote: string;

  private calendarUpdateInterval = 5 * 60 * 1000;
  private calendarUrl = AppSettings.API_ENDPOINT + "calendars";
  public calendars: any[];

  constructor (private http: Http) {
  }

  public fetch() {
    setInterval(() => {
      this.fetchForecast().subscribe(() => {});
    }, this.forecastUpdateInterval);
    this.fetchForecast().subscribe(() => {});

    setInterval(() => {
      this.fetchQuotes().subscribe(() => {});
    }, this.quoteUpdateInterval);
    this.fetchQuotes().subscribe(() => {});

    setInterval(() => {
      this.fetchCalendar().subscribe(() => {});
    }, this.calendarUpdateInterval);
    this.fetchCalendar().subscribe(() => {});

  }

  private fetchForecast(): Observable<Forecast> {
    return this.http.get(this.forecastUrl)
        .map(this.extractForecast.bind(this))
        .catch(this.apiError);
  }

  private extractForecast(res: Response) {
    let body = res.json();
    this.forecast = new Forecast(body);
    return this.forecast;
  }

  private fetchQuotes(): Observable<string[]> {
    return this.http.get(this.quoteUrl)
        .map(this.extractQuotes.bind(this))
        .catch(this.apiError);
  }

  private extractQuotes(res: Response) {
    let body = res.json();
    this.quotes = body.quotes;
    this.quote = this.pickAtRandom(this.quotes);
    return body.quotes;
  }

  private fetchCalendar(): Observable<any[]> {
    return this.http.get(this.calendarUrl)
        .map(this.extractCalendar.bind(this))
        .catch(this.apiError);
  }

  private extractCalendar(res: Response) {
    let body = res.json();
    this.calendars = body as any[];
    return this.calendars;
  }

  private pickAtRandom(list: string[]): string {
    if (list) {
      return list[Math.floor(Math.random() * list.length)];
    } else {
      return "";
    }
  }

  private apiError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(`Base API Error: ${errMsg}`);
    return [];
  }
}

@Injectable()
export class CTAService {
  private ctaUpdateInterval = 15 * 1000;
  private ctaUrl = AppSettings.API_ENDPOINT + "cta";
  public ctaArrivals: {} = {};
  public arrivalArray: TransitArrival[] = [];

  constructor (private http: Http) {

  }
  public fetch() {
   setInterval(() => {
      this.fetchCtaArrivals().subscribe(() => {});
    }, this.ctaUpdateInterval);
    this.fetchCtaArrivals().subscribe(() => {});
  }

  private fetchCtaArrivals(): Observable<{}> {
    return this.http.get(this.ctaUrl)
        .map(this.extractCtaArrivals.bind(this))
        .catch(this.apiError);
  }

  private extractCtaArrivals(res: Response): {} {
    let body = res.json();
    // Data binding cruft
    for (let member in this.ctaArrivals) delete this.ctaArrivals[member];
    for (let arrivalData of body.trains) {
      let arrival = new TransitArrival(arrivalData);
      if (!this.ctaArrivals[arrival.route + arrival.terminalDestinationName]) {
        this.ctaArrivals[arrival.route + arrival.terminalDestinationName] = [];
      }
      this.ctaArrivals[arrival.route + arrival.terminalDestinationName].push(arrival);
    }
    this.arrivalArray = [];
    for (let arr of Object.keys(this.ctaArrivals)) {
      this.arrivalArray.push(this.ctaArrivals[arr]);
    }

    return this.ctaArrivals;
  }

  private apiError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return [];
  }
}
