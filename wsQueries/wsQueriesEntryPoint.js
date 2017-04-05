var DB = require('./DataBaseAccess.js');

function initializeIUF(session, callBack){
  if(session.iuf === undefined){
    var user = DB.users.getDataWithFilter({prop:"nom", value:session.name});
    session.iuf = user.id;
    session.genre = user.genre;
  }
}

function TranslateEventDate(iDate){
  var string = '';
  if (iDate.length!==undefined){
    string+='Du ' + TranslateSimpleDate(iDate[0]);
    string+=' au ' + TranslateSimpleDate(iDate[1]);
  }
  else{
    string ='Le ' + TranslateSimpleDate(iDate);
  }
  return string;
}
function TranslateSimpleDate(iDateAsInt){
  var string = '';
  string += iDateAsInt;
  string = string.slice(6,8)+'/'+string.slice(4,6)+'/'+string.slice(0,4);
  return string;
}

function getUserEvent(iEventId, iUserId){
  var toreturn;
  var tabEntries = DB.userevents.getData(iEventId);
  if (tabEntries!==undefined){
    length = tabEntries.length;
    var curEntry;
    for (i=0;i<length;i++){
      curEntry = tabEntries[i];
      if (curEntry.idUser===iUserId){
        toreturn = curEntry;
        break;
      }
    }
  }
  return toreturn;
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
  var i, length, k, length2;
  var userevent;
  //{ request :{action : 'post', table : 'userevents', data : {epreuves[eprid], idEvent: id}} };
  if(request.action == "post"){
    if (request.table == "userevents"){
      var obj = {};
      obj.idUser= session.iuf;
      obj.epreuves = request.data.epreuves;
      var tabEntries = DB.userevents.getData(request.data.idEvent);
      if (tabEntries===undefined){
        tabEntries = [];
      }
      length = tabEntries.length;
      var curEntry;
      for (i=0;i<length;i++){
        curEntry = tabEntries[i];
        if (curEntry.idUser===session.iuf){
          tabEntries.splice(i,1);
          break;
        }
      }
      if (obj.epreuves.length>0){
        tabEntries.push(obj);
      }
      DB.userevents.storeData(request.data.idEvent,tabEntries);
      DB.userevents.save();
      toreturn._result = 'OK';
    }
  }
  else if (request.action == "get"){
    if (request.table == "userevents"){
      var values = DB.userevents.getDataWithFilter(request.filter);
      toreturn._result  = [];
      if (values!==undefined){
        length = values.length;
      }
      var curValue;
      for (i=0;i<length;i++){
        obj = {};
        curValue = values[i];
        var theUser = DB.users.getData(curValue.idUser);
        obj.nom = theUser.nom+' '+theUser.prenom;
        obj.epreuves = [];
        length2 = curValue.epreuves.length;
        for (k=0;k<length2;k++){
          var epr = curValue.epreuves[k];
          obj.epreuves.push(DB.Epreuves.getEpreuveName({id:epr, shortFormat:true}));
        }
        toreturn._result.push(obj);
      }
    }
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
        translatedRecord.date = TranslateSimpleDate(record.date);
        translatedRecord.temps = record.temps;
        translatedRecord.age = record.age;
        results.push(translatedRecord);
      }
      toreturn._result = results;
    }
    //{action : 'get', table : 'events', filter :{prop : 'id', value : this.competitiondata.id}
    if (request.table == "events"){
      if (request.filter !== undefined && request.filter.prop !== undefined){
        var userdata;
        var data = DB.events.getDataWithFilter(request.filter);
        userevent = getUserEvent(request.filter.value,session.iuf);
        if (userevent!==undefined){
          userdata = userevent.epreuves;
        }
        var obj = [];
        length = data.epreuves.length;
        for(i=0;i<length;i++){
          var filteredobj ={};
          filteredobj.id = data.epreuves[i];
          if (DB.Epreuves.matchFilter(filteredobj.id,'genres',session.genre)){
            filteredobj.desc = DB.Epreuves.getEpreuveName({id:data.epreuves[i], shortFormat:true});
            var ischecked = false;
            if (userdata!==undefined && userdata.indexOf(data.epreuves[i])>-1){
              ischecked = true;
            }
            filteredobj.ischecked = ischecked;
            obj.push(filteredobj);
          }
        }
        toreturn._result = obj;
      }
      else{
        var events = DB.events.getAllData({ properties: ['nom','date', 'details', 'id']} );
        length = events.length;
        for(i=0;i<length;i++){
          userevent = getUserEvent(events[i].id,session.iuf);
          events[i].date = TranslateEventDate(events[i].date);
          if (userevent!==undefined){
            events[i].participation = true;
          }
          else{
            events[i].participation = false;
          }
        }
        toreturn._result = events;
      }
    }

    var msgback = JSON.stringify(toreturn);
    //console.log('wsQueriesEntryPoint send '+msgback);
    websocket.send(msgback);
  }
}

module.exports = entryPoint;
