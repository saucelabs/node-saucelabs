module.exports = process.env.SAUCELABS_COV ?
  require('./lib-cov/Saucelabs') :
  require('./lib/Saucelabs');
