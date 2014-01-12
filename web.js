var express = require('express'),
    app = express(),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    util = require('util'),
    path = require('path'),
    mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    async = require('async');
    
var Schema = mongoose.Schema;

//mongoose + session handling: http://blog.modulus.io/nodejs-and-express-sessions

var mongoUri = "mongodb://heroku_app9963420:pqlukjold9gdetppfggvgu5dfq@ds053788.mongolab.com:53788/heroku_app9963420";
var db = mongoose.connect(mongoUri);

var NodeSchema = Schema({
  title: String,
  subtitle: String,
  uri: {type: String, index: true, required: '{PATH} is required!'},
  link: String,//hyperlink link label, or default to title
  description: String,
  updated: Date,
  created: Date,
}, { collection : 'nodes', index: true });

var ExperimentSchema = NodeSchema.extend({
  images: [{src: String, caption: String}],
  github: String,
  instructions: String,
});

var Node = mongoose.model('Node', NodeSchema);
var Experiment = mongoose.model('Experiment', ExperimentSchema);

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
    render404(res);
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function render404(res){
  res.status(404).render('404.ejs', {node: {title: "Page not found"}});
}

var main_menu = {
  'About':'about',
  'Experiments':'experiments',
  //'Resume': {
  //  'Koalafications': '/'
  //},
};

function getBreadcrumb(uri, callback) {
  var paths = [];
  var uri_pos = 0;
  while (uri_pos = uri.indexOf('/', uri_pos)+1) {
    paths.push(uri.substr(0,uri_pos-1));
  }
  async.map(paths, function(path, map_callback){
    //grab the title, and link value of 
    Node.findOne({uri: path}, 'title link uri', map_callback);
  }, function(err, results){
    var ret = {};
    for (var i in results){
      ret[results[i].uri] = results[i].link?results[i].link:results[i].title;
    }
    callback(ret);
  });
}

function renderNode(path, res, pre_render) {
  Node.findOne({uri: path}, function(error, node){
    if (node) {
      var ready = function(){
        //console.log("rendering:", node);
        res.render(path+'.ejs', {node:node});
      };
      getBreadcrumb(path, function(result){
        node.breadcrumb = result;
        if (pre_render){
          pre_render(node, ready);
        }else{
          ready();
        }
      });
    }else{
      render404(res);
    }
  });
}

app.get('/', function(req, res) {
  renderNode('home', res);
});

app.get('/about/', function (req, res) {//used to render experiment urls
  renderNode("about", res);
});

app.get('/experiments/', function(req, res){
  renderNode('experiments', res, function(node, ready){//pre-render function
    Node.find({__t: 'Experiment'}, null, {sort: {updated: -1}}, function(error, nodes){
      //console.log(nodes);
      node.experiments = nodes || [];
      ready();
    });
  });
});

app.get('/experiments/:experiment/', function (req, res) {//used to render experiment urls
  renderNode("experiments/" + req.params.experiment, res);
});

//app.get('/:path', function (req, res) {
//  renderNode(req.params.path, res);
//});

//allow templates to use these variables:
app.locals.main_menu = main_menu;

//returns a random id as a string.
app.locals.random_id = function(){
  return Math.random().toString().substr(2);
}

var short_mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var long_mon = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function format_day(day){
  var last_digit = day%10, last_two_digits = day%100;
  if (last_two_digits == 11 || last_two_digits == 12 || last_two_digits == 13) {
    return day + "th";
  }
  switch (last_digit) {
    case 1:
      return day + "st";
    case 2:
      return day + "nd";
    case 3:
      return day + "rd";
    default:
      return day + "th";
  }
}

app.locals.format_date = function(timestamp, use_short){
  var date = new Date(timestamp),
      use_mon = use_short?short_mon:long_mon,
      str_date = use_mon[date.getMonth()] + " " + format_day(date.getDate()) + ", " + date.getFullYear();
  return '<time datetime="'+date.toISOString()+'" title="'+date.toDateString()+'">'+str_date+'</time>';
}

//useful if you need to get an absolute url to a template file
app.locals.views_dir = views_dir;

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});