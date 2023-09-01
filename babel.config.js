module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 14,
        },
        shippedProposals: true,
      },
    ],
  ],
  env: {
    development: {
      sourceMaps: 'inline',
      plugins: ['source-map-support'],
    },
  },
};
