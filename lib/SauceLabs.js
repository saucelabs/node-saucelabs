var crypto      = require('crypto');
var https       = require('https');
var querystring = require('querystring');
var utils       = require('./utils');
var HttpsProxyAgent = require('https-proxy-agent');
var url = require('url');



var extend  = utils.extend;
var replace = utils.replace;

var DEFAULTS = {
  username:  null,
  password:  null,
  proxy: null,
  hostname:  'saucelabs.com',
  base:      '/rest/v1/',
  port:      '443',
  requestLog: null
};

function SauceLabs(options, headers) {
  this.options = extend({}, DEFAULTS, options);
  this.options.auth = this.options.username + ':' + this.options.password;
  this.headers = extend({}, headers);
}

module.exports = SauceLabs;

// API

SauceLabs.prototype.getAccountDetails = function (callback) {
  this.send({
    method: 'GET',
    path: 'users/:username'
  }, callback);
};

SauceLabs.prototype.getAccountLimits = function (callback) {
  this.send({
    method: 'GET',
    path: ':username/limits'
  }, callback);
};

SauceLabs.prototype.getUserActivity = function (start, end, callback) {
  if (typeof start === 'function') {
    callback = start;
    start    = null;
    end      = null;
  } else if (typeof end === 'function') {
    callback = end;
    end      = null;
  }

  var dates = (start != null || end != null) ? {} : null;
  if (start != null) {
    dates.start = formatDate(start);
  }
  if (end != null) {
    dates.end = formatDate(end);
  }

  this.send({
    method: 'GET',
    path: ':username/activity',
    query: dates
  }, callback);
};

SauceLabs.prototype.getAccountUsage = function (callback) {
  this.send({
    method: 'GET',
    path: 'users/:username/usage'
  }, callback);
};

SauceLabs.prototype.getJobs = function (callback) {
  this.send({
    method: 'GET',
    path: ':username/jobs',
    query: { full: true }
  }, callback);
};

SauceLabs.prototype.showJob = function (id, callback) {
  this.send({
    method: 'GET',
    path: ':username/jobs/:id',
    args: { id: id }
  }, callback);
};

SauceLabs.prototype.showJobAssets = function (id, callback) {
  this.send({
    method: 'GET',
    path: ':username/jobs/:id/assets',
    args: { id: id }
  }, callback);
};

SauceLabs.prototype.updateJob = function (id, data, callback) {
  this.send({
    method: 'PUT',
    path: ':username/jobs/:id',
    args: { id: id },
    data: data
  }, callback);
};

SauceLabs.prototype.stopJob = function (id, data, callback) {
  this.send({
    method: 'PUT',
    path: ':username/jobs/:id/stop',
    args: { id: id },
    data: data
  }, callback);
};

SauceLabs.prototype.getActiveTunnels = function (callback) {
  this.send({
    method: 'GET',
    path: ':username/tunnels'
  }, callback);
};

SauceLabs.prototype.getTunnel = function (id, callback){
  this.send({
    method: 'GET',
    path: ':username/tunnels/:id',
    args: { id: id }
  }, callback);
};

SauceLabs.prototype.deleteTunnel = function (id, callback){
  this.send({
    method: 'DELETE',
    path: ':username/tunnels/:id',
    args: { id: id }
  }, callback);
};

SauceLabs.prototype.getServiceStatus = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/status'
  }, callback);
};

SauceLabs.prototype.getBrowsers = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/browsers'
  }, callback);
};

SauceLabs.prototype.getAllBrowsers = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/browsers/all'
  }, callback);
};

SauceLabs.prototype.getSeleniumBrowsers = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/browsers/selenium-rc'
  }, callback);
};

SauceLabs.prototype.getWebDriverBrowsers = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/browsers/webdriver'
  }, callback);
};

SauceLabs.prototype.getTestCounter = function (callback) {
  this.send({
    method: 'GET',
    path: 'info/counter'
  }, callback);
};

SauceLabs.prototype.updateSubAccount = function (data, callback) {
  this.send({
    method: 'POST',
    path: 'users/:username/subscription',
    data: data
  }, callback);
};

SauceLabs.prototype.deleteSubAccount = function (callback) {
  this.send({
    method: 'DELETE',
    path: 'users/:username/subscription'
  }, callback);
};

SauceLabs.prototype.createSubAccount = function (data, callback) {
  this.send({
    method: 'POST',
    path: 'users/:username',
    data: data
  }, callback);
};

SauceLabs.prototype.createPublicLink = function (id, date, useHour, callback) {
  if (typeof date === 'function') {
    callback = date;
    date     = null;
    useHour  = false;
  } else if (typeof useHour === 'function') {
    callback = useHour;
    useHour  = false;
  }

  if (date != null) {
    date = formatDate(date, useHour);
  }

  var link = generateLink(this.options.hostname, this.options.auth, date, id);
  callback(null, link);
};

SauceLabs.prototype.uploadFile = function (filename, data, overwrite, callback) {
  this.send({
      method: 'POST',
      path: 'storage/:username/:filename',
      args: {filename: filename},
      query: {overwrite: overwrite},
      data: data
    }, callback);
};

SauceLabs.prototype.getStoredFiles = function (callback) {
  this.send({
    method: 'GET',
    path: 'storage/:username'
  }, callback);
};

SauceLabs.prototype.send = function (message, callback) {
  var method  = message.method,
      path    = message.path,
      args    = message.args,
      query   = message.query,
      data    = message.data,
      body    = Buffer.isBuffer(data) ? data: JSON.stringify(data);

  // Build path with base, placeholders, and query.
  path = this.options.base + replace(path, extend({}, this.options, args));
  if (query != null) {
    path += '?' + querystring.stringify(query);
  }

  // Make the request.
  var options = extend({}, this.options, {
    method: method,
    path:   path,

    headers: extend({
      'Accept':         'application/json',
      'Content-Type':   Buffer.isBuffer(data) ? 'application-octetstream' : 'application/json',
      'Content-Length': body != null ? body.length : 0
    }, this.headers)
  });
  makeRequest(options, body, callback);
};

// Helpers

function formatDate(date, useHour) {
  return date.toISOString().replace(/T(\d+).*/, (useHour ? '-$1' : ''));
}

function generateToken(auth, date, job) {
  var key = auth + (date ? ':' + date : '');
  return crypto
    .createHmac('md5', key)
    .update(job)
    .digest('hex');
}

function generateLink(hostname, auth, date, job) {
  return replace('https://:hostname/jobs/:id?auth=:token', {
    hostname: hostname,
    id:       job,
    token:    generateToken(auth, date, job)
  });
}

function makeRequest(options, body, callback) {
    if(options.proxy){
        options.agent = new HttpsProxyAgent(url.parse(options.proxy));
    }
    var request = https.request(options, function (response) {
    var result = '';
    response
      .on('data', function (chunk) {
        result += chunk;
      })
      .on('end', function () {
        var res;

        try {
          res = JSON.parse(result);
        } catch (e) {

          var err = 'Could not parse response: ' + result;
          if(typeof options.requestLog === 'function') {
            options.requestLog(err, request);
          }
          callback(err);
          return;
        }

        if(typeof options.requestLog === 'function') {
          options.requestLog(null, request);
        }

        if (response.statusCode === 200) {
          callback(null, res);
        } else {
          callback(res);
        }
      });
  });

  request
    .on('error', function (err) {
      callback('Could not send request: ' + err.message);
    });

  if (body != null) {
    request.write(body);
  }

  request.end();
}
