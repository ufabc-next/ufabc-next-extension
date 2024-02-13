import { execSync } from "node:child_process";

(function writeManifest() {
  execSync("node ./tasks/manifest.prod.mjs", { stdio: "inherit" });
})();
