import { writeFile } from "node:fs/promises";
import { getManifest } from "../src/getManifest.js";

const resolvePath = (...args) => resolve(import.meta.dirname, "..", ...args);

export async function writeManifest() {
  const manifest = await getManifest();
  await writeFile(
    resolvePath("extension/dev/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("PRE", "write manifest.json");
}

writeManifest();
