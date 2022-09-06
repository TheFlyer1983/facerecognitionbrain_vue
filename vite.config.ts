/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';
import dns from 'dns';

import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/

export default defineConfig({
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
    setupFiles: './tests/setup.js',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'coverage',
        'public/**',
        '**/*{.,-}spec.ts',
        'vite.config.ts',
        'src/*.d.ts',
        'src/main.ts'
      ],
      include: ['src/**/*.ts', 'src/**/*.vue'],
      extension: ['.ts', '.vue']
    }
  }
});
