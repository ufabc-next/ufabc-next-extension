import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { bgCyan, black } from "kolorist";

export const EsmDirname = dirname(fileURLToPath(import.meta.url));
export const isDev = process.env.NODE_ENV !== "prod";
export const resolvePath = (...args) => resolve(EsmDirname, ...args);

export function logger(name, message) {
  console.log(black(bgCyan(` ${name} `)), message);
}

export const PORT = 5001;
