
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts_main").clone() );
	};

	calacts.template.load("template.html",calacts.fill);
	
	return calacts;

};
