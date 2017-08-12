import { Component } from "@angular/core";
import { StatusBar } from "@ionic-native/status-bar";
import { NavController, NavParams } from "ionic-angular";

import { Forecast } from "../../models/forecast.model";
import { FullScreen } from "../../services/fullscreen";
import { ApiService, CTAService } from "./api.service";

@Component({
  selector: "page-mirror",
  templateUrl: "mirror.html",
  providers: [ ApiService, CTAService, FullScreen ],
})
export class MirrorPage {
  public forecast: Forecast;
  public errorMessage: any;
  public quote: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public apiService: ApiService, public ctaService: CTAService,
      public fullscreenService: FullScreen, private statusbar: StatusBar) {
  }

  tappedFullscreen() {
    this.fullscreenService.fullscreen();
  }

  clickedContent() {
    // console.log("clicked content");
    this.fullscreenService.exitFullscreenHandler();
  }

  ionViewDidLoad() {
    this.statusbar.hide();
    this.ctaService.fetch();
    this.apiService.fetch();
    // TODO: reenable when we have deeplinking and can conditionally set this
//    setTimeout(() => {
//      this.fullscreenService.fullscreen();
//    }, 1000);
  }
}
