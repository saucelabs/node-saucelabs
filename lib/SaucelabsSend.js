var https = require('https');
var querystring = require('querystring');

module.exports = SaucelabsSend;

function SaucelabsSend(params){
  this.options = params;
}

SaucelabsSend.prototype.send = function(req_data, callback){
  
  var self = this;



  var path = req_data.path;
  console.log(path);
  if(req_data.method == 'GET' && req_data.data){
    var path =+ '?' + querystring.stringify(req_data.data);
  }

  var req_options = {
    host: self.options.hostname,
    port: self.options.port,
    path: self.options.base_path + path,
    method: req_data.method
  };

  req_options.headers = req_data.headers || {};

  if(this.options.sub_account){
    
  }else{
    req_options.auth = this.options.username + ':' + this.options.password;
  }
  console.log(req_options);

  var req = https.request(req_options, function(res) {
    res.setEncoding('utf8');
    var response = '';
    res.on('data', function (chunk) {
      response += chunk;
    }).on('end', function(){
      //should get some raw text back here
      if(typeof callback == 'function'){
        console.log('ended');
        callback(null, response);
      }
    }).on('close', function(){
    
    });
  });

  req.on('error', function(e) {
    var response = 'error';
    if(typeof callback == 'function'){
      callback(response);
    }
  });

  if(self.options.method == 'POST'){
    // write data to request body
    //req.write();
  }
  req.end();
}