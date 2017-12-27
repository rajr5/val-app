import { Component } from "@angular/core";
import { IDetailedError } from "@ionic/cloud-angular";
import { Platform, ToastController } from "ionic-angular";

import { AuthProvider } from "../../providers/auth.provider";
import { TrackingService } from "../../services/tracking.service";

@Component({
  providers: [ TrackingService, AuthProvider ],
  selector: "profile",
  templateUrl: "profile.html",
 })
export class ProfilePage {
  public view: string = "login";
  public details: any = {};

  constructor(private plt: Platform, private toastCtrl: ToastController, private tracking: TrackingService,
              public auth: AuthProvider) {
    if (this.auth.isAuthenticated()) {
      this.view = "profile";
    }
  }

  // Currently not allowed
  public signup() {
    // console.log("signup", this.details);
    this.auth.signup(this.details.email, this.details.password).then(() => {
    console.debug(`Signing up: ${this.details}`);
      this.toast("Hello! I'm Val. Welcome :)");
      this.view = "profile";
      this.details = {};
    }, (err: IDetailedError<string[]>) => {
      console.error("Signup error:", err);
      this.tracking.track("SignupFailure", err.details);
      for (let e of err.details) {
        console.error(e);
        if (e === "conflict_email") {
          this.toast("Oops! That email is already in use!");
          break;
        } else if (e === "required_password") {
          this.toast("Oops! You need a password!");
          break;
        } else if (e === "required_email") {
          this.toast("Oops! Looks like you forgot to put in an email!");
          break;
        } else if (e === "invalid_email") {
          this.toast("Oops! Invalid email!");
          break;
        } else {
          this.toast("An unknown error occurred. Sorry!");
          break;
        }
      }
    }).catch((e) => {
      console.error(`Signup server error: ${e}`);
      this.tracking.track("SignupError");
      this.toast("A server error occurred. Sorry!");
    });
  }

  private toast(str: string) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
    });
    toast.present();
  }

  public login(email: string, password: string) {
    this.auth.login(this.details.email, this.details.password).then(() => {
      this.toast("Welcome back!");
      this.view = "profile";
      this.details = {};
    }).catch((e) => {
      console.error(`login error: ${e}`);
      this.toast("Error logging in, please try again");
    });
  }

  public logout() {
    this.auth.logout();
    this.details = {};
    this.view = "login";
  }

  public showLogin() {
    this.view = "login";
  }

  public showSignup() {
    this.view = "signup";
  }

  public saveProfile() {
    this.toast("Ok! Saved your profile!");
  }

  public scrollTo(id) {
    let element = document.getElementById(id);
    element.scrollIntoView();
  }

  // private isBrowser() {
  //   if (this.plt.is('core') || this.plt.is('mobileweb')) {
  //     return true;
  //   }
  //   return false;
  // }
}
