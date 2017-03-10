
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
      this.id += input.args[i].toLowerCase();
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
  this.callBack = callBack!==undefined?callBack:this.dumpResult.bind(this);
};

Command.prototype.dumpResult = function(result,err){
   console.log(result);
};

Command.prototype.callBack = function (result) {
  fileContent = this.format(result);
  DB[this.tableName].storeData(this.id,fileContent);
  this.callBack(fileContent);
};


Command.prototype.resfreshDB = function(){
  request.execute(this.httpOptions);
};

Command.prototype.run  = function(callBack){
  DB[this.tableName].getData(this.id, {callBackYes : this.callBack, callBackNo : this.resfreshDB.bind(this)});
};

exports.theClass = Command;
