// CSS imports
import "element-ui/lib/theme-chalk/index.css";

import $ from "jquery";
import _ from "lodash";

import { ufabcMatricula } from "../services/UFABCMatricula";
import { setupStorage } from "../utils/setupStorage";
import { extensionUtils } from "../utils/extensionUtils";
import { NextStorage } from "../services/NextStorage";

const isBrowser = typeof chrome != "undefined" && !!chrome.storage;
let matricula_url;

if (process.env.NODE_ENV == "production") {
  matricula_url = [
    "matricula.ufabc.edu.br/matricula",
    "ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot",
    "api.ufabcnext.com/snapshot",
  ];
} else {
  matricula_url = [
    "matricula.ufabc.edu.br/matricula",
    "api.ufabcnext.com/snapshot",
    "api.ufabcnext.com/snapshot/backup.html",
    "ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot",
    "ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot/backup.html",
    "ufabc-matricula-test.cdd.naoseiprogramar.com.br/snapshot",
    "ufabc-matricula-test.cdd.naoseiprogramar.com.br/snapshot/backup.html",
    "locahost:8011/snapshot",
    "locahost:8011/snapshot/backup.html",
  ];
}

if (!isBrowser) {
  console.log("Not running on browser!");
  load();
} else {
  window.addEventListener("load", load);
}

async function load() {
  const currentUrl = document.location.href;
  // add cross-domain local storage
  extensionUtils.injectScript("lib/xdLocalStorage.min.js");
  extensionUtils.injectIframe("pages/iframe.html");
  extensionUtils.injectScript("lib/init.js");

  setupStorage();
  await import("./contentScriptPortal");

  if (matricula_url.some((url) => currentUrl.indexOf(url) != -1)) {
    // update teachers locally
    setTimeout(async () => {
      let lastUpdate = null;
      try {
        lastUpdate = await NextStorage.getItem("ufabc-extension-last");
      } catch (err) {
        lastUpdate = Date.now();
      } finally {
        ufabcMatricula.updateProfessors(lastUpdate);
      }

      // this is the main vue app
      // i.e, where all the filters live
      const anchor = document.createElement("div");
      anchor.setAttribute("id", "app");
      $("#meio").prepend(anchor);

      //inject styles
      extensionUtils.injectStyle("styles/main.css");

      // manda as informacoes para o servidor
      ufabcMatricula.sendAlunoData();

      // load vue app modal
      const modal = document.createElement("div");
      modal.setAttribute("id", "modal");
      modal.setAttribute("data-app", true);
      document.body.append(modal);

      // load vue app teacherReview
      const teacherReview = document.createElement("div");
      teacherReview.setAttribute("id", "teacherReview");
      teacherReview.setAttribute("data-app", true);
      document.body.append(teacherReview);

      // load vue app review subjects
      const reviewSubject = document.createElement("div");
      reviewSubject.setAttribute("id", "review-subject");
      reviewSubject.setAttribute("data-app", true);
      document.body.append(reviewSubject);

      // inject Vue app
      extensionUtils.injectScript("scripts/main.js");
    }, 1500);
  }
}
