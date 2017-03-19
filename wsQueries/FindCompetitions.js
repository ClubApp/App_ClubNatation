
var Command = require('./Command.js');

var createCmd = function(args,callBack){
  var http_options = {
    request: {
      host: 'www.bbnatation.fr',
      path: '/Competition.php'
    },
    treatment: {
      engine: 'dom',
      selector: 'select'
    }
  };

  var FindCompetitionCmd = new Command.theClass({id:'sumup'}, 'eventsSumUp', http_options,callBack);

  FindCompetitionCmd.format = function(domElements){
    var selectContent = domElements[0];
    var options = selectContent.children;
    var curElement;
    var i = 0;
    var objCompets = [];
    for (i = 0; i < options.length; i++) {
      curElement = options[i];
      var value = curElement.getAttribute("value");
      if (value !== null) {
        var newCompet = {};
        console.log('FindCompetitionCmd.format '+value);
        newCompet.id = parseInt(value);
        newCompet.description = curElement.textContent;
        objCompets.push(newCompet);
      }
    }
    return JSON.stringify(objCompets);
  };
  return FindCompetitionCmd;
};

exports.instanciate = createCmd;
