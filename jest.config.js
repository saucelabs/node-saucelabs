module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 100,
      lines: 98,
      statements: 98,
    },
  },
  testEnvironment: 'node',
  restoreMocks: true,
};
