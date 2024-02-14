import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import Vue2 from "@vitejs/plugin-vue2";
import Components from "unplugin-vue-components/vite";

const EsmDirname = dirname(fileURLToPath(import.meta.url));

const PORT = 5001;
const resolvePath = (...args) => resolve(EsmDirname, ...args);

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
            `"${relative(dirname(path), "/assets")}/`
          );
        },
      },
    ],
    optimizeDeps: {
      include: ["vue", "@vueuse/core"],
    },
  };
});
