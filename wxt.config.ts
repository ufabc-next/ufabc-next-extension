import { defineConfig } from "wxt";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
	modules: ["@wxt-dev/module-vue"],
	manifest: {
		permissions: ["storage"],
    // key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlg7ae7OuGQW9cQU3/qbuewZ6DdTjc1yDXtiwdwoOwgF/CByfjX+yf4addlXcxnLjXVBWwSvRj78mv03lLBjkeh63ia4t/BIzzzvciZyZAKEasC5rt0M6+MKVbkKQS9JGGVFsBiBQcQ6kUP8R4cpWX1G9uEhnshdF+u4Nrs7gq9uXIPZ4pf9PhI/IsPyAsv0m5uO4EHhIMtAp8pFyJfECWWSLchlBoGlaaCyf+fT6SYDsWaw53AcwT5jOJfxdQsoGRKGI5UW8V9+Mw+EDdpTpi7f8E5k604EMqZwmzhYLiXcuUqxeXbNZkyTsUNHXTQFcpNUdmisfjiT50kcxVZVc9wIDAQAB",
	},
	vite: () => ({
		plugins: [
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
		],
	}),
  dev: {
    server: {
      port: 3002,
    }
  }
});
