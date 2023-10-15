module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 94,
      functions: 98,
      lines: 97,
      statements: 97,
    },
  },
  testEnvironment: 'node',
  restoreMocks: true,
};
