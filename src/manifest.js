import pkg from "../package.json" with { type: "json" };
import { isDev, PORT } from "../tasks/utils.js";

export async function getManifest() {
  // update this file to update this manifest.json

  const manifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    icons: {
      16: "assets/icon-16.png",
      128: "assets/icon-128.png",
    },
    background: {
      service_worker: "dist/background/background.mjs",
    },
    permissions: ["storage"],
    host_permissions: [
      "http://*.ufabc.edu.br/*",
      "https://*.ufabc.edu.br/*",
      "http://localhost:8000/*",
      "http://*.ufabcnext.com/*",
      "https://*.ufabcnext.com/*",
    ],
    content_scripts: [
      {
        all_frames: true,
        js: ["dist/contentScripts/contentscript.global.js"],
        matches: [
          "http://*.ufabc.edu.br/*",
          "https://*.ufabc.edu.br/*",
          "http://localhost:8000/*",
          "http://*.ufabcnext.com/*",
          "https://*.ufabcnext.com/*",
        ],
        run_at: "document_end",
      },
    ],
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlg7ae7OuGQW9cQU3/qbuewZ6DdTjc1yDXtiwdwoOwgF/CByfjX+yf4addlXcxnLjXVBWwSvRj78mv03lLBjkeh63ia4t/BIzzzvciZyZAKEasC5rt0M6+MKVbkKQS9JGGVFsBiBQcQ6kUP8R4cpWX1G9uEhnshdF+u4Nrs7gq9uXIPZ4pf9PhI/IsPyAsv0m5uO4EHhIMtAp8pFyJfECWWSLchlBoGlaaCyf+fT6SYDsWaw53AcwT5jOJfxdQsoGRKGI5UW8V9+Mw+EDdpTpi7f8E5k604EMqZwmzhYLiXcuUqxeXbNZkyTsUNHXTQFcpNUdmisfjiT50kcxVZVc9wIDAQAB",
    externally_connectable: {
      matches: [
        "http://*.ufabc.edu.br/*",
        "https://*.ufabc.edu.br/*",
        "http://localhost:8000/*",
        "http://*.ufabcnext.com/*",
        "https://*.ufabcnext.com/*",
      ],
    },
    action: {
      default_icon: {
        19: "assets/icon-19.png",
        38: "assets/icon-38.png",
      },
      default_title: "Next Extension",
      default_popup: "dist/views/Popup/index.html",
    },
    content_security_policy: {
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${PORT}; object-src 'self'`
        : "script-src 'self'; object-src 'self'",
    },
    web_accessible_resources: [
      {
        resources: [
          "assets/*",
          "pages/*",
          "dist/contentScripts/style.css",
          "dist/lib/*",
        ],
        matches: [
          "http://*.ufabc.edu.br/*",
          "https://*.ufabc.edu.br/*",
          "http://localhost:8000/*",
          "http://*.ufabcnext.com/*",
          "https://*.ufabcnext.com/*",
        ],
      },
    ],
  };

  return manifest;
}
