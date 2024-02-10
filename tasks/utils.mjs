import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { bgCyan, black } from "kolorist";

export const EsmDirname = dirname(fileURLToPath(import.meta.url));

export function logger(name, message) {
  console.log(black(bgCyan(` ${name} `)), message);
}

export const PORT = 6000;
