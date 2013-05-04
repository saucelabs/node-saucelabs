var SauceLabs = require('..');

describe('SauceLabs', function () {
  var sauce;

  describe('#constructor', function () {
    it('can be instantiated with `new`', function () {
      sauce = new SauceLabs();
      sauce.should.be.an.instanceof(SauceLabs);
    });
  });
});
