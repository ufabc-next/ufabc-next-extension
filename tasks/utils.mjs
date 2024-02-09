import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const EsmDirname = dirname(fileURLToPath(import.meta.url));
