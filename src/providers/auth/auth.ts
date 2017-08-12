import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Auth, Push, PushToken, User, UserDetails } from "@ionic/cloud-angular";
import { Platform } from "ionic-angular";
import "rxjs/add/operator/map";
import { TrackingService } from "../../services/tracking.service";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
  public details: UserDetails = {};

  constructor(public http: Http, private auth: Auth, private user: User, private push: Push,
              private tracking: TrackingService, private plt: Platform) {
    if (auth.isAuthenticated()) {
      // console.log("user: ", user);
      this.tracking.identify(user.details.email, []);
      this.registerForPush();
    }
  }

  public isAuthenticated(): Boolean {
    return this.auth.isAuthenticated();
  }

  // TODO: migrate the bits that work with the API over here
  public signup(email: string, password: string) {
    return this.auth.signup({email, password}).then(() => {
      console.info(`Signup success: ${this.user}`);
      return this.auth.login("basic", {"email": this.details.email, "password": this.details.password});
    }).then(() => {
      console.info("Login success");
      this.tracking.identify(this.details.email, []);
      this.tracking.track("Signup");
      this.registerForPush();
    });
  }

  public login(email: string, password: string) {
     return this.auth.login("basic", {"email": email, "password": password}).then(() => {
      console.info("Login success");
      this.tracking.identify(this.details.email, []);
      this.tracking.track("Login");
      this.registerForPush();
    });
 }

  public logout() {
    this.auth.logout();
    this.tracking.track("Logout");
    this.push.unregister();
  }

  public registerForPush() {
    if (!this.plt.is("cordova")) {
      console.debug("Not on a device, not registering for push");
      return;
    }
    return this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      this.tracking.track("PushRegister");
      // console.log("Token saved:", t.token);
    });
  }
}
