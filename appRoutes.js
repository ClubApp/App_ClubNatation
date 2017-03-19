var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var queriesEntryPoint = require('./wsQueries/wsQueriesEntryPoint');

var addAppRoutes = function(app){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));

  var sessionParser = session({
      secret: 'sophielabat',resave: true, saveUninitialized: true,
      cookie: {/*secure: true, */maxAge: null, httpOnly: false}
  });
  app.use(sessionParser);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.ws('/echo', function (ws, req)  {
     console.log("New connection has opened!");
      ws.on('message', function(msg) {
         console.log('app.ws :'+JSON.stringify(req.session));
         queriesEntryPoint(req.session,msg,ws);
      });

      ws.on('close', function()  {
          console.log('WebSocket was closed');
      });
  });

  app.get('/',function(req,res){
    var sess = req.session;
    if(sess.name) {
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
    sess.name=req.body.name.toUpperCase();
    sess.firstname=req.body.firstname;
    res.end('done');
  });

  app.get('/logged',function(req,res){
    console.log('coucou');
    var sess = req.session;
    if(sess.name) {
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
    res.render('error',{ title: 'Error' , message : 'ko'});
  });

};

module.exports = addAppRoutes;
