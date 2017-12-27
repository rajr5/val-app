import { APP_BASE_HREF } from "@angular/common";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule} from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Calendar } from "@ionic-native/calendar";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { CloudModule, CloudSettings } from "@ionic/cloud-angular";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { CalendarComponent } from "../components/calendar";
import { ClockComponent } from "../components/clock";
// import { RecipeCardComponent } from "../components/recipe/recipe-card.component";
// import { RecipeComponent } from "../components/recipe/recipe.component";
import { extensionSetup } from "../extensions";
import { AlarmPage } from "../pages/alarm/alarm";
import { MirrorPage } from "../pages/mirror/mirror";
import { ProfilePage } from "../pages/profile/profile";
import { ChooseIngredientPage } from "../pages/recipe/choose-ingredient";
import { IngredientPage } from "../pages/recipe/ingredient";
import { NewIngredientPage } from "../pages/recipe/new-ingredient";
import { NewRecipePage } from "../pages/recipe/new-recipe";
import { RecipeHomePage } from "../pages/recipe-home/recipe-home";
import { RecipePage } from "../pages/recipe/recipe";
// import { TabsPage } from "../pages/tabs/tabs";
import { ArrivalTimePipe } from "../pipes/arrivalTime";
import { SplitPipe } from "../pipes/split";
import { AuthProvider } from "../providers/auth.provider";
import { RecipeProvider } from "../providers/recipe.provider";
import { StorageProvider } from "../providers/storage.provider";
import { TrackingProvider } from "../providers/tracking.provider";
import { DeployService } from "../services/deploy.service";
import { SentryErrorHandler } from "../services/error.service";
import { PushService } from "../services/push.service";
import { TrackingService } from "../services/tracking.service";
import { MyApp } from "./app.component";

// https://forum.ionicframework.com/t/how-to-use-deeplinker-in-browser/75787/7

const cloudSettings: CloudSettings = {
  "core": {
    "app_id": "93275827"
  }
};

@NgModule({
  declarations: [
    MyApp,
    MirrorPage,
    // TabsPage,
    ArrivalTimePipe,
    SplitPipe,
    ClockComponent,
    CalendarComponent,
    // RecipeComponent,
    // RecipeCardComponent,
    AlarmPage,
    // RecipeHomePage,
    // RecipePage,
    IngredientPage,
    NewRecipePage,
    NewIngredientPage,
    ChooseIngredientPage,
    ProfilePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MirrorPage,
    AlarmPage,
    // RecipePage,
    IngredientPage,
    // RecipeHomePage,
    NewRecipePage,
    NewIngredientPage,
    ChooseIngredientPage,
    ProfilePage,
    // TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: APP_BASE_HREF, useValue: "/"},
    {provide: ErrorHandler, useClass: SentryErrorHandler},
    Mixpanel,
    MixpanelPeople,
    Deeplinks,
    StatusBar,
    SplashScreen,
    Mixpanel,
    MixpanelPeople,
    Calendar,
    PushService,
    DeployService,
    TrackingService,
    StorageProvider,
    RecipeProvider,
    AuthProvider,
    TrackingProvider,
  ]
})
export class AppModule {
  constructor() {
    extensionSetup();
  }
}
