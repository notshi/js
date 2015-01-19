
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");

	var maprecy={opts:opts};
	
	maprecy.template=$("<div></div>");
		
	maprecy.fill=function(){
		$(opts.div).empty().append( maprecy.template.find(".maprecy_main").clone() );
		$(".maprecy .tab").append( l );
	};

// load and parse raw CSV
/*
	$(function() {
		$.ajax({
			type: "GET",
			url: "maprecy.csv",
			dataType: "text",
			success: function(data) {
				maprecy.csv=$.csv.toArrays(data);
				maprecy.ParseCSV()
				maprecy.template.load("maprecy.template.html",maprecy.fill);
//				console.log(maprecy.csv);
			}
		 });
	});

	maprecy.ParseCSV=function()
	{
		maprecy.objs=[];
	};
*/
	
	
	maprecy.template.load("maprecy.template.html",maprecy.fill);
	
	return maprecy;

};
