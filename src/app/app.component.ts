import { Component, ViewChild } from "@angular/core";
import { Deeplinks } from "@ionic-native/deeplinks";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Nav, Platform } from "ionic-angular";

import { MirrorPage } from "../pages/mirror/mirror";
import { TabsPage } from "../pages/tabs/tabs";
import { DeployService } from "../services/deploy.service";
import { PushService } from "../services/push.service";
import { TrackingService } from "../services/tracking.service";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) navChild: Nav;

  constructor(private platform: Platform, private deeplinks: Deeplinks, private statusbar: StatusBar,
              private splashscreen: SplashScreen, private push: PushService, private deploy: DeployService,
              private tracking: TrackingService) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusbar.styleDefault();
      this.splashscreen.hide();
      this.tracking.init();
      // Convenience to route with a given nav
      this.deeplinks.routeWithNavController(this.navChild, {
        "/mirror": MirrorPage,
      }).subscribe((match) => {
        console.debug("Successfully routed", match);
      }, (nomatch) => {
        console.warn("Unmatched Route", nomatch);
      });
    });
  }
}
