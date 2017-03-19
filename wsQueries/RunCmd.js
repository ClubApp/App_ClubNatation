var DB = require('./DataBaseAccess.js');
DB.load();
if (process.argv.length < 3) {
  console.error("type args");
  var truc;
  truc.throw();
}
var cmdName = process.argv[2];
var module = './'+cmdName+'.js';
var cmdProto = require(module);

var args = process.argv.slice(3, process.argv.length);
var cmd = cmdProto.instanciate(args);
cmd.run();
