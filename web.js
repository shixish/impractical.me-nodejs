var express = require('express'),
    app = express(),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    util = require('util'),
    path = require('path'),
    mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend');
    
var Schema = mongoose.Schema;

//mongoose + session handling: http://blog.modulus.io/nodejs-and-express-sessions

var mongoUri = "mongodb://heroku_app9963420:pqlukjold9gdetppfggvgu5dfq@ds053788.mongolab.com:53788/heroku_app9963420";
var db = mongoose.connect(mongoUri);

var NodeSchema = Schema({
  title: String,
  subtitle: String,
  uri: String,
  description: String,
  updated: Date,
  created: Date,
}, { collection : 'nodes' });

var ExperimentSchema = NodeSchema.extend({
  images: Array,
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

//This should be in a database soon...
var nodes = {};
//var nodes = {
//  //special:
//  'home':{
//    title: 'Home',
//  },
//  '404':{
//    title: 'Page not found',
//  },
//  //regular:
//  'about':{
//    title: "About Me",
//    link: "About",
//  },
//  'experiments':{
//    title: "Experiments",
//    description: "This is a collection of my hair-brained schemes that I tinker around with for fun.",
//    experiments: [
//      'experiments/music',
//      'experiments/chroma-key',
//      'experiments/fractal-fun',
//    ]
//  },
//  'experiments/music':{
//    title: "Music Generation",
//    date: 1379845327499,
//    description: "I have been experimenting with music generation using JavaScript and Midi.",
//    github: 'https://github.com/shixish/music',
//    images: [
//      {
//        src: "/experiments/music/teaser.png",
//      }
//    ]
//  },
//  'experiments/chroma-key':{
//    title: "Image Processing Project",
//    subtitle: "Chroma Key",
//    date: 1386889893176,
//    description: "I made this project using HTML5 Canvas and the new getUserMedia() function to interact with the user's webcam through the browser. I made this for my Image Processing class (Fall 2013). I spent about a day working on it. The idea is to do chroma keying (green screen) to remove certain pixels. I tried out a couple of different made-up techniques. Check out the results!",
//    instructions: "I think this only works in Google Chrome, but it may also work in Firefox (dunno). Your browser should ask you if you want to share your webcam, then you should see your beautiful mug pop up over the image of the beach.<br>There are three settings. Each of which work poorly (lol), but are fun nonetheless.",
//    github: 'https://github.com/shixish/chroma-key',
//    images: [
//      {
//        src: "/experiments/chroma-key/imgs/results/normal.jpg",
//        caption: "Normal",
//      },{
//        src: "/experiments/chroma-key/imgs/results/chroma-key.jpg",
//        caption: "Key out blue",
//      },{
//        src: "/experiments/chroma-key/imgs/results/subtraction.jpg",
//        caption: "Subtract the background",
//      },{
//        src: "/experiments/chroma-key/imgs/results/subtraction2.jpg",
//        caption: "Subtract the background (junk)",
//      },{
//        src: "/experiments/chroma-key/imgs/results/fancy.jpg",
//        caption: "Fancy made up method",
//      },{
//        src: "/experiments/chroma-key/imgs/results/fancy2.jpg",
//        caption: "Creepy fancy",
//      },
//    ]
//  },
//  'experiments/fractal-fun':{
//    title: "Fractal Fun",
//    date: 1310437739429,
//    description: "This is my funky fractal generator that I made a while back.",
//    github: 'https://github.com/shixish/fractal-fun',
//    images: [
//      {
//        src: "/experiments/fractal-fun/teaser.png",
//      }
//    ]
//  },
//};

//for (var n in nodes) {
//  if (n.indexOf('/') != -1) {
//    node = new Experiment(nodes[n]);
//  }else{
//    node = new Node(nodes[n]);
//  }
//  node.uri = n;
//  node.save();
//}

//Node.find(function (err, n) {
//  console.log("nodes: ", n);
//});

var main_menu = {
  'About':'about',
  'Experiments':'experiments',
  //'Resume': {
  //  'Koalafications': '/'
  //},
};

function renderNode(path, res) {
  Node.findOne({uri: path}, function(error, node){
    if (node) {
      res.render(path+'.ejs', {node:node});
    }else{
      render404(res);
    }
  });
}

//handle 'home' seperately...
app.get('/', function(req, res) {
  //response.render('index.ejs', {node:nodes['home']});
  renderNode('home', res);
});

////generate the routes from the nodes data above.
//function generateRoutes() {
//  for (var url in nodes){
//    (function(url, data) {
//      app.get('/'+url, function(request, response) {
//        response.render(url+'.ejs', {node:data, url:url});
//      });
//    })(url, nodes[url]);
//  }
//}

//generateRoutes();
app.get('/:path', function (req, res) {
  renderNode(req.params.path, res);
});
//app.get('/experiments/:path', function (req, res) {
//  
//});


//var routes = {};
//for (var url in routes){
//  (function(url, data) {
//    app.get('/'+url, function(request, response) {
//      Node.findOne({uri: uri}, function(error, node){
//        if (node) {
//          response.render(uri+'.ejs', {node:node});
//        }else{
//          render404(response);
//        }
//      });
//    });
//  })(url, nodes[url]);
//}

//allow templates to use these variables:
app.locals.nodes = nodes;
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
  var date = new Date(timestamp); use_mon = use_short?short_mon:long_mon;
  return use_mon[date.getMonth()] + " " + format_day(date.getDate()) + ", " + date.getFullYear();
}

//useful if you need to get an absolute url to a template file
app.locals.views_dir = views_dir;

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});