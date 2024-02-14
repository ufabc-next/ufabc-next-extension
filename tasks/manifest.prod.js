import { ensureFile } from "fs-extra";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getManifest } from "../src/manifest.js";
import { EsmDirname, logger } from "./utils.js";

const resolvePath = (...args) => resolve(EsmDirname, "..", ...args);

export async function writeManifest() {
  const manifest = await getManifest();

  const normalizedPath = resolvePath("extension/prod/manifest.json");

  // TODO: remove fs-extra
  await ensureFile(normalizedPath);
  await writeFile(
    resolvePath("extension/prod/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  logger("PRE", "write manifest.json");
}

writeManifest();
