module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.vue$': 'vite-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    // '^.+\\.(svg|css|styl|less|sass|png|jpg|ttf|woff|woff2)$':
    //   './tests/utils/svgTransform.js'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)'
  ],
  resetModules: true,
  collectCoverageFrom: ['src/**/*.(ts|vue)'],
  coveragePathIgnorePatterns: [
    '/node_modules.',
    '\\.d.ts',
    '\\.spec.ts',
    'index.ts',
    'main.ts'
  ],
  testEnvironment: 'jest-environment-jsdom'
};
