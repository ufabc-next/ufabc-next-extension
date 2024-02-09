import pkg from "../package.json";

const isDev = process.env.NODE_ENV === "prod";

export async function getManifest() {
  // update this file to update this manifest.json

  const manifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    icons: {
      16: "./images/icon-16.png",
      128: "./images/icon-128.png",
    },
    background: {
      service_worker: "background.js",
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
        js: ["scripts/contentscript.js"],
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
        19: "images/icon-19.png",
        38: "images/icon-38.png",
      },
      default_title: "UFABC Matricula",
      default_popup: "pages/popup.html",
    },
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
    },
    web_accessible_resources: [
      {
        resources: [
          "components/*",
          "images/*",
          "lib/*",
          "pages/*",
          "scripts/*",
          "services/*",
          "styles/*",
          "utils/*",
          "views/*",
          "html/*",
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

  if (isDev) {
    manifest.content_security_policy = {
      extension_pages: `script-src 'self' http://localhost:${8080}; object-src 'self'`,
    };
  }

  return manifest;
}
