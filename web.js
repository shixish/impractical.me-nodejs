var express = require('express'),
    app = express(),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    util = require('util'),
    path = require('path');
    //now = require('now'), //http://nowjs.com/
    //lessMiddleware = require('less-middleware'); //https://github.com/emberfeather/less.js-middleware


var pub_dir = path.join(__dirname, 'public');
// Configuration
app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'hbs');
  app.set('view engine', 'ejs');
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  
  // use ejs-locals for all ejs templates:
  app.engine('ejs', engine);
  
  app.set('views',__dirname + '/views');
  app.set('view engine', 'ejs'); // so you can render('index')
  
  app.use(app.router);
  
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

app.locals.menu = {
  'about': 'About',
  'derp': 'Herp'
};

app.locals.someHelper = function(name) {
  return ("hello " + name);
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});