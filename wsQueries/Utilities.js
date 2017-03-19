var fs = require('fs');

var Utils = {};

Utils.WriteFile = function (NameFile, content) {
  fs.writeFile(NameFile, content, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

Utils.WriteStringAsDocument = function (NameFile, content) {
  var ToWrite = ' <!DOCTYPE html> <html> <base href="file:///E:/WS/WSJS/" target="_blank"> <body>';
  ToWrite += content;
  ToWrite += '</body></html>';
  fs.writeFile(NameFile, ToWrite, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

Utils.GetData = function (NameFile, callBack) {
 if (fs.existsSync(NameFile)){
   fs.readFile(NameFile, 'utf8',function (err, data) {
     if (err) {
       return console.log(err);
     }
     callBack.callBackYes(data);
   });
 }
 else{
   callBack.callBackNo();
 }
};

Utils.GetDataSync = function (NameFile) {
  return fs.readFileSync(NameFile, 'utf8');
};

Utils.mkDirectory = function (NameDir, callBack) {
 if (!fs.exists(NameDir)){
   fs.mkdir(NameDir, callBack);
 }
};


exports.fileAccessor = Utils;
