import { defineConfig } from "tsup";

const isDev = process.env.NODE_ENV !== "prod";

export default defineConfig({
  entry: [
    "src/scripts/background.js",
    "src/scripts/contentscript.js",
    "src/scripts/contentScriptPortal.js",
    "src/lib/*.cjs",
  ],
  target: "node20",
  format: "iife",
  outDir: isDev ? "extension/dev/dist" : "extension/prod/dist",
  splitting: false,
  minify: isDev ? false : true,
  env: {
    NODE_ENV: isDev ? "dev" : "prod",
  },
});
