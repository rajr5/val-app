// TODO: this should be a singleton
export class AppSettings {
  public static get API_ENDPOINT(): string { return "https://veronica.nang.in/"; }
  public static get MIXPANEL_TOKEN(): string { return "933c97e7115c8b9c39a00826222dce26"; }
  public static get ENABLE_MIRROR(): boolean { return true; }
  public static get ENABLE_RECIPE(): boolean { return false; }
  public static get ENABLE_ALARM(): boolean { return false; }
}
