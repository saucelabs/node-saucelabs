const esModules = [
  // query-string and its dependencies
  'query-string',
  'decode-uri-component',
  'split-on-first',
  'filter-obj',
  // got and dependencies
  'got',
  'p-cancelable',
  '@szmarczak/http-timer',
  'lowercase-keys',
  '@sindresorhus/is',
  'cacheable-request',
  'normalize-url',
  'responselike',
  'cacheable-request',
  'mimic-response',
  'form-data-encoder',
  'cacheable-lookup',
];

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
  transformIgnorePatterns: esModules.length
    ? [`/node_modules/(?!${esModules.join('|')})`]
    : [],
};
