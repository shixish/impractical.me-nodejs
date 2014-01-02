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