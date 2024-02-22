import { extensionUtils } from "@/utils/extensionUtils";

window.xdLocalStorage.init({
  /* required */
  iframeUrl: extensionUtils.extensionURL("pages/iframe.html"),
  //an option function to be called right after the iframe was loaded and ready for action
  initCallback: function () {
    console.log("Got iframe ready");
  },
});
