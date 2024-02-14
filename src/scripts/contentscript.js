import $ from "jquery";
import _ from "lodash";

// CSS imports
import "element-ui/lib/theme-chalk/index.css";
import "vuetify/dist/vuetify.min.css";

import { ufabcMatricula } from "../services/UFABCMatricula";
import { setupStorage } from "../utils/setupStorage";
import { extensionUtils } from "../utils/extensionUtils";
import { NextStorage } from "../services/NextStorage";

const isBrowser = typeof chrome != "undefined" && !!chrome.storage;

/** @type {string[] | null} */
let matriculasURL;

if (process.env.NODE_ENV == "production") {
  matriculasURL = [
    "matricula.ufabc.edu.br/matricula",
    "ufabc-matricula.cdd.naoseiprogramar.com.br/snapshot",
    "api.ufabcnext.com/snapshot",
  ];
} else {
  matriculasURL = [
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
  const INJECT_CONTENT_DELAY = 1_500;
  const currentUrl = new URL(document.location.href);
  const shouldExecuteScript = matriculasURL.some(
    (url) => `${currentUrl.hostname}${currentUrl.pathname}` === url
  );

  // add cross-domain local storage
  extensionUtils.injectScript("lib/xdLocalStorage.min.js");
  extensionUtils.injectIframe("pages/iframe.html");
  extensionUtils.injectScript("lib/init.js");

  setupStorage();
  await import("./contentScriptPortal");

  if (!shouldExecuteScript) {
    return;
  }

  setTimeout(async () => {
    // update teachers locally
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
  }, INJECT_CONTENT_DELAY);
}
