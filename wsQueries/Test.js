var fs = require('fs');
var epreuvesDB = require('./epreuvesDB.js');

fs.readFile('./fileDataBase/epreuves.json','utf8', function(err,data){
  obj = JSON.parse(data);
  var DB = new epreuvesDB.cst(obj);
  var result = DB.getEpreuveName({ "id" : 1111, "shortFormat": false} );
  console.log(result);

  var filter = [];
  DB.addFilter(filter, 'distances', 'distance',100);
  DB.addFilter(filter, 'nages', 'name','MED');
  DB.addFilter(filter, 'genres', 'name','H');
  DB.addFilter(filter, 'bassins', 'name',25);
  DB.addFilter(filter, 'relais', 'nbNageurs',10);
  var id = DB.computeEpreuveId(filter);
  console.log(id);

});
