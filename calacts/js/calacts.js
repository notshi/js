
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};
	
	var ouical=require('./ouical.js');


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts_main").clone() );


	var now = new Date();
	calacts.monday = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
	console.log(calacts.monday);



		
var myCalendar = 


		$(".calacts .tab").empty();
		
		for(var i=0;i<calacts.slots.length;i++)
		{
			var v=calacts.slots[i];
			var l=calacts.template.find(".calacts_slot").clone();
			
			l.find(".act").text(v.act);
			l.find(".day").text(v.day);
			l.find(".time").text(v.time);
			l.find(".place").text(v.place);
			l.find(".cal").append(ouical.createCalendar({
  options: {
    class: 'calclass',
  },
  data: {
    // Event title
    title: v.act+' at '+v.place,

    // Event start date
    start: new Date(calacts.monday),

    // Event duration (IN MINUTES)
    duration: 120,  

    // Event Address
    address: [],

    // Event Description
    description: 'Test cal.'
  }
}));
			
			$(".calacts .tab").append( l );
		}

		
	};

// load and parse raw CSV
	$(function() {
		$.ajax({
			type: "GET",
			url: "calacts.csv",
			dataType: "text",
			success: function(data) {
				calacts.csv=$.csv.toArrays(data);
				calacts.ParseCSV()
				calacts.template.load("template.html",calacts.fill);
//				console.log(calacts.csv);
			}
		 });
	});

	calacts.ParseCSV=function()
	{
		calacts.objs=[];
		for(var j=1;j<calacts.csv.length;j++) // first line is header
		{
			var t={};
			for(var i=0;i<calacts.csv[0].length;i++)
			{
				t[ calacts.csv[0][i] ]=calacts.csv[j][i];
			}
			calacts.objs[calacts.objs.length]=t;
		}
		calacts.places={};
		calacts.slots=[];
		for(var i=0;i<calacts.objs.length;i++)
		{
			var t={};
			t.name=calacts.objs[i]["LeisureCentreName"];
			t.address=calacts.objs[i]["Address"];
			t.phone=calacts.objs[i]["Telephone"];
			t.comments=calacts.objs[i]["Comments"];
			calacts.places[t.name]=t;
			
			for(var n in calacts.objs[i])
			{
				var dur=calacts.objs[i][n];
				if( dur != "" )
				{
					var ns=n.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
					var na=ns.split(" ");
					if( (na[1]=="monday") || (na[1]=="tuesday") || (na[1]=="wednesday") || (na[1]=="thursday") || (na[1]=="friday") || (na[1]=="saturday") || (na[1]=="sunday"))
					{
						var p={};
						p.day=na[1];
						p.act=na[0];
						p.place=t.name;
						p.time=dur;
						calacts.slots[calacts.slots.length]=p;
					}
				}
			}
		}
//		console.log(calacts.places);
//		console.log(calacts.slots);
	};
	
	return calacts;

};
