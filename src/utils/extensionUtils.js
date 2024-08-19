import $ from 'jquery';
import Axios from 'axios';
import is from 'is_js';
import _ from 'lodash';

export default new ExtensionUtils();

function ExtensionUtils() {
  // force initialization of xdLocalStorage
  // window.xdLocalStorage.init({
  //   iframeUrl: getExtensionUrl("pages/iframe.html"),
  // });

  const IS_BROWSER = typeof chrome != 'undefined' && !!chrome.storage;
  const EXTENSION_ID = IS_BROWSER
    ? chrome.i18n.getMessage('@@extension_id')
    : null;

  var getChromeUrl = (url) => getExtensionUrl(url);

  var fetchChromeUrl = async (url, cb) => Axios.get(getChromeUrl(url));

  var injectDiv = async (link, el) => {
    const resp = await fetchChromeUrl(link);
    const data = resp.data;

    var div = document.createElement('div');
    div.innerHTML = data;

    if (el) {
      const parent = el.parentNode;
      parent.insertBefore(div, el.nextSibling);
    } else {
      document.body.appendChild(div);
    }
  };

  var injectStyle = (link) => {
    var s = document.createElement('link');
    s.href = getExtensionUrl(link);
    s.type = 'text/css';
    s.rel = 'stylesheet';

    document.head.appendChild(s);
  };

  var injectScript = (link) => {
    var s = document.createElement('script');
    s.src = getExtensionUrl(link);

    (document.head || document.documentElement).appendChild(s);
  };

  var injectIframe = (link) => {
    var s = document.createElement('iframe');
    s.src = getExtensionUrl(link);
    s.setAttribute('style', 'display: none;');
    (document.body || document.documentElement).appendChild(s);
  };

  var storage = {
    setItem(key, value) {
      return new Promise((resolve, reject) => {
        try {
          const date = Date.now();
          const event = new CustomEvent('requestStorage', {
            detail: {
              method: `setStorage-${key}-${date}`,
              date: date,
              key: key,
              value: value,
            },
          });
          document.addEventListener(`setStorage-${key}-${date}`, (evt) => {
            resolve(evt.detail.value);
          });
          document.dispatchEvent(event);
        } catch (err) {
          console.error(err);
        }
      });
    },
    getItem(key) {
      return new Promise((resolve, reject) => {
        try {
          const date = Date.now();
          const event = new CustomEvent('requestStorage', {
            detail: {
              method: `getStorage-${key}-${date}`,
              key: key,
              date: date,
            },
          });
          document.addEventListener(`getStorage-${key}-${date}`, (evt) => {
            resolve(evt.detail.value);
          });
          document.dispatchEvent(event);
        } catch (err) {
          console.error(err);
        }
      });
    },
  };

  function getExtensionUrl(link) {
    if (EXTENSION_ID) {
      const prefix = is.chrome() ? 'chrome-extension://' : 'moz-extension://';
      return prefix + EXTENSION_ID + '/' + link.replace(/^\//, '');
    } else {
      return `https://next-extension.captain.sv.ufabcnext.com/static/${link}`;
    }
  }

  var getFile = async (link) => (await Axios.get(getChromeUrl(link))).data;

  return {
    getChromeUrl,
    injectScript,
    injectDiv,
    injectIframe,
    injectStyle,
    fetchChromeUrl,
    getExtensionUrl,
    getFile,
    storage,
  };
}
