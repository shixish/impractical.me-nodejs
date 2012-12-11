
/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    //fs = require('fs'),
    routes = require('./routes'),
    util = require('util'),
    //path = require('path'),
    //hbs = require('hbs'),
    now = require('now'), //http://nowjs.com/
    //assetManager = require('connect-assetmanager'), //https://github.com/mape/connect-assetmanager/
    //assetHandler = require('connect-assetmanager-handlers'), //https://github.com/mape/connect-assetmanager-handlers
    lessMiddleware = require('less-middleware'); //https://github.com/emberfeather/less.js-middleware
var pub_dir = __dirname + '/public';

// Configuration
app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'hbs');
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  //app.use(app.router);
  
  // disable layout
  app.set("view options", {layout: false});
  
  app.use(express.static(pub_dir));

  app.use(lessMiddleware({
    src: __dirname + '/public',
    compress: true,
    force: true,
    once: false
  }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

//app.get('/', routes.index);
//app.get('/', function(){
//  
//});

app.listen(80);