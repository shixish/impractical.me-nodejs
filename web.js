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
    res.status(404).render('404.ejs', {node: nodes['404']});
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


var nodes = {
  //special:
  'home':{
    title: 'Home',
  },
  '404':{
    title: 'Page not found',
  },
  //regular:
  'about':{
    title: "About Me",
    link: "About",
  },
  'experiments':{
    title: "Experiments",
  },
  'experiments/chroma-key':{
    title: "Image Processing Project",
    github: 'https://github.com/shixish/chroma-key',
  },
};

var main_menu = {
  'About':'about',
  'Experiments':'experiments',
  //'Resume': {
  //  'Koalafications': '/'
  //},
};

//handle 'home' seperately...
app.get('/', function(request, response) {
  response.render('index.ejs', {node:nodes['home']});
});

for (var url in nodes){
  (function(url, data) {
    app.get('/'+url, function(request, response) {
      response.render(url+'.ejs', {node:data, url:url});
    });
  })(url, nodes[url]);
}

app.locals.nodes = nodes;
app.locals.main_menu = main_menu;

app.locals.carousel_indicators = function(id, pages){
  var ret = '';
  for (var i = 0; i<pages; i++) {
    ret += '<li data-target="'+id+'" data-slide-to="'+i+'"'+(i==0?' class="active"':'')+'></li>';
  }
  return '<ol class="carousel-indicators">'+ret+'</ol>';
}

app.locals.views_dir = views_dir;

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