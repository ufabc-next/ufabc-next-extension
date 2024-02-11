import { defineConfig } from "tsup";

const isDev = process.env.NODE_ENV !== "prod";

export default defineConfig({
  entry: ["src/scripts/background.js", "src/scripts/contentscript.js"],
  target: "node20",
  format: "iife",
  outDir: isDev ? "extension/dev/dist" : "extension/prod/dist",
  splitting: false,
});
