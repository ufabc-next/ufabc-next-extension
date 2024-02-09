import { writeFile } from "node:fs/promises";
import { closeSync, existsSync, openSync } from "node:fs";
import { getManifest } from "../src/getManifest.mjs";
import { resolve } from "node:path";
import { EsmDirname } from "./utils.mjs";

const resolvePath = (...args) => resolve(EsmDirname, "..", ...args);
const ensureFile = async (filePath) => {
  closeSync(openSync(filePath, "w"));
};

export async function writeManifest() {
  const manifest = await getManifest();

  const normalizedPath = resolvePath("extension/dev/manifest.json");

  await ensureFile(normalizedPath);
  await writeFile(
    resolvePath("extension/dev/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("PRE", "write manifest.json");
}

writeManifest();
