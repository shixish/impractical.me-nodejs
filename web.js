var express = require('express'),
    app = express.createServer(express.logger()),
    routes = require('./routes'),
    util = require('util');
    //now = require('now'), //http://nowjs.com/
    //lessMiddleware = require('less-middleware'); //https://github.com/emberfeather/less.js-middleware


var pub_dir = __dirname + '/public';
// Configuration
app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'hbs');
  app.set('view engine', 'ejs');
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(app.router);
  
  // disable layout
  app.set("view options", {layout: true});
  
  app.use(express.static(pub_dir));

  //app.use(lessMiddleware({
  //  src: __dirname + '/public',
  //  compress: true,
  //  force: true,
  //  once: false
  //}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(request, response) {
  response.render('index.ejs', {title:'Home'});
  //response.send('Hello World!');
});

app.get('/about', function(request, response) {
  response.render('about.ejs', {title:'About Me', breadcrumb:['home']});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});