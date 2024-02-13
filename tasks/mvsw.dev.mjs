import { resolve } from "node:path";
import { cp, rename, rm } from "node:fs/promises";
import { logger } from "./utils.mjs";

(async () => {
  try {
    await cp(resolve("src/assets"), resolve("extension/dev/assets"), {
      recursive: true,
    });
    await cp(resolve("src/styles"), resolve("extension/dev/styles"), {
      recursive: true,
    });
    await cp(resolve("src/pages"), resolve("extension/dev/pages"), {
      recursive: true,
    });
    await cp(resolve("src/lib"), resolve("extension/dev/lib"), {
      recursive: true,
    });
    await rename(
      resolve("extension/dev/dist/lib/init.global.js"),
      resolve("extension/dev/lib/init.js")
    );
    await rename(
      resolve("extension/dev/dist/lib/xdLocalStorage.min.global.js"),
      resolve("extension/dev/lib/xdLocalStorage.min.js")
    );
    await rename(
      resolve(
        "extension/dev/dist/lib/xdLocalStoragePostMessageApi.min.global.js"
      ),
      resolve("extension/dev/lib/xdLocalStoragePostMessageApi.min.js")
    );
    await rename(
      resolve("extension/dev/dist/scripts/background.global.js"),
      resolve("extension/dev/background.js")
    );
    await rename(
      resolve("extension/dev/dist/scripts/contentscript.global.js"),
      resolve("extension/dev/contentscript.js")
    );
    await rename(
      resolve("extension/dev/dist/scripts/contentScriptPortal.global.js"),
      resolve("extension/dev/contentScriptPortal.js")
    );
    await rm(resolve("extension/dev/dist"), { recursive: true });
    logger("BUILD:SW", "Moved service-worker success!");
  } catch (error) {
    console.error("error moving files", error);
  }
})();
