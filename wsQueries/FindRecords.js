var Command = require('./Command.js');

var createCmd = function(args,callBack){
  var http_options = {
      request: {
        host: 'ffn.extranat.fr',
        path: '/webffn/nat_recherche.php?idact=mtr&idrch_id='
      },
      treatment: {
        engine: 'dom',
        selector: '.nat-temps'
      }
  };

  var FindRecords = new Command.theClass({nbArgs : 1, args : args, addToPath : true}, 'Records', http_options,callBack);

  FindRecords.format = function (domElements) {
    var i = 0;
    var objResult = [];
    var objBassin, objRecord;
    var tabFields= ['time', '', 'age', 'place', 'date'];
    var length = domElements.length;
    for (i = 0; i < length; i++) {
      var temp ='';
      var Elem = domElements[i].previousElementSibling;
      var theParent = Elem.parentNode;
      var previousParent = theParent.previousElementSibling;
      if (previousParent.attributes.length === 0) {
        objBassin={};
        objResult.objBassin=objBassin;
        objBassin.records=[];
        temp = previousParent.previousElementSibling.textContent;
        temp = temp.indexOf('50');
        if (temp>-1){
          objBassin.bassin='50 m'; }
        else{
          objBassin.bassin='25 m'; }
      }
      objRecord = {};
      objResult.push(objRecord);
      objRecord.epr = Elem.textContent;
      for (var j = 0; j < 5; j++) {
        Elem = Elem.nextElementSibling;
        if (j==1){continue;}
        objRecord[tabFields[j]]=Elem.textContent.replace(/[\t\n]*/g, '');
      }
    }
    return JSON.stringify(objResult);
  };
  return FindRecords;
};

exports.instanciate = createCmd;
