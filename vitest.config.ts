import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['**/**/*.nuxt.{test,spec}.ts'],
          environment: 'viteEnvironment'
        }
      })
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/**.{vue,ts}', 'server/**/**.{vue,ts}'],
      exclude: ['app/**/node_modules/**', 'app/**/dist/**'],
      extensions: ['.ts', '.vue']
    },
    environmentOptions: {
      nuxt: {
        mock: {
          indexedDb: true
        }
      }
    }
  }
});
