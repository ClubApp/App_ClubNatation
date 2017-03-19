var DB = require('./DataBaseAccess.js');

function initializeIUF(session, callBack){
  if(session.iuf === undefined){
    var user = DB.users.getDataWithFilter({prop:"nom", value:session.name});
    session.iuf = user.id;
    session.genre = user.genre;
  }
}

function entryPoint(session, msgstr, websocket){
  DB.load();
  initializeIUF(session);
  console.log('wsQueriesEntryPoint receive '+session.iuf+' '+msgstr);
  var msg = JSON.parse(msgstr);
  if (msg.action == "get"){
    var toreturn= {idrequest : msg.idrequest};
    if (msg.query == "records"){
      toreturn.content = "records";
      var records = DB.records.getData(session.iuf);
      records = records.records;
      var i = 0, length = records.length;
      var results = [];
      console.log('wsQueriesEntryPoint records '+length);
      for (i=0;i<length;i++){
        var record = records[i];
        var translatedRecord = {};
        translatedRecord.lieu = record.lieu;
        translatedRecord.epreuve = DB.Epreuves.getEpreuveName({id:record.epreuve, shortFormat:true});
        var string = '';
        string += record.date;
        translatedRecord.date = string.slice(6,8)+'/'+string.slice(4,6)+'/'+string.slice(0,4);
        translatedRecord.temps = record.temps;
        results.push(translatedRecord);
      }
      toreturn.results = results;
    }
    var msgback = JSON.stringify(toreturn);
    console.log('wsQueriesEntryPoint send '+msgback);
    websocket.send(JSON.stringify(toreturn));
  }
}

module.exports = entryPoint;
