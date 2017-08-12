import { Injectable } from "@angular/core";

@Injectable()
export class FullScreen {
  constructor() {}

  fullscreen() {
    // Cast as any because of the functions that may or may not exist on HTMLElement
    let element = document.body as any;
    let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||
      element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    }

    let tabs = document.querySelectorAll(".tabbar");
    let scrollContent = document.querySelectorAll(".scroll-content");
    let header = document.querySelectorAll(".header");

    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = "translateY(56px)";
      });
    }

    if (scrollContent !== null) {
      Object.keys(scrollContent).map((key) => {
        scrollContent[key].style.paddingTop = "0";
        scrollContent[key].style.paddingBottom = "0";
        scrollContent[key].style.marginTop = "0";
        scrollContent[key].style.marginBottom = "0";

        // Scrollbar fixes
        scrollContent[key].style.height = "100%";
        scrollContent[key].style.maxHeight = "100%";
        scrollContent[key].style.overflow = "hidden";

      });
    }

    if (header !== null) {
      Object.keys(header).map((key) => {
        header[key].style.transform = "translateY(-56px)";
      });
    }

    document.addEventListener("webkitfullscreenchange", this.exitFullscreenHandler, false);
    document.addEventListener("mozfullscreenchange", this.exitFullscreenHandler, false);
    document.addEventListener("fullscreenchange", this.exitFullscreenHandler, false);
    document.addEventListener("MSFullscreenChange", this.exitFullscreenHandler, false);

  }

  exitFullscreenHandler() {
    let doc = document as any;
    if (doc.webkitIsFullScreen || doc.mozFullScreen || doc.msFullscreenElement === null) {
      return;
    }

    let tabs = document.querySelectorAll(".tabbar");
    let scrollContent = document.querySelectorAll(".scroll-content");
    let header = document.querySelectorAll(".header");

    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = "translateY(0px)";
      });
    }

    if (scrollContent !== null) {
      Object.keys(scrollContent).map((key) => {
        scrollContent[key].style.marginTop = "56px";
        scrollContent[key].style.marginBottom = "56px";
      });
    }

    if (header !== null) {
      Object.keys(header).map((key) => {
        header[key].style.transform = "translateY(0px)";
      });
    }
  }
}
