
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
  var CmdArgs = [escape(args[0]), escape(args[1])];
  var FindRecords = new Command.theClass({nbArgs : 2, args : CmdArgs, addToPath : true}, 'users', http_options,callBack);
  FindRecords.genre = args[2];
  FindRecords.format = function (json) {
    var obj = JSON.parse(json)[0];
    obj.id = obj.iuf;
    obj.iuf = undefined;
    var tab = obj.ind.split(' ');
    var i = 0, length = tab.length;
    obj.nom = '';
    var test = false;
    for (i=0;i<length;i++){
      if (tab[i]===tab[i].toUpperCase()){
        if (test) obj.nom +=' ';
        obj.nom += tab[i];
        test = true;
      }
      else
        break;
    }
    test = false;
    obj.prenom = '';
    for (;i<length;i++){
      if (tab[i].indexOf('(')===-1){
        if (test) obj.prenom +=' ';
        obj.prenom += tab[i];
        test = true;
      }
      else
        break;
    }
    obj.naissance =parseInt(tab[i].replace(/[()]*/ig,'')) ;
    obj.ind = undefined;
    obj.club = obj.clb;
    obj.clb = undefined;
    obj.genre = this.genre;
    return  JSON.stringify(obj);
  };
  return FindRecords;
};

exports.instanciate = createCmd;
