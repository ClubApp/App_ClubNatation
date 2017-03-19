
var request = require('./DoRequest.js');
var DB = require('./DataBaseAccess.js');

var Command = function (input, tableName, httpOptions, callBack){
  nbArgs = input.nbArgs;
  if ((nbArgs!==0)&&(nbArgs!==undefined)){
    if (input.args.length < nbArgs) {
      console.error("type args");
    }
    var i=0, length = input.args.length;
    this.id = '';
    for (i = 0; i < length; i++){
      if (i>0){
        this.id +='%20';
      }
      var toAdd = input.args[i];
      if (toAdd.toLowerCase!==undefined)
         toAdd= toAdd.toLowerCase();
      this.id += toAdd;
    }
  }
  else{
    this.id = input.id;
  }
  this.httpOptions = httpOptions;
  this.httpOptions.treatment.callback = this.callBack.bind(this);
  if (input.addToPath){
    this.httpOptions.request.path+=this.id;
  }
  this.tableName = tableName;
  this.callBackResult = callBack!==undefined?callBack:this.dumpResult.bind(this);
};

Command.prototype.dumpResult = function(object,err){
   console.log(JSON.stringify(object));
};

Command.prototype.callBack = function (result) {

  fileContent = this.format(result);

  var obj = {};
  if (fileContent!==''){
    obj = JSON.parse(fileContent);
    DB[this.tableName].storeData(obj.id?obj.id:this.id,obj);
  }
  this.callBackResult(obj);
};


Command.prototype.resfreshDB = function(){
  request.execute(this.httpOptions);
};

Command.prototype.run  = function(callBack){
  var object = DB[this.tableName].getData(this.id);
  if (object === undefined){
    this.resfreshDB();
  }
  else {
    this.callBackResult(object);
  }
};

exports.theClass = Command;
