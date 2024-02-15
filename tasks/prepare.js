import { watch } from "chokidar";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { logger, PORT, isDev, resolvePath } from "./utils.js";

const ensureDir = async (dir) => {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
};

async function moveHTMLAssets() {
  await cp(resolve("src/pages"), resolve("extension/dist/pages"), {
    recursive: true,
  });
}

// generate stub index.html files for dev entry
async function stubHtml() {
  const views = ["Popup"];

  for (const view of views) {
    await ensureDir(resolvePath(`extension/dist/views/${view}`));
    let data = await readFile(
      resolvePath(`src/views/${view}/index.html`),
      "utf-8",
    );

    data = data
      .replace(
        '"./main.js"',
        `"http://localhost:${PORT}/views/${view}/main.js"`,
      )
      .replace(
        '<div id="app"></div>',
        '<div id="app">Vite server did not start</div>',
      );

    await writeFile(
      resolvePath(`extension/dist/views/${view}/index.html`),
      data,
      "utf-8",
    );
    logger("PRE", `stub ${view}`);
  }
}

function writeManifest() {
  execSync("node ./tasks/manifest.js", { stdio: "inherit" });
}

writeManifest();
await moveHTMLAssets();

if (isDev) {
  stubHtml();
  watch(resolvePath("src/**/*.html")).on("change", () => {
    stubHtml();
  });
  watch([resolvePath("src/manifest.js"), resolvePath("package.json")]).on(
    "change",
    () => {
      writeManifest();
    },
  );
}
