import { resolve } from "node:path";
import { cp, rename, rm } from "node:fs/promises";
import { logger } from "./utils.mjs";

(async () => {
  try {
    await cp(resolve("src/assets"), resolve("extension/prod/assets"), {
      recursive: true,
    });
    await cp(resolve("src/styles"), resolve("extension/prod/styles"), {
      recursive: true,
    });
    await cp(resolve("src/pages"), resolve("extension/prod/pages"), {
      recursive: true,
    });
    await cp(resolve("src/lib"), resolve("extension/prod/lib"), {
      recursive: true,
    });
    await rename(
      resolve("extension/prod/dist/lib/init.global.js"),
      resolve("extension/prod/lib/init.js")
    );
    await rename(
      resolve("extension/prod/dist/lib/xdLocalStorage.min.global.js"),
      resolve("extension/prod/lib/xdLocalStorage.min.js")
    );
    await rename(
      resolve(
        "extension/prod/dist/lib/xdLocalStoragePostMessageApi.min.global.js"
      ),
      resolve("extension/prod/lib/xdLocalStoragePostMessageApi.min.js")
    );
    await rename(
      resolve("extension/prod/dist/scripts/background.global.js"),
      resolve("extension/prod/background.js")
    );
    await rename(
      resolve("extension/prod/dist/scripts/contentscript.global.js"),
      resolve("extension/prod/contentscript.js")
    );
    await rename(
      resolve("extension/prod/dist/scripts/contentScriptPortal.global.js"),
      resolve("extension/prod/contentScriptPortal.js")
    );
    await rm(resolve("extension/prod/dist"), { recursive: true });
    logger("BUILD:PROD", "Builded extension successfully!");
  } catch (error) {
    console.error("error moving files [PROD]", error);
  }
})();
