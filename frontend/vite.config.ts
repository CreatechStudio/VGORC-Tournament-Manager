// @ts-nocheck

import react from '@vitejs/plugin-react';
import {loadEnv} from "vite";

// https://vitejs.dev/config/
export default ({mode}) => {
  const env = loadEnv(mode, process.cwd(), ['']);

  return {
    plugins: [react()],
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
          target: `http://${env.BACKEND_URL}` || "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/socket': {
          target: `ws://${env.TM_BACKEND_URL}`,
          ws: true,
          rewriteWsOrigin: true,
          rewrite: (path) => path.replace(/^\/socket/, '')
        }
      }
    }
  }
};
