import Axios from "axios";
import is from "is_js";

class ExtensionUtils {
  IS_BROWSER = typeof chrome !== "undefined" && !!chrome.storage;
  #EXTENSION_ID = this.IS_BROWSER ? chrome.runtime.id : null;

  extensionURL(link) {
    if (this.#EXTENSION_ID) {
      const prefix = is.chrome() ? "chrome-extension://" : "moz-extension://";
      return `${prefix}${this.#EXTENSION_ID}/${link.replace(/^\//, "")}`;
    } else {
      // this fallback is necessary because of the `src/lib`
      return `https://next-extension.captain.sv.ufabcnext.com/static/${link}`;
    }
  }

  chromeURL(url) {
    return this.extensionURL(url);
  }

  fetchChromeURL(url) {
    return Axios.get(this.chromeURL(url));
  }

  injectStyle(link) {
    const styleTag = document.createElement("link");
    styleTag.setAttribute("rel", "stylesheet");
    styleTag.setAttribute("href", chrome.runtime.getURL(link));

    document.head.appendChild(styleTag);
  }

  injectScript(link) {
    const scriptTag = document.createElement("script");
    scriptTag.src = this.extensionURL(link);

    (document.head || document.documentElement).appendChild(scriptTag);
  }

  injectIframe(link) {
    const iframeTag = document.createElement("iframe");
    iframeTag.src = this.extensionURL(link);
    iframeTag.setAttribute("style", "display: none;");
    (document.body || document.documentElement).appendChild(iframeTag);
  }
}

export const extensionUtils = new ExtensionUtils();
