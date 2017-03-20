var utils = require('./Utilities.js');
var DB = require('./DataBaseAccess.js');

var callBack = {};
callBack.callBackNo = function(){
  console.log('no file');
};
callBack.callBackYes = function(data){
  console.log(data);
  var obj = JSON.parse(data);
  var length = obj.length;
  var currentReq = 0;
  var cmdName = 'FindUser';
  var module = './'+cmdName+'.js';
  var cmdProto = require(module);
  var localCallBack = function(result, error){
    if (currentReq<length){
      var args = [obj[currentReq].nom,obj[currentReq].prenom, obj[currentReq].genre];
      currentReq++;
      var cmd = cmdProto.instanciate(args,localCallBack);
      cmd.run();
    }
    else {
      DB.users.save();
    }
  };
  localCallBack();
};

//utils.fileAccessor.GetData('./wsQueries/fileDataBase/ListUsers.json', callBack);

var updateEventsSumUp = function(){
  var cmdName = 'FindCompetitions';
  var module = './'+cmdName+'.js';
  var cmdProto = require(module);
  var localCallBack = function(result, error){
      DB.eventsSumUp.save();
  };
  var cmd = cmdProto.instanciate([],localCallBack );
  cmd.run();
};
//updateEventsSumUp();


var callBack2 = {};
callBack2.callBackNo = function(){
  console.log('no file');
};
callBack2.callBackYes = function(data){
  var obj = JSON.parse(data).sumup;
  var i = 0, length = obj.length;
  var cmdName = 'FindCompetition';
  var module = './'+cmdName+'.js';
  var cmdProto = require(module);
  var currentReq = 0;
  var localCallBack = function(result, error){
    if (currentReq<length){
      console.log('updateDataBase treating '+obj[currentReq].id);
      var args = [obj[currentReq++].id];
      var cmd = cmdProto.instanciate(args,localCallBack);
      cmd.run();
    }
    else {
      DB.events.save();
    }
  };
  localCallBack();
};

utils.fileAccessor.GetData('./wsQueries/fileDataBase/eventsSumUp.json', callBack2);

var callBack3 = {};
callBack3.callBackNo = function(){
  console.log('no file');
};
callBack3.callBackYes = function(data){
  var localObj = JSON.parse(data);
  var obj = [];

  for(var truc in localObj){
    obj.push({id : truc, genre: localObj[truc].genre});
    console.log(truc);
  }
  var i = 0, length = obj.length;
  var cmdName = 'FindRecords';
  var module = './'+cmdName+'.js';
  var cmdProto = require(module);
  var currentReq = 0;
  var localCallBack = function(result, error){
    if (currentReq<length){
      console.log('updateDataBase treating '+obj[currentReq].id);
      var args = [obj[currentReq].id,obj[currentReq].genre];
      currentReq++;
      var cmd = cmdProto.instanciate(args,localCallBack);
      cmd.run();
    }
    else {
      DB.records.save();
    }
  };
  localCallBack();
};

//utils.fileAccessor.GetData('./wsQueries/fileDataBase/users.json', callBack3);
