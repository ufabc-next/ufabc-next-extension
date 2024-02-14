import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Vue2 from "@vitejs/plugin-vue2";
import Components from "unplugin-vue-components/vite";
import packageJson from "./package.json" with { type: "json" };
import { isDev, PORT, resolvePath } from "./tasks/utils";

/**@type {import('vite').UserConfig;} */
export const sharedViteConfig = {
  root: resolvePath("src"),
  resolve: {
    alias: {
      "@/": `${resolvePath("src")}/`,
    },
  },
  plugins: [
    Vue2(),
    Components({
      dirs: [resolvePath("src/components")],
      dts: false,
    }),
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`,
        );
      },
    },
  ],
  optimizeDeps: {
    include: ["vue", "@vueuse/core"],
  },
  define: {
    __DEV__: isDev,
    __NAME__: JSON.stringify(packageJson.name),
  },
};

export default defineConfig(({ command }) => ({
  ...sharedViteConfig,
  base: command === "serve" ? `http://localhost:${PORT}/` : "/dist/",
  server: {
    port: PORT,
    hmr: {
      host: "localhost",
    },
  },
  build: {
    watch: isDev ? {} : undefined,
    outDir: resolvePath("extension/dist"),
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        popup: resolvePath("src/views/Popup/index.html"),
      },
    },
  },
}));
