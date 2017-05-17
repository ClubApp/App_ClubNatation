var fs = require('fs');
var path = require('path');

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

 Utils.copyFileSync = function( source, target ) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
};

Utils.copyFolderRecursiveSync = function ( source, target ) {
    var self = this;
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( path.dirname(source),target);
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                self.copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                self.copyFileSync( curSource, targetFolder );
            }
        } );
    }
};


exports.fileAccessor = Utils;
