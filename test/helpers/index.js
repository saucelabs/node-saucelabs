var nock  = require('nock');
var slice = Array.prototype.slice;

function extend(obj) {
  slice.call(arguments, 1).forEach(function (props) {
    var prop;
    for (prop in props) {
      obj[prop] = props[prop];
    }
  });
  return obj;
}

function replace(str, values) {
  var name, value;
  for (name in values) {
    value = values[name];
    str = str.replace(new RegExp(':' + name, 'g'), value);
  }
  return str;
}

function Nockle(base, config) {
  if (!(this instanceof Nockle)) {
    return new Nockle(base, config);
  }

  this.base   = base;
  this.config = extend({}, config);
}

Nockle.prototype.api = function (method, api, values) {
  values = extend({}, this.config, values);
  return nock(replace(this.base, values))[method](replace(api, values))
    .reply(200, {});
};

Nockle.prototype.get = function (api, values) {
  return this.api('get', api, values);
};

Nockle.prototype.post = function (api, values) {
  return this.api('post', api, values);
};

Nockle.prototype.put = function (api, values) {
  return this.api('put', api, values);
};

Nockle.prototype.delete = function (api, values) {
  return this.api('delete', api, values);
};

module.exports = function (chai) {
  chai.Nockle = Nockle;
};
