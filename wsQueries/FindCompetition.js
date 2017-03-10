
var Command = require('./Command.js');
var nages = require('./Constants.js');

var createCmd = function(args,callBack){
  var http_options = {
    request: {
      host: 'www.bbnatation.fr',
      path: '/Competition.php?ID='
    },
    treatment: {
      engine: 'dom',
      selector: 'table'
    }
  };

  var FindCompetitionCmd = new Command.theClass({nbArgs :1, args : args, addToPath : true}, 'Competitions', http_options,callBack);

  FindCompetitionCmd.format = function (domElements) {
    var objCompet ={};
    var i = 0, j = 0;

    /*for(i=0;i<domElements.length;i++){
      console.log(domElements[i].innerHTML);
    }*/

    // table 1 = IdCard
    objCompet.idCard = {};
    var idCard =  domElements[1];
    var globalData=idCard.children[0].children[0].children[1].innerHTML;
    globalData = globalData.replace(/<b>/ig,'');
    globalData = globalData.replace(/<\/b>/ig,'');
    globalData = globalData.replace(/<sup>/ig,'');
    globalData = globalData.replace(/<\/sup>/ig,'');
    globalData = globalData.replace(/<u>/ig,'');
    globalData = globalData.replace(/<\/u>/ig,'');
    var Tab = globalData.split(/<br>/ig);
    var propTab= ['date','name','place','bassin','type'];
    for (i=0;i<propTab.length;i++){
      objCompet.idCard[propTab[i]]=Tab[i];
    }

    // table 3 OU 2 = courses
    var index = 2;
    var theStr = domElements[index].textContent;
    if (theStr.indexOf(nages.NagesDetail[0])==-1){
      index = 3;
    }
    var coursesTable =  domElements[index];
    var LinesNage = coursesTable.children[0].children;
    var length = LinesNage.length;
    objCompet.epreuves = {};
    for (i=0;i<length;i++){
      var PropNage = '';
      var curNage = LinesNage[i];
      var NomNage = curNage.children[0].textContent;
      var bNage = false;
      for (j=0;j<nages.NagesDetail.length;j++){
        if (NomNage.indexOf('Relai')>-1){
          continue;
        }
        if (NomNage.indexOf(nages.NagesDetail[j])>-1){
          PropNage = nages.Nages[j];
          bNage = true;
          break;
        }
      }
      if(!bNage) continue;
      objCompet.epreuves[PropNage]=[];
      var Dists = curNage.children[1].textContent;
      var tab = nages.EprByNage[PropNage];
      var nb = 0;
      for (j=0;j<tab.length;j++){
        if (Dists.indexOf(tab[j])>-1){
          objCompet.epreuves[PropNage].push(tab[j]);
          nb++;
        }
      }
    }
    // table 4 details
    objCompet.details = domElements[4].textContent;

    return JSON.stringify(objCompet);
  };
  return FindCompetitionCmd;
};


exports.instanciate = createCmd;
