// generate stub index.html files for dev entry
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { watch } from "chokidar";
import { existsSync } from "node:fs";
import { EsmDirname, logger } from "./utils.mjs";

const resolvePath = (...args) => resolve(EsmDirname, "..", ...args);
const PORT = 6000;
const isDev = process.env.NODE_ENV !== "prod";

const ensureDir = async (dir) => {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
};

async function stubHtml() {
  const views = ["Popup"];

  for (const view of views) {
    await ensureDir(resolvePath(`extension/dev/${view}`));
    let data = await readFile(
      resolvePath(`src/views/${view}/index.html`),
      "utf-8"
    );

    data = data
      .replace('"./main.js"', `"http://localhost:${PORT}/${view}/main.js"`)
      .replace(
        '<div id="app"></div>',
        '<div id="app">Vite server did not start</div>'
      );

    await writeFile(
      resolvePath(`extension/dev/${view}/index.html`),
      data,
      "utf-8"
    );
    logger("PRE", `stub ${view}`);
  }
}

function writeManifest() {
  execSync("node ./tasks/manifest.dev.mjs", { stdio: "inherit" });
}

writeManifest();

if (isDev) {
  stubHtml();
  watch(resolvePath("src/**/*.html")).on("change", () => {
    stubHtml();
  });
  watch([resolvePath("src/getManifest.mjs"), resolvePath("package.json")]).on(
    "change",
    () => {
      writeManifest();
    }
  );
}
