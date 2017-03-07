var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
//var webSocket = require('./routes/webSocket');

var app = express();
var expressWs = require('express-ws')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({secret: 'sophielabat',resave: true, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.ws('/echo', function (ws, req)  {
  console.log("New connection has opened!");
    ws.on('message', function(msg) {
        ws.send(msg);
    });

    ws.on('close', function()  {
        console.log('WebSocket was closed');
    });
});
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// websocket


//app.use("/ws-stuff", webSocket);


// essai management de session
app.get('/',function(req,res){
  var sess = req.session;
  if(sess.email) {
    res.redirect('/logged');
  }
 else {
    res.render('login');
  }
});

app.post('/login',function(req,res){
  var sess = req.session;
//In this we are assigning email to sess.email variable.
//email comes from HTML page.
  sess.email=req.body.email;
  res.end('done');
});

app.get('/logged',function(req,res){
  var sess = req.session;
  if(sess.email) {
   res.render('index', { title: 'indexEjs' });
  } else {
    res.write('  <h1>Please login first.</h1> ');
    res.end('<a href="/">Login</a>');
  }
});
app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});

});

/*app.use('/', index);
app.use('/users', users);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{ title: 'Error' });
});

module.exports = app;
