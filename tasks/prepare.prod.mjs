import { execSync } from "node:child_process";

(function writeManifest() {
  execSync("node ./tasks/manifest.dev.mjs", { stdio: "inherit" });
})();
