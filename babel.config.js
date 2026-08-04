module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 18,
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
