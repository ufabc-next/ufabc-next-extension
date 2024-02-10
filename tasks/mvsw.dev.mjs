import { resolve } from "node:path";
import { cp, rename, rm } from "node:fs/promises";
import { logger } from "./utils.mjs";

(async () => {
  try {
    await cp(resolve("src/images"), resolve("extension/dev/assets"), {
      recursive: true,
    });
    await rename(
      resolve("extension/dev/dist/background.global.js"),
      resolve("extension/dev/background.js")
    );
    await rename(
      resolve("extension/dev/dist/contentscript.global.js"),
      resolve("extension/dev/contentscript.js")
    );
    await rm(resolve("extension/dev/dist"), { recursive: true });
    logger("BUILD:SW", "Moved service-worker success!");
  } catch (error) {
    console.error("error moving files", error);
  }
})();
