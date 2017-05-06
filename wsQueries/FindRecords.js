var Command = require('./Command.js');
var DB = require('./DataBaseAccess.js');
var nages = require('./Constants.js');
//_getdata.php?idact=mtr&idtrt=prf&idiuf=1649902&idbas=25&idepr=52 = epr:cr, bas=bassin
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
  var sortedArgs = [args[0]];
  var FindRecords = new Command.theClass({nbArgs : 1, args : sortedArgs, addToPath : true}, 'records', http_options,callBack);
  FindRecords.genre = args[1];
  FindRecords.idUser = parseInt(args[0]);

  FindRecords.format = function (domElements) {
    var i = 0, j=0, k= 0;
    var objResult, objRecord;
    objResult={};
    objResult.records=[];
    var tabFields= ['temps', '', 'age', 'lieu', 'date'];
    var length = domElements.length;
    var thebassin;
    for (i = 0; i < length; i++) {
      var filter = [];
      DB.Epreuves.addFilter(filter, 'genres', 'name',this.genre);
      var temp ='';
      var Elem = domElements[i].previousElementSibling;
      var theParent = Elem.parentNode;
      var previousParent = theParent.previousElementSibling;
      if (previousParent.attributes.length === 0) {
        objResult.idUser = FindRecords.idUser;
        temp = previousParent.previousElementSibling.textContent;
        temp = temp.indexOf('50');
        if (temp>-1){
          thebassin=50; }
        else{
          thebassin=25; }
      }
      //console.log('FindRecords.format bassin '+thebassin);
      DB.Epreuves.addFilter(filter, 'bassins', 'name',thebassin);
      objRecord = {};

      var NomNage = Elem.textContent;
      //console.log('FindRecords.format nom nage '+NomNage);
      for (j=0;j<nages.NagesDetail.length;j++){
        if (NomNage.indexOf('Relai')>-1){
          continue;
        }
        if (NomNage.indexOf(nages.NagesDetail[j])>-1){
          //console.log('FindRecords.format nom nage '+nages.Nages[j]);
          DB.Epreuves.addFilter(filter, 'nages', 'name', nages.Nages[j]);
          var tab = nages.EprByNage[nages.Nages[j]];
          for (k=0;k<tab.length;k++){
            if (NomNage.indexOf(tab[k])>-1){
              DB.Epreuves.addFilter(filter, 'distances', 'distance',tab[k]);
              //console.log('FindRecords.format distance '+tab[k]);
              break;
            }
          }
          break;
        }
      }
      //console.log('FindRecords.format '+JSON.stringify(filter));
      objRecord.epreuve = DB.Epreuves.computeEpreuveId(filter);
      //console.log('FindRecords.format '+objRecord.epreuve);
      for (j = 0; j < 5; j++) {
        Elem = Elem.nextElementSibling;
        var value = Elem.textContent;
        if (j==1){continue;}
        if (j==2)//age
           value = value.replace(/[()]*/g, '');
        value=value.replace(/[\t\n]*/g, '');
        if (j===4){
          var splitValues = value.split('/');
          value = 10000*parseInt(splitValues[2])+100*parseInt(splitValues[1])+parseInt(splitValues[0]);
          objRecord[tabFields[j]] =value;
        }
        else
          objRecord[tabFields[j]] = unescape(value);
      }
      //console.log('FindRecords.format push record '+JSON.stringify(objRecord));
      objResult.records.push(objRecord);
    }
    return JSON.stringify(objResult);
  };
  return FindRecords;
};

exports.instanciate = createCmd;
