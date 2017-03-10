var utils = require('./Utilities.js');


var table = function( path){
  this._path = path;
};
table.prototype.getData = function(id, callBack){
  var file = this._path + id+ '.json';
  utils.fileAccessor.GetData(file,callBack);
};
table.prototype.storeData = function(id, data){
  var file = this._path + id+ '.json';
  utils.fileAccessor.WriteFile(file,data);
};

var DataBasePath = './wsQueries/fileDataBase/';
var Records = new table(DataBasePath+'Records/');
var Clubbers = new table(DataBasePath+'Clubbers/');
var Competitions = new table(DataBasePath+'Competitions/');

exports.Records = Records;
exports.Clubbers = Clubbers;
exports.Competitions = Competitions;
