import { writeFile } from "node:fs/promises";
import { ensureFile } from "fs-extra";
import { getManifest } from "../src/manifest.js";
import { resolve } from "node:path";
import { EsmDirname, logger } from "./utils.js";

const resolvePath = (...args) => resolve(EsmDirname, "..", ...args);

export async function writeManifest() {
  const manifest = await getManifest();

  const normalizedPath = resolvePath("extension/manifest.json");

  // TODO: remove fs-extra
  await ensureFile(normalizedPath);
  await writeFile(
    resolvePath("extension/manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  logger("PRE", "write manifest.json");
}

writeManifest();
