import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('.', import.meta.url)),
      '@@': fileURLToPath(new URL('.', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url))
    }
  },
  test: {
    globals: true,
    projects: [
      {
        test: {
          globals: true,
          name: 'unit',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          globals: true,
          name: 'nuxt',
          include: ['**/**/*.nuxt.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            rootDir: fileURLToPath(new URL('.', import.meta.url)),
            domEnvironment: 'happy-dom',
            mock: {
              indexedDb: true
            }
          }
        }
      })
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/**.{vue,ts}', 'server/**/**.{vue,ts}'],
      exclude: ['app/**/node_modules/**', 'app/**/dist/**']
    }
  }
});
