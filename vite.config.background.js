import { defineConfig } from "vite";
import { sharedViteConfig } from "./vite.config";
import packageJson from "./package.json" with { type: "json" };
import { resolvePath } from "./tasks/utils";

// bundling the service_worker using Vite
export default defineConfig({
  ...sharedViteConfig,
  define: {
    __DEV__: isDev,
    __NAME__: JSON.stringify(packageJson.name),
    // vite need those envs to be json parsable (i dont know why)
    "process.env.NODE_ENV": JSON.stringify(isDev ? "dev" : "prod"),
  },
  build: {
    watch: isDev ? {} : undefined,
    outDir: resolvePath("extension/dist/background"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    lib: {
      entry: resolvePath("src/scripts/background.js"),
      name: packageJson.name,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "background.global.js",
        extend: true,
      },
    },
  },
});
