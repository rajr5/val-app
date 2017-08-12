// TODO: this should be a singleton
export class AppSettings {
  public static get API_ENDPOINT(): string { return "http://localhost:8080/"; }
  public static get MIXPANEL_TOKEN(): string { return ""; }
  public static get ENABLE_MIRROR(): boolean { return false; }
  public static get ENABLE_RECIPE(): boolean { return true; }
  public static get ENABLE_ALARM(): boolean { return false; }
}
