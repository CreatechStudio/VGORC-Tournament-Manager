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
        obfuscatorPlugin({
          apply: "build",
          options: {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: 4000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 5,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['rc4'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 5,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 5,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 1,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
          }
        }),
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
          target: `ws://${env.BACKEND_URL}`,
          ws: true,
          rewriteWsOrigin: true,
          rewrite: (path) => path.replace(/^\/socket/, '')
        }
      }
    }
  }
};
