
class ForecastPoint {
  summary: string;
  icon: string;
  temperature: number;
  low: number;
  high: number;
  day: Date;
  data: any;

  constructor(forecastData: any) {
    this.data = forecastData;
    if (forecastData.summary) {
      this.summary = forecastData.summary;
    }
    if (forecastData.icon) {
      this.icon = forecastData.icon;
    }
    if (forecastData.temperature) {
      this.temperature = forecastData.temperature;
    }
    if (forecastData.temperatureMin) {
      this.low = forecastData.temperatureMin;
    }
    if (forecastData.temperatureMax) {
      this.high = forecastData.temperatureMax;
    }
    if (forecastData.time) {
      this.day = new Date(0); // The 0 there is the key, which sets the date to the epoch
      this.day.setUTCSeconds(forecastData.time);
    }
  }

  getIcon() {
    switch (this.icon) {
        case "rain":
          return "rainy";
        case "thunderstorm":
          return "flash";
        case "clear-day":
          return "sunny";
        case "clear-night":
          return "moon";
        case "partly-sunny":
          return "partly-sunny";
        case "partly-cloudy-day":
        case "cloudy":
          return "cloudy";
        case "partly-cloudy-night":
          return "cloudy-night";
        case "snow":
        case "sleet":
          return "snow";
        // case 'wind':
        // case 'tornado':
        // case 'fog':
        // case 'hail':
        default:
          return "help";  // question mark
    }
  }
}

export class Forecast {
  currently: ForecastPoint;
  hourly: ForecastPoint[];
  hourlySummary: string;
  daily: ForecastPoint[];
  dailySummary: string;

  constructor(forecastData: any) {
    this.currently = new ForecastPoint(forecastData.currently);
    this.hourly = forecastData.hourly.data.map((hour) => new ForecastPoint(hour));
    this.daily = forecastData.daily.data.map((day) => new ForecastPoint(day));
    this.hourlySummary = forecastData.hourly.summary;
    this.dailySummary = forecastData.daily.summary;
  }
}
