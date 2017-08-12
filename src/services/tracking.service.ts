import { Injectable } from "@angular/core";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";
import { AppSettings } from "../config";

@Injectable()
export class TrackingService {
  constructor(private mixpanel: Mixpanel, private mixpanelPeople: MixpanelPeople) {}

  init() {
    this.mixpanel.init(AppSettings.MIXPANEL_TOKEN)
      .then(this.onSuccess)
      .catch(this.onError);
    console.debug("[Mixpanel] Initialized");
  }

  identify(email: string, properties: any) {
    console.debug("[Mixpanel] identifying user:", email, properties);
    this.mixpanelPeople.identify(email);
    this.mixpanelPeople.set(properties);
  }

  track(event: string, properties?: any) {
    console.debug("[Mixpanel] tracking: ", event, properties);
    if (properties) {
      this.mixpanel.track(event, properties);
    } else {
      this.mixpanel.track(event);
    }
  }

  onSuccess(e) {
    console.debug("[Mixpanel] Initialization success: ", e);
  }

  onError(e) {
    console.error("[Mixpanel] Intitialization error: ", e);
  }
}
