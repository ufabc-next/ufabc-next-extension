import { writeFile } from "node:fs/promises";
import { ensureFile } from "fs-extra";
import { getManifest } from "../src/manifest.mjs";
import { resolve } from "node:path";
import { EsmDirname, logger } from "./utils.mjs";

const resolvePath = (...args) => resolve(EsmDirname, "..", ...args);

export async function writeManifest() {
  const manifest = await getManifest();

  const normalizedPath = resolvePath("extension/dev/manifest.json");

  // TODO: remove fs-extra
  await ensureFile(normalizedPath);
  await writeFile(
    resolvePath("extension/dev/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  logger("PRE", "write manifest.json");
}

writeManifest();
