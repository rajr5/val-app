import { Component } from "@angular/core";
import { IonicPage } from 'ionic-angular';

import { AppSettings } from "../../config";
import { AlarmPage } from "../alarm/alarm";
import { MirrorPage } from "../mirror/mirror";
import { ProfilePage } from "../profile/profile";
// import { RecipeHomePage } from "../recipe-home/recipe-home";

class TabConfig {
  constructor(public page: any, public title: string, public icon: string) {}
}

@IonicPage({
  // Hack to make navigating to urls work....... https://github.com/ionic-team/ionic/issues/12304
  segment: 't',
})
@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;

  tabs: TabConfig[] = [];

  constructor() {
    console.log("TABS", AppSettings)
    let index = 1;
    if (AppSettings.ENABLE_RECIPE) {
      this.tabs.push(new TabConfig("RecipeHomePage", "Food", "nutrition"));
      index++;
    }
    if (AppSettings.ENABLE_MIRROR) {
      this.tabs.push(new TabConfig(MirrorPage, "Mirror", "home"));
      index++;
    }
    if (AppSettings.ENABLE_ALARM) {
      this.tabs.push(new TabConfig(AlarmPage, "Alarm", "alarm"));
      index++;
    }
    this.tabs.push(new TabConfig(ProfilePage, "Profile", "person"));
    // console.log("TABS", this.tabs);
    this.tab1Root = this.tabs[0].page;
    if (this.tabs.length > 1 ) {
      this.tab2Root = this.tabs[1].page;
    }
    if (this.tabs.length > 2) {
      this.tab3Root = this.tabs[2].page;
    }
    if (this.tabs.length > 3) {
      this.tab4Root = this.tabs[3].page;
    }
  }
}
