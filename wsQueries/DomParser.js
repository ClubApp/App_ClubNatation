// Count all of the links from the Node.js build page 
var jsdom = require('jsdom');

var ParseString = function (str, selector, callback) {
  var onDone = function (err, window) {
    var $ = window.jQuery;
    var tab = $(selector).toArray();
    callback(tab);
  }

  jsdom.env({
    html: str,
    scripts: ['http://code.jquery.com/jquery-1.5.min.js'],
    done: onDone
  });
}


exports.parse = ParseString;