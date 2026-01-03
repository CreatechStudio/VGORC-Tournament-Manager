// @ts-nocheck

import react from '@vitejs/plugin-react';
import {loadEnv} from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import {viteSingleFile} from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default ({mode}) => {
  const env = loadEnv(mode, process.cwd(), ['']);

  return {
    plugins: [
        react(),
        viteSingleFile(),
        topLevelAwait()
    ],
    base: '/',
    env: env,
    build: {
      minify: true,
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_debugger: true
        },
        mangle: true
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `http://${env.BACKEND_URL || "localhost:3000"}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/socket': {
          target: `ws://${env.BACKEND_URL || "localhost:3000"}`,
          ws: true,
          rewriteWsOrigin: true,
          rewrite: (path) => path.replace(/^\/socket/, '')
        }
      }
    }
  }
};
