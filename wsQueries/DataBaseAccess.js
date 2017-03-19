var utils = require('./Utilities.js');
var epreuvesDB = require('./epreuvesDB.js').cst;
var fs = require('fs');


var table = function( path){
  this._path = path+'.json';
  this._content = {};
  this._loaded = false;
};
table.prototype.getData = function(id){
  var obj = this._content[id];
  if (obj!==undefined){
    obj.id = id;
  }
  return obj;
};
table.prototype.getDataWithFilter = function(filter){
  var obj;
  for (var id in this._content){
    console.log('table.prototype.getDataWithFilter '+filter.value+ ' '+this._content[id][filter.prop]);
    if (this._content[id][filter.prop]==filter.value){
      obj = this._content[id];
      break;
    }
  }
  return obj;
};
table.prototype.storeData = function(id, obj){
  //console.log('table.prototype.storeData '+id+' '+JSON.stringify(obj));
  var CurId = obj.id?obj.id:id;
  obj.id = CurId;
  this._content[CurId] = obj;
};
table.prototype.save = function(){
  var data = JSON.stringify(this._content);
  utils.fileAccessor.WriteFile(this._path,data);
  //console.log(' table.prototype.save '+data);
};
table.prototype.load = function(){
  var data = utils.fileAccessor.GetDataSync(this._path);
  this._content = JSON.parse(data);
  this._loaded = true;
};

var DataBasePath = './wsQueries/fileDataBase/';
var Records = new table(DataBasePath+'records');
var users = new table(DataBasePath+'users');
var Competitions = new table(DataBasePath+'events');
var eventsSumUp = new table(DataBasePath+'eventsSumUp');
var obj;
var data = fs.readFileSync(DataBasePath+'epreuves.json','utf8');
obj = JSON.parse(data);
var Epreuves = new epreuvesDB(obj);

var functionSave = function(){
  users.save();
  Records.save();
  Competitions.save();
};
var loaded = false;
var functionLoad = function(){
  if (!loaded){
    users.load();
    Records.load();
    Competitions.load();
    loaded  =true;
  }
};

exports.records = Records;
exports.users = users;
exports.events = Competitions;
exports.eventsSumUp = eventsSumUp;
exports.Epreuves = Epreuves;
exports.save = functionSave;
exports.load = functionLoad;
