
var Command = require('./Command.js');
var nages = require('./Constants.js');
var DB = require('./DataBaseAccess.js');

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

  var FindCompetitionCmd = new Command.theClass({nbArgs :1, args : args, addToPath : true}, 'events', http_options,callBack);
  FindCompetitionCmd.buildDateString = function (date) {
    var toreturn = date.jour+date.mois*100+date.annee*10000;
    return toreturn;
  };
  FindCompetitionCmd.buildDateInternal = function (date) {
    var i=0;
    var mois = ['jan','f','mars','avr','mai','juin','juil','a','sep','oct','nov','d'];
    var tab = date.split(' ');
    var toreturn = {};
    toreturn.jour=parseInt(tab[1]);
    for (i=0;i<12;i++){
      if (tab[2].indexOf(mois[i])>-1){
        toreturn.mois=i+1;
        break;
      }
    }
    if (tab.length==4){
      toreturn.annee=parseInt(tab[3]);
    }
    return toreturn;
  };
  //du lundi 25 mai au dimanche 31 mai 2020
  //le samedi 13 mai 2017
  FindCompetitionCmd.buildDate = function (date) {
    var toreturn;
    var du = 'du', au = 'au ';
    var simpleDate = date.slice(3,date.length);
    if (date.slice(0,2)===du) {
      var tab = simpleDate.split(au);
      var datefin = this.buildDateInternal(tab[1]);
      var datedebut = this.buildDateInternal(tab[0]);
      datedebut.annee=datefin.annee;
      toreturn=[];
      toreturn.push(this.buildDateString(datedebut));
      toreturn.push(this.buildDateString(datefin));
    }
    else {
      var thedate = this.buildDateInternal(simpleDate);
      toreturn=this.buildDateString(thedate);
    }
    return toreturn;
  };

  FindCompetitionCmd.format = function (domElements) {
    var objCompet ={};
    var i = 0, j = 0;

    /*for(i=0;i<domElements.length;i++){
      console.log(domElements[i].innerHTML);
    }*/

    // table 1 = IdCard
    var idCard =  domElements[1];
    var globalData=idCard.children[0].children[0].children[1].innerHTML;
    console.log('FindCompetitionCmd.format'+globalData);
    globalData = globalData.replace(/<b>/ig,'');
    globalData = globalData.replace(/<\/b>/ig,'');
    globalData = globalData.replace(/<sup>/ig,'');
    globalData = globalData.replace(/<\/sup>/ig,'');
    globalData = globalData.replace(/<u>/ig,'');
    globalData = globalData.replace(/<\/u>/ig,'');
    var Tab = globalData.split(/<br>/ig);
    var propTab= ['date','nom','lieu','bassin','type'];
    var bassin =25;
    for (i=0;i<propTab.length;i++){
      var value = Tab[i];
      if (i===0){//date
        value = this.buildDate(value);
      }
      if (i===2){//lieu
        value = value.replace(/<div.*\/div>/ig,'');
        console.log('FindCompetitionCmd.format lieu '+value);
      }
      if (i==3){//bassin
        if (value.indexOf(50)>-1) {
          value= 2;
          bassin =50;
        }
        else {
          value= 1;
        }
      }
      objCompet[propTab[i]]=value;
    }

    // table 3 OU 2 = courses
    var index = 2;
    var theStr = domElements[index].textContent;
    console.log('FindCompetitionCmd.format '+this.id);
    console.log('FindCompetitionCmd.format '+theStr);
    if (theStr.indexOf(nages.NagesBigDetail[0])==-1){
      index = 3;
    }
    theStr = domElements[index].textContent;
    if (theStr.indexOf(nages.NagesBigDetail[0])==-1){
      index = 4;
    }
    console.log('FindCompetitionCmd.format '+index);
    if (domElements[index]!==undefined){
      console.log('FindCompetitionCmd.format '+domElements[index].innerHTML);
      var coursesTable =  domElements[index];
      var LinesNage = coursesTable.children[0].children;
      var length = LinesNage.length;
      objCompet.epreuves = [];

      for (i=0;i<length;i++){
        var filter = [];
        DB.Epreuves.addFilter(filter, 'bassins', 'name',bassin);
        var PropNage = '';
        var curNage = LinesNage[i];
        var NomNage = curNage.children[0].textContent;
        var bNage = false;
        for (j=0;j<nages.NagesBigDetail.length;j++){
          if (NomNage.indexOf('Relai')>-1){
            continue;
          }
          if (NomNage.indexOf(nages.NagesBigDetail[j])>-1){
            PropNage = nages.Nages[j];
            bNage = true;
            break;
          }
        }
        if(!bNage) continue;
        DB.Epreuves.addFilter(filter, 'nages', 'name',PropNage);

        var genres = ['H','F'];
        for (var genre in genres ){
          var genreFilter = filter.slice(0);
          DB.Epreuves.addFilter(genreFilter, 'genres', 'name',genres[genre]);
          var Dists = curNage.children[1].textContent;
          var tab = nages.EprByNage[PropNage];
          var nb = 0;
          for (j=0;j<tab.length;j++){
            if (Dists.indexOf(tab[j])>-1){
              var distFilter = genreFilter.slice(0);
              DB.Epreuves.addFilter(distFilter, 'distances', 'distance',tab[j]);
              try{
                var id = DB.Epreuves.computeEpreuveId(distFilter);
                objCompet.epreuves.push(id);
              }
              catch(err){
                console.log(err);
              }

              nb++;
            }
          }
        }
      }
      // table 4 details
      if (domElements[4]!==undefined){
        objCompet.details = domElements[4].textContent;
      }
      else {
        objCompet.details = '';
      }
    }
    return JSON.stringify(objCompet);
  };
  return FindCompetitionCmd;
};


exports.instanciate = createCmd;
