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
  //{ _requestId : oId, _request : {action : 'get', table : 'records', filter :{}}};
  var query = JSON.parse(msgstr);
  var request= query._request;
  // output
  var toreturn= {_requestId : query._requestId};
  var i, length;
  if (request.action == "get"){
    if (request.table == "records"){
      var records = DB.records.getData(session.iuf);
      records = records.records;
      length = records.length;
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
      toreturn._result = results;
    }
    //{action : 'get', table : 'events', filter :{prop : 'id', value : this.competitiondata.id}
    if (request.table == "events"){
      if (request.filter !== undefined && request.filter.prop !== undefined){
        var data = DB.events.getDataWithFilter(request.filter);
        var obj = [];
        length = data.epreuves.length;
        for(i=0;i<length;i++){
          var filteredobj ={};
          filteredobj.id = data.epreuves[i];
          filteredobj.desc = DB.Epreuves.getEpreuveName({id:data.epreuves[i], shortFormat:true});
          obj.push(filteredobj);
        }
        toreturn._result = obj;
      }
      else{
        var events = DB.events.getAllData({ properties: ['nom','date', 'details', 'id']} );
        toreturn._result = events;
      }
    }
    var msgback = JSON.stringify(toreturn);
    console.log('wsQueriesEntryPoint send '+msgback);
    websocket.send(msgback);
  }
}

module.exports = entryPoint;
