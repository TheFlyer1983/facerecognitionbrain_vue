import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

const aliases = {
  '~~': fileURLToPath(new URL('.', import.meta.url)),
  '@@': fileURLToPath(new URL('.', import.meta.url)),
  '~': fileURLToPath(new URL('./app', import.meta.url)),
  '@': fileURLToPath(new URL('./app', import.meta.url))
};

export default defineConfig({
  resolve: {
    alias: aliases
  },
  test: {
    globals: true,
    projects: [
      {
        resolve: {
          alias: aliases
        },
        test: {
          globals: true,
          name: 'unit',
          include: ['test/{e2e,unit}/**/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      {
        resolve: {
          alias: aliases
        },
        test: {
          globals: true,
          name: 'server',
          include: ['test/server/**/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        resolve: {
          alias: aliases
        },
        test: {
          globals: true,
          name: 'nuxt',
          include: ['**/**/*.nuxt.{test,spec}.ts'],
          setupFiles: ['test/setup.nuxt.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
              mock: {
                indexedDb: true
              }
            }
          }
        }
      })
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.{vue,ts}', 'server/**/*.{vue,ts}'],
      exclude: ['**/*.d.ts', 'app/**/node_modules/**', 'app/**/dist/**']
    }
  }
});
