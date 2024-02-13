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
      resolve("extension/prod/dist/background.global.js"),
      resolve("extension/prod/background.js")
    );
    await rename(
      resolve("extension/prod/dist/contentscript.global.js"),
      resolve("extension/prod/contentscript.js")
    );
    await rename(
      resolve("extension/prod/dist/contentScriptPortal.global.js"),
      resolve("extension/prod/contentScriptPortal.js")
    );
    await rm(resolve("extension/prod/dist"), { recursive: true });
    logger("sucessfuly built worker [PROD]");
  } catch (error) {
    console.error("error moving files [PROD]", error);
  }
})();
