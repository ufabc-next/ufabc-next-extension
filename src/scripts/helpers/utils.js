import $ from 'jquery'
import Axios from 'axios'
import is from 'is_js'
import xdLocalStorage from '../lib/xdLocalStorage.min.js'
import _ from 'lodash'

module.exports = new (function (){
  // force initialization of xdLocalStorage
  window.xdLocalStorage.init({ iframeUrl: getExtensionUrl('/pages/iframe.html')})

  const IS_BROWSER = typeof chrome != "undefined" && !!chrome.storage
  const EXTENSION_ID = IS_BROWSER ? chrome.i18n.getMessage("@@extension_id") : null

  var getChromeUrl = function (url) {
    return getExtensionUrl(url);
  };

  var fetchChromeUrl = async function(url, cb) {
    return Axios.get(getChromeUrl(url)) 
  }

  var injectDiv = async function(link, el) {
    let resp = await fetchChromeUrl(link)
    const data = resp.data

    var div = document.createElement('div');
    div.innerHTML = data;

    if(el) {
      let parent = el.parentNode
      parent.insertBefore(div, el.nextSibling)
    } else {
      document.body.appendChild(div)  
    }
  }

  function getBrowser() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    var result = 
        isOpera ? 'opera' :
        isFirefox ? 'firefox' :
        isSafari ? 'safari' :
        isChrome ? 'chrome' :
        isIE ? 'ie' :
        isEdge ? 'edge' :
        isBlink ? 'blink' :
        "Don't know";

    return result
  }

  var injectStyle = function(link) {
    var s = document.createElement("link");
      s.href = getExtensionUrl(link);
      s.type = "text/css";
      s.rel = "stylesheet";
      document.head.appendChild(s); 
  }

  var injectScript = function (link) {
    var s = document.createElement('script');
    s.src = getExtensionUrl(link);

    (document.head || document.documentElement).appendChild(s);
  }

  var injectIframe = function (link) {
    var s = document.createElement('iframe');
      s.src = getExtensionUrl(link);
      s.setAttribute('style', 'display: none;');
      (document.body || document.documentElement).appendChild(s);
  }

  var storage = {
    setItem(key, value) {
      return new Promise((resolve, reject) => {
        try {
          const date = Date.now()
          const event = new CustomEvent("requestStorage", {
            "detail": {
              "method": `setStorage-${key}-${date}`,
              "date": date,
              "key": key,
              "value": value
            }
          })
          document.addEventListener(`setStorage-${key}-${date}`, (evt) => {
            resolve(evt.detail.value)
          })
          document.dispatchEvent(event)
        } catch (err) {
          console.error(err)
        }
      })
    },
    getItem(key) {
      return new Promise((resolve, reject) => {
        try {
          const date = Date.now()
          const event = new CustomEvent("requestStorage", {
            "detail": {
              "method": `getStorage-${key}-${date}`,
              "key": key,
              "date": date
            }
          })
          document.addEventListener(`getStorage-${key}-${date}`, (evt) => {
            resolve(evt.detail.value)
          })
          document.dispatchEvent(event)
        } catch (err) {
          console.error(err)
        }
      })
    }
  }

  function getExtensionUrl(link){
    if(EXTENSION_ID) {
      const prefix = is.chrome() ? 'chrome-extension://' : 'moz-extension://'
      return prefix + EXTENSION_ID + '/' + link.replace(/^\//, '')
    } else {
      return 'https://next-extension.sv.ufabcnext.com/static/' + link.replace(/^\//, '')
    }
  }

  var getFile = async function (link) {
    return (await Axios.get(getChromeUrl(link))).data
  }

  return {
    getChromeUrl: getChromeUrl,
    injectScript: injectScript,
    injectDiv: injectDiv,
    injectIframe: injectIframe,
    injectStyle: injectStyle,
    fetchChromeUrl: fetchChromeUrl,
    getExtensionUrl: getExtensionUrl,
    getFile: getFile,
    storage: storage,
  }
})();