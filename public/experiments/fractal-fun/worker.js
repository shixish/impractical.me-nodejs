var sin = Math.sin, cos = Math.cos, tan = Math.cos,
	sinh = function(Angle) { // Angle in radians
		var p=Math.pow(Math.E,Angle);
		return (p-1/p)/2;
	}, // SinH
	cosh = function(Angle) { // Angle in radians
		var p=Math.pow(Math.E,Angle);
		return (p+1/p)/2;
	}, // CosH
	tanh = function(Angle) { // Angle in radians
		return sinh(Angle)/cosh(Angle);
	}, // TanH
	sq = function(n){
		return n*n;
	};
var settings;
function breakout(x, y, count){
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
		return breakout(nx, ny, count+1);//using 1+1i as c
}
self.onmessage = function(event) {
	settings = event.data.settings || settings;
	var x = event.data.pos%settings.resolution;
	var y = Math.floor(event.data.pos/settings.resolution);
	var hw = settings.resolution/2;
	var tx = (settings.offx+(x-hw)/hw)*settings.zoom,
		ty = (settings.offy+(y-hw)/hw)*settings.zoom;
	//var num = breakout(x, y);
	//postMessage(num);
	postMessage({"num":breakout(tx, ty), 'x':x, 'y':y, 'e':event.data});
	//postMessage({"num":1, 'x':x, 'y':y, 'e':event.data});
};