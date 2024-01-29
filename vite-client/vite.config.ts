import {defineConfig, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(),
      // plugin that replaces script tag to link tag with preload attribute
      {
        name: 'module-preload',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html) {
          return html
              .replace(/<script type="module" crossorigin src="(.*)"><\/script>/g, '<link rel="preload" as="script" crossorigin href="$1">')
              .replace(/<link rel="modulepreload" crossorigin href="(.*)">/g, '<link rel="preload" as="script" crossorigin href="$1">')
        }
      }
  ],
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsDir: "",
    rollupOptions: {
      output:{
        assetFileNames: "[name].[hash].[ext]",
        chunkFileNames: "[name].[hash].js",
        format: "es",
      }
    },
    modulePreload: true,
  },
  base: "https://static.spaceread.net",
})
