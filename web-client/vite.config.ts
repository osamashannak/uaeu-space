import {defineConfig, loadEnv} from 'vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(),
      legacy({
        targets: ['defaults', 'not IE 11', 'iOS >= 11'],
      }),
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
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    build: {
      emptyOutDir: true,
      cssCodeSplit: true,
      assetsDir: "",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react')) {
                return 'vendor-react';
              }
              return 'vendor';
            }
          },
          assetFileNames: "[name].[hash].[ext]",
          chunkFileNames: "[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
          format: "es",
        }
      },
      modulePreload: true,
    },
    base: mode === 'production' ? env.VITE_ASSETS_URL : '/',
  }
})