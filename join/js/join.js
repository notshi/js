
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.bake=function(opts){

	var join={opts:opts};

	require('./join.html.js').bake(join);			

	return join;

};
