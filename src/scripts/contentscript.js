import $ from "jquery";
import _ from "lodash";
import Vue from "vue";

// CSS imports
import "element-ui/lib/theme-chalk/index.css";
import "vuetify/dist/vuetify.min.css";

import { ufabcMatricula } from "@/services/UFABCMatricula";
import { NextStorage } from "@/services/NextStorage";
import { setupStorage } from "@/utils/setupStorage";
import { extensionUtils } from "@/utils/extensionUtils";
import Matricula from "./contentscripts/views/Matricula.vue";

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
    (url) => `${currentUrl.hostname}${currentUrl.pathname}` === url,
  );

  // add cross-domain local storage
  extensionUtils.injectScript("dist/lib/xdLocalStorage.min.js");
  extensionUtils.injectIframe("pages/iframe.html");
  extensionUtils.injectScript("dist/lib/init.js");

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
    const container = document.createElement("div");
    container.id = __NAME__;
    const root = document.createElement("div");

    const shadowDOM =
      container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
      container;

    shadowDOM.appendChild(
      extensionUtils.injectStyle("dist/contentScripts/style.css"),
    );
    shadowDOM.appendChild(root);

    container.setAttribute("id", "app");
    $("#meio").prepend(container);
    new Vue({
      el: "#app",
      data: {
        name: "popup-next-extension",
      },
      render: (h) => h(Matricula),
    });

    //inject styles
    // extensionUtils.injectStyle("./style.css");

    // manda as informacoes para o servidor
    ufabcMatricula.sendAlunoData();

    // // load vue app modal
    // const modal = document.createElement("div");
    // modal.setAttribute("id", "modal");
    // modal.setAttribute("data-app", true);
    // document.body.append(modal);

    // // load vue app teacherReview
    // const teacherReview = document.createElement("div");
    // teacherReview.setAttribute("id", "teacherReview");
    // teacherReview.setAttribute("data-app", true);
    // document.body.append(teacherReview);

    // // load vue app review subjects
    // const reviewSubject = document.createElement("div");
    // reviewSubject.setAttribute("id", "review-subject");
    // reviewSubject.setAttribute("data-app", true);
    // document.body.append(reviewSubject);

    // // inject Vue app
    extensionUtils.injectScript("scripts/main.js");
  }, INJECT_CONTENT_DELAY);
}
