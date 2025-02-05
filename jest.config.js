module.exports = {
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 97,
      lines: 97,
      statements: 97,
    },
  },
  testEnvironment: 'node',
  restoreMocks: true,
};
