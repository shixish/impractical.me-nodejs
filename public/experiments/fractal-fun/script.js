//see: http://staff.jccc.net/swilson/complex/functionsofi.htm
var settings,
    maxRes = Math.max(screen.height, screen.width),
    defaultSettings = {
      resolution: Math.min(800, screen.height, screen.width),
      maxDepth: 64,
      rx: Math.random(),
      ry: Math.random(),
      fn: 'sq',
      zoom: 3,
      offx: 0,
      offy: 0,
      colorize: true
    },
    colorness = Math.floor(255/2);
  
function parseFragment(e){
  var state = $.deparam.fragment(true);
  settings = $.extend(defaultSettings, state);
  //settings.resolution = Math.min(settings.resolution, maxRes);
  $('#options input, #options select').each(function(){
    var $this = $(this);
    if (this.type == 'checkbox'){
      $this.attr('checked', !!settings[this.name]);
    }else if (this.type == 'radio'){
      $this.attr('checked', $this.val() == settings[this.name]);
    }else{
      $this.val(settings[this.name]);
    }
  });
  //console.log(settings);
  render();
}
$('#options input, #options select').live('change', function(e){
  var state = $.deparam.fragment(true);
  var $el = $(e.target),
      type = $el.attr('type'),
      name = $el.attr('name'),
      val = $el.val();
  
  if (type == "checkbox"){
    state[name] = !!e.target.checked;
  }else if(type == "radio"){
    state[name] = val;
  }else if (e.target.name == "resolution"){
    state[name] = Math.min(val, maxRes);
  }else{
    state[name] = val;
  }
  $.bbq.pushState(state);
});
$(window).bind('hashchange', function(e) {
  parseFragment(e);
});
$(document).ready(function(){
  $('#resolution').attr('max', maxRes);
  parseFragment();
  //workerRender();
});
function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex; 
  return hex;
}
/*
function breakoutOLD(x, y, count){
  count = count || 0;
  var nx, ny;
  switch(settings.fn){
    case 'sin':
      nx = sin(x)*cosh(y)-settings.rx; ny = cos(x)*sinh(y)-settings.ry;
      break;
    case 'cos':
      nx = cos(x)*cosh(y)-settings.rx; ny = sin(x)*sinh(y)-settings.ry;
      break;
    case 'sinh':
      nx = sinh(x)*cos(y)-settings.rx; ny = cosh(x)*sin(y)-settings.ry;
      break;
    case 'cosh':
      nx = cosh(x)*cos(y)-settings.rx; ny = sinh(x)*sin(y)-settings.ry;
      break;
    default: //sq
      nx = sq(x)-sq(y)-settings.rx; ny = 2*x*y-settings.ry;
      break;
  }
  if (count >= settings.maxDepth || sq(nx)+sq(ny) > 4)
    return count;
  else
    return breakout(nx, ny, count+1);
}*/
function sqi(pos){
  var x = pos.x, y = pos.y;
  pos.x = sq(x)-sq(y)-settings.rx;
  pos.y = 2*x*y-settings.ry;
}
function sini(pos){
  var x = pos.x, y = pos.y;
  pos.x = sin(x)*cosh(y)-settings.rx;
  pos.y = cos(x)*sinh(y)-settings.ry;
}
function cosi(pos){
  var x = pos.x, y = pos.y;
  pos.x = cos(x)*cosh(y)-settings.rx;
  pos.y = sin(x)*sinh(y)-settings.ry;
}
function sinhi(pos){
  var x = pos.x, y = pos.y;
  pos.x = sinh(x)*cos(y)-settings.rx;
  pos.y = cosh(x)*sin(y)-settings.ry;
}
function coshi(pos){
  var x = pos.x, y = pos.y;
  pos.x = cosh(x)*cos(y)-settings.rx;
  pos.y = sinh(x)*sin(y)-settings.ry;
}
function breakout(pos){
  var fn = {'sq':sqi,'sin':sini,'cos':cosi,'sinh':sinhi,'cosh':coshi}[settings.fn] || sqi;
  for (var i = 1; i<=settings.maxDepth && sq(pos.x)+sq(pos.y) <= 4; i++)
    fn(pos);
  return i;
}
var Worker = window.Worker;
/*var BlobBuilder = (window.BlobBuilder || window.WebKitBlobBuilder);
var URL = (window.URL || window.webkitURL);
var Worker = window.Worker;

// BlobBuilder, Worker, and window.URL.createObjectURL are all available,
// so we can use inline workers.
var bb = new BlobBuilder();
bb.append(js);
var worker = new Worker(URL.createObjectURL(bb.getBlob()));
worker.onmessage = function(event) {
callback(event.data);
};
worker.postMessage(params);*/

