/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    define: {
      'process.env': { ...process.env, ...loadEnv(mode, process.cwd()) }
    },
    server: {
      port: 8080
    },
    plugins: [vue(), svgLoader()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      dedupe: ['vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "${path.resolve(
            __dirname,
            './src/styles/main.scss'
          )}";`
        }
      }
    },
    test: {
      globals: true,
      reporters: ['json', 'verbose'],
      outputFile: './tests/test-report.json',
      environment: 'jsdom',
      setupFiles: './tests/setup.js'
    }
  });
};
