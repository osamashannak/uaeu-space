import {defineConfig, loadEnv, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(),
      legacy({
        targets: ['defaults', 'not IE 11', 'iOS >= 11'],
      }),
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
    base: mode === 'production' ? env.VITE_ASSETS_URL : '/',
  }
})