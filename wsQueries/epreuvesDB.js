var epreuvesDB = function(epreuves){
  this.epreuves = epreuves;
};

epreuvesDB.prototype.getEpreuveNameAtom = function(iId, iCategory, input, bShort){
  var curCategory = this.epreuves[iCategory];
  var err;
  if (!curCategory){ err = new Error(iCategory); throw err;}
  var CurId = (iId % (curCategory.poids*10) - iId % curCategory.poids)/ curCategory.poids;
  if (!CurId){ err = new Error(iId); throw err;}
  if (input!==''){
      input+=' ';
  }
  var value = curCategory.tab[CurId-1];
  if (!value){ err = new Error(iCategory+' '+CurId); throw err;}
  var toAdd = value.name;
  if (!toAdd){ err = new Error(); throw err;}
  if (!bShort&& value.fullname !== undefined ){
    toAdd = value.fullname;
    if (!toAdd){ err = new Error(); throw err;}
  }
  input+=toAdd;
  return input;
};
epreuvesDB.prototype.getEpreuveName = function(input){
  var result = '';
  var iId = input.id;
  this.checkIdValidity(iId);
  var bShort = input.shortFormat;
  result = this.getEpreuveNameAtom(iId,"distances",result, bShort);
  result = this.getEpreuveNameAtom(iId,"nages",result, bShort);
  var curCategory = this.epreuves.relais;
  var RelaisId = (iId % (curCategory.poids*10) - iId % curCategory.poids)/ curCategory.poids;
  if (RelaisId!==0){
    result=curCategory.tab[RelaisId-1].name + '('+result+')';
  }
  result += ',';
  result = this.getEpreuveNameAtom(iId,"genres",result, bShort);
  if (!bShort){
    result += ',';
    result = this.getEpreuveNameAtom(iId,"bassins",result, bShort);
  }
  return result;
};

/*
  iDatas = [{ "category" : "cat", "property" : "prop", "value" : value }]
*/
epreuvesDB.prototype.addFilter = function(iFilter, icategory, iproperty, ivalue){
  iFilter.push({ "category" : icategory, "property" : iproperty, "value" : ivalue});
};
epreuvesDB.prototype.computeEpreuveId = function(iDatas){
  var me = this;
  var err;
  var oId = 0;
  iDatas.forEach (function(data){
    var curCategory = me.epreuves[data.category];
    if (!curCategory){ err = new Error(data.category); throw err;}
    var tab = curCategory.tab;
    function theFilter(element) {
      return element[data.property]===data.value;
    }
    var result = tab.filter(theFilter);
    if (result.length!==1){ err = new Error(data.category+' '+data.property+' '+data.value+' '+result.length); throw err;}
    oId += result[0].id*curCategory.poids;
  });
  this.checkIdValidity(oId);
  return oId;
};

epreuvesDB.prototype.checkIdValidity = function(iId){
  var me =this;
  var conditions = me.epreuves.validityConditions;
  var invalid = true;
  for (var i = 0; i< conditions.length; i++){
    var condition = conditions[i];
    invalid = false;
    var concerned = false;
    for (var j = 0; j<condition.length; j++){
      var clause = condition[j];
      var curCategory = me.epreuves[clause.property];
      var ExtractedId = (iId % (curCategory.poids*10) - iId % curCategory.poids)/ curCategory.poids;
      if (clause.values.indexOf(ExtractedId)==-1){
        invalid = true;
        if (j!=condition.length-1){
          concerned = false;
        }
      }
      else {
        concerned = true;
      }
      if (!concerned) {
        break;
      }
      else if (invalid){var err = new Error(JSON.stringify(condition)); throw err;}
    }
  }
};

exports.cst = epreuvesDB;
