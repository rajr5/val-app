// import { AlarmService } from './alarm.service.ts';
import { Component } from "@angular/core";
import { Calendar } from "@ionic-native/calendar";
import { StatusBar } from "@ionic-native/status-bar";
import { NavController, NavParams, Platform } from "ionic-angular";
import { FullScreen } from "../../services/fullscreen";

/*
  Generated class for the Alarm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: "page-alarm",
  templateUrl: "alarm.html",
  providers: [ FullScreen ],
})
export class AlarmPage {
//  public alarmService = new AlarmService();
  constructor(public navCtrl: NavController, public navParams: NavParams,
      public fullscreenService: FullScreen, private platform: Platform,
      private statusbar: StatusBar, private calendar: Calendar) {}

  tappedFullscreen() {
    this.fullscreenService.fullscreen();
  }

  ionViewDidLoad() {
    // console.log("ionViewDidLoad AlarmPage");
    this.statusbar.hide();

    if (this.platform.is("cordova")) {
    this.calendar.requestReadPermission().then(() => {

      this.calendar.listCalendars().then((res) => {
        // console.log("CALENDARS", res);
        for (let cal of res) {
          // console.log("cal", cal.name);
        }
      });
      // Calendar.findEvent('Give Roman head guard').then((res) => {console.log("REMINDER", res)});
    });
    }
  }

  public swipeLeft(event) {
    // console.log("SWIPE LEFT");
    this.navCtrl.parent.select(0);
  }

  public swipeRight(event) {
    // console.log("SWIPE RIGHT");
    this.navCtrl.parent.select(2);
  }

  public tap(event) {
    // console.log("TAP");
  }
}
