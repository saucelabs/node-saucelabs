const esModules = [
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
  // @xhmikosr/downloader and dependencies
  '@xhmikosr/downloader',
  '@xhmikosr/archive-type',
  'file-type',
  'strtok3',
  'peek-readable',
  'token-types',
  '@xhmikosr/decompress',
  '@xhmikosr/decompress-tar',
  'is-stream',
  'filenamify',
  'trim-repeated',
  'escape-string-regexp',
  'filename-reserved-regex',
  'strip-outer',
  'p-event',
  'p-timeout',
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
