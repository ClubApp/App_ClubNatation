var http = require('http');

var myRequester = {};
var DOM;

myRequester.execute = function (options) {
  var str = '';
  var callback = function (response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {

      if (options.treatment.engine == 'dom') {
        if (DOM===undefined){
          DOM = require('./DomParser.js');
        }
        DOM.parse(str, options.treatment.selector, options.treatment.callback);
      }
      else if (options.treatment.engine == 'json') {
        options.treatment.callback(str);
      }
    });
  };
  http.request(options.request, callback).end();
};

exports.execute = myRequester.execute;
