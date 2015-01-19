
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");

	var maprecy={opts:opts};
	
	maprecy.template=$("<div></div>");
		
	maprecy.fill=function(){
		$(opts.div).empty().append( maprecy.template.find(".maprecy_main").clone() );
//		$(".maprecy .tab").append( l );
	};

// load huge json data chunk of all the data we need
	$(function() {
		$.ajax({
			type: "GET",
			url: "maprecy.json",
			dataType: "json",
			success: function(data) {
				console.log(data);
				maprecy.template.load("maprecy.template.html",maprecy.fill);
			}
		 });
	});
	
	return maprecy;

};
