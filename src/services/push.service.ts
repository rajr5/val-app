import { Injectable } from "@angular/core";
import { Push, PushToken } from "@ionic/cloud-angular";
import { Platform } from "ionic-angular";
import { TrackingService } from "./tracking.service";

@Injectable()
export class PushService {
  constructor(private push: Push, private tracking: TrackingService, private plt: Platform) {}
  public registerForPush() {
    if (!this.plt.is("cordova")) {
      console.debug("Not on a device, not registering for push");
      return;
    }
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      this.tracking.track("PushRegister");
      console.debug("Token saved:", t.token);
    });
  }
}
