import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Vue2 from "@vitejs/plugin-vue2";

const EsmDirname = dirname(fileURLToPath(import.meta.url));

const PORT = 6000;
const resolvePath = (...args) => resolve(EsmDirname, ...args);

console.log(resolvePath("views/Popup/index.html"));

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    root: resolvePath("src"),
    base: isDev ? `http://localhost:${PORT}/` : undefined,
    resolve: {
      alias: {
        "@/": `${resolvePath("src")}/`,
      },
    },
    server: {
      port: PORT,
      hmr: {
        host: "localhost",
      },
    },
    build: {
      outDir: resolvePath("extension/prod"),
      emptyOutDir: false,
      sourcemap: isDev ? "inline" : false,
      rollupOptions: {
        input: {
          popup: resolvePath("src/views/Popup/index.html"),
        },
      },
    },
    plugins: [
      Vue2(),
      {
        name: "assets-rewrite",
        enforce: "post",
        apply: "build",
        transformIndexHtml(html) {
          return html.replace(/"\/assets\//g, '"../images/');
        },
      },
    ],
    optimizeDeps: {
      include: ["vue", "@vueuse/core"],
    },
  };
});
