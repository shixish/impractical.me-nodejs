var express = require('express'),
    app = express(),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    util = require('util'),
    path = require('path');
    //now = require('now'), //http://nowjs.com/
    //lessMiddleware = require('less-middleware'); //https://github.com/emberfeather/less.js-middleware


var pub_dir = path.join(__dirname, 'public'),
    views_dir = path.join(__dirname, 'views');
// Configuration
app.configure(function(){
  app.set('view engine', 'ejs');
  app.engine('ejs', engine);
  
  app.set('views', views_dir);
  app.set('view engine', 'ejs'); // so you can render('index')
  //app.set('view options', {
  //    open: '<?',
  //    close: '?>'
  //});
  
  app.use(app.router);
  
  app.use(express.static(pub_dir));
  
  app.set('title', 'impractical.me');
  
  app.use(function(req, res){
    res.status(404).render('404.ejs', {title: 'Page not found'});
  });
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


var menu_items = {};

make_link('about', 'About Me', 'About');

make_link('experiments', 'Experiments');

function make_link(url, title, menu_title) {
  if (!menu_title) menu_title = title;
  menu_items[menu_title] = url;
  app.get('/'+url, function(request, response) {
    response.render(url+'.ejs', {title:title, breadcrumb:['home']});
  });
}

app.locals.menu_items = menu_items;

//app.locals.menu_items = {
//  'About':'about',
//  'Experiments':'experiments',
//  //'Resume': {
//  //  'Koalafications': '/'
//  //},
//};

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});