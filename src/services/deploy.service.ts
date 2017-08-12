import { Injectable } from "@angular/core";
import { Deploy } from "@ionic/cloud-angular";
import { ToastController } from "ionic-angular";
import { TrackingService } from "./tracking.service";

@Injectable()
export class DeployService {
  constructor(private deploy: Deploy, private tracking: TrackingService, private toast: ToastController) {}

  checkForNewVersion() {
    console.debug("checking for new app version");
    this.deploy.check().then((snapshotAvailable: boolean) => {
      if (snapshotAvailable) {
        console.info("new version available");
        this.deploy.download().then(() => {
          this.tracking.track("DownloadedNewVersion");
          return this.deploy.extract();
        }).then(() => {
          this.deploy.getMetadata().then((metadata) => {
            let msg: string;
            if (metadata.userMsg) {
              msg = `New version: ${metadata.userMsg}`;
              let reloadToast = this.toast.create({
                message: msg,
                duration: 1000 * 1000,
                position: "bottom",
                showCloseButton: true,
                closeButtonText: "Update",
              });
              reloadToast.onDidDismiss(() => {
                this.deploy.load();
              });
              reloadToast.present();
            }
          });
        });
      } else {
        console.debug("no new version");
      }
    });
  }

  setChannel(channel: string) {
    this.deploy.channel = channel;
  }
}
