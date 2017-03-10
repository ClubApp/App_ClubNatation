
function initializeIUF(session, callBack){
  if(session.IUF === undefined){
    var cmdName = 'FindClubbers';
    var module = './'+cmdName+'.js';
    var cmdProto = require(module);

    var args = [session.name,session.firstname];
    console.log('initializeIUF '+JSON.stringify(args));

    var localCallBack = function(result, error){
      if (result!==undefined){
        console.log('initializeIUF localCallBack '+result);
        var objResult = JSON.parse(result);
        session.iuf = objResult[0].iuf;
        callBack();
      }
      else{
        callBack(err);
      }
    };

    var cmd = cmdProto.instanciate(args,localCallBack);
    cmd.run();
  }
}

function entryPoint(session, msg, websocket){
  initializeIUF(session, function(err){
    if (err){
      websocket.send('error iuf initialization');
    }
    console.log(msg);
    var objQuery = JSON.parse(msg);
    var cmdName = objQuery.function;
    var module = './'+cmdName+'.js';
    var cmdProto = require(module);

    console.log(session.iuf);
    var args = [session.iuf];
    var localCallBack = function(result, error){
      if (result!==undefined){
        websocket.send('termine');
        websocket.send(result);
      }
      else{
        websocket.send('error in query');
      }
    };
    var cmd = cmdProto.instanciate(args,localCallBack);
    cmd.run();
  });
}

module.exports = entryPoint;
