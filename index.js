module.exports = process.env.SAUCELABS_COV ?
  require('./lib-cov/saucelabs') :
  require('./lib/saucelabs');
