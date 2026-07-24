const js = require('@eslint/js');
const importX = require('eslint-plugin-import-x');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/*.mustache',
      '**/*.snap',
      'build/**',
      '.husky/**',
      '**/*.html',
      'coverage/**',
      '.vscode/**',
      '**/dist/**',
    ],
  },
  js.configs.recommended,
  importX.flatConfigs.errors,
  importX.flatConfigs.warnings,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2015,
      },
    },
    rules: {
      'import-x/no-unresolved': [2, {commonjs: true, amd: true}],
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  prettierConfig,
];
