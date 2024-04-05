import {defineConfig, loadEnv, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(),
      splitVendorChunkPlugin(),
      {
        name: 'module-preload',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html) {
          return html
              .replace(/<link rel="modulepreload" crossorigin href="(.*)">/g, '<link rel="preload" as="script" crossorigin href="$1">')
        }
      },
    ],
    build: {
      emptyOutDir: true,
      cssCodeSplit: true,
      assetsDir: "",
      rollupOptions: {
        output: {
          assetFileNames: "[name].[hash].[ext]",
          chunkFileNames: "[name].[hash].js",
          format: "es",
        }
      },
      modulePreload: true,
    },
    base: env.VITE_ASSETS_URL,
  }
})