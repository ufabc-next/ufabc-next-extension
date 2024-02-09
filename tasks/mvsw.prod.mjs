import { resolve } from "node:path";
import { cp, rename, rm } from "node:fs/promises";

(async () => {
  try {
    console.log(resolve("src/images"));
    await cp(resolve("src/images"), resolve("extension/prod/assets"), {
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
    await rm(resolve("extension/prod/dist"), { recursive: true });
    console.log("sucessfuly built worker [PROD]");
  } catch (error) {
    console.error("error moving files [PROD]", error);
  }
})();
