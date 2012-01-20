
Swish=function(opts){

	var swish={};
	
	swish.setup=function(opts)
	{
		
		var v=swish.testdata.list[10];

console.log(v.full);
		
		opts.div.css({"backgroundImage":"url("+v.full+")","backgroundSize":"cover","backgroundPosition":"center"});
		
	};

swish.testdata=
#include "src/swish.testdata.js"
;
	return swish;
};
