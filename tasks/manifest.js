import { writeFile } from "node:fs/promises";
import { ensureFile } from "fs-extra";
import { getManifest } from "../src/manifest.js";
import { logger, resolvePath } from "./utils.js";

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
