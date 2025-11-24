import {defineConfig, loadEnv} from 'vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode}) => {
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
    server: {
      proxy: {
        // Proxy for the Professor API
        '/api/professor': {
          target: 'https://professor.api.spaceread.net',
          changeOrigin: true,
          secure: false, // often needed for HTTPS targets
          rewrite: (path) => path.replace(/^\/api\/professor/, ''),
        },

        // Proxy for the Course API
        '/api/course': {
          target: 'https://course.api.spaceread.net',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/course/, ''),
        },
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
              return 'vendor';
            }
          },
          assetFileNames: "assets/[name].[hash].[ext]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
          format: "es",
        }
      },
      modulePreload: true,
    },
    base: mode === 'production' ? `${env.VITE_ASSETS_URL}/${env.VITE_APP_VERSION}/` : '/',
  }
})