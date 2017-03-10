
var Command = require('./Command.js');

var createCmd = function(args, callBack){
  var http_options = {
      request: {
        host: 'ffn.extranat.fr',
        path: '/webffn/_recherche.php?go=ind&idrch='
      },
      treatment: {
        engine: 'json'
      }
  };

  var FindRecords = new Command.theClass({nbArgs : 2, args : args, addToPath : true}, 'Clubbers', http_options,callBack);

  FindRecords.format = function (json) {
      return json;
  };
  return FindRecords;
};

exports.instanciate = createCmd;