//Renderer that uses webworkers... It works, but it's slow as hell.
/*
function render(){
  var start = new Date().getTime();
  var grayscale = Math.floor(255/settings.maxDepth);
  var canvas = $('#output')[0];
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = settings.resolution;
  var r, g, b;
  var imageData = ctx.createImageData(canvas.width, canvas.height);
  
  var workers = [];
  var working = 4;
  var pos = 0, lastpos = settings.resolution*settings.resolution-1;//, lastx = settings.resolution-1, lasty = settings.resolution-1;
  var msg = function(event){
    //console.log(event.data);
    //console.log(pos);
    if (event.data.num){
      //console.log(event.data.num);
      var idx = (event.data.x + event.data.y * canvas.width) * 4;
      if (settings.colorize){
        var color = event.data.num%64;
        r = g = b = 0;
        for (var t = 0; t < 2; t++){
          if (color & 1) b += colorness;
          if (color & 2) g += colorness;
          if (color & 4) r += colorness;
          color = color >>> 3;
        }
      }else{
        r = g = b = num*grayscale;
      }
      imageData.data[idx] = r;
      imageData.data[idx+1] = g;
      imageData.data[idx+2] = b;
      imageData.data[idx+3] = 255;
    }
    if (pos < lastpos){
      this.postMessage({'pos':pos});
    }else{
      working--;
    }
    pos++;
    if (!working){
      //console.log('going for it');
      ctx.putImageData(imageData, 0, 0);
      //console.log(imageData);
    }
  }
  
  for (var w = 0; w<4; w++){
    workers[w] = new Worker('worker.js');
    workers[w].onmessage = msg;
    workers[w].postMessage({'pos':pos, "settings":settings, 'id': w});
    pos++;
  }
}*/

function render() {
  var start = new Date().getTime();
  var grayscale = Math.floor(255/settings.maxDepth);
  var canvas = $('#output')[0];
  //var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var r, g, b;
  
  canvas.width = canvas.height = settings.resolution;
  
  var hw = canvas.width/2;
    hh = canvas.height/2;
  
  //var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var imageData = ctx.createImageData(canvas.width, canvas.height)
    pixelData = imageData.data;
  
  for ( var y = 0; y < canvas.height; y++ ) {
    for ( var x = 0; x < canvas.width; x++ ) {
      var temp = {
        "x":(settings.offx+(x-hw)/hw)*settings.zoom,
        "y":(settings.offy+(y-hh)/hh)*settings.zoom
      }
      var num = breakout(temp);
      if (num){
        var idx = (x + y * canvas.width) * 4;
        if (settings.colorize){
          var color = num%64;
          r = g = b = 0;
          for (var t = 0; t < 2; t++){
            if (color & 1) b += colorness;
            if (color & 2) g += colorness;
            if (color & 4) r += colorness;
            color = color >>> 3;
          }
        }else{
          r = g = b = num*grayscale;
        }
        pixelData[idx] = r;
        pixelData[idx+1] = g;
        pixelData[idx+2] = b;
        pixelData[idx+3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  var elapsed = ((new Date().getTime() - start)/1000);
  //$(document.body).css("background-image", "url('"+canvas.toDataURL('image/png')+"')").css("background-size", "100%")
  //document.body.style="background-image:url('"+canvas.toDataURL('image/png')+"');background-size: 100%;"
  if (elapsed > 1)
    console.log("render took: " + elapsed + " seconds.");
}