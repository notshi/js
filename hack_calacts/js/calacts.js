
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var $=require("./jquery.js"); require("./jquery.csv.js");

	var calacts={opts:opts};
	
	var ouical=require('./ouical.js');


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		$(opts.div).empty().append( calacts.template.find(".calacts_main").clone() );


	var now = new Date();
	calacts.monday = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
	console.log(calacts.monday);



		
var myCalendar = 


		$(".calacts .tab").empty();
		
		for(var i=0;i<calacts.slots.length;i++)
		{
			var days=0;
			
			var v=calacts.slots[i];
			var l=calacts.template.find(".calacts_slot").clone();


			switch(v.day)
			{
				case "monday": days=0; break;
				case "tuesday": days=1; break;
				case "wednesday": days=2; break;
				case "thursday": days=3; break;
				case "friday": days=4; break;
				case "saturday": days=5; break;
				case "sunday": days=6; break;
			}
			
//			console.log(v.time);
			var a=v.time.split("-");
			var a0=a[0].split(":");
			var a1=a[1].split(":");
			
			l.find(".act").text(v.act);
			l.find(".day").text(v.day);
			l.find(".time").text(v.time);
			l.find(".place").text(v.place);
			l.find(".cal").append(ouical.createCalendar({
  options: {
    class: 'calclass'+i,
  },
  data: {
    // Event title
    title: v.act+' at '+v.place,

    // Event start date
    start: new Date(calacts.monday.getTime() + (days*24*60*60*1000) + (a0[0]*60*60*1000) + (a0[1]*60*1000) ),
    end:   new Date(calacts.monday.getTime() + (days*24*60*60*1000) + (a1[0]*60*60*1000) + (a1[1]*60*1000) ),

    // Event Address
    address: calacts.places[v.place].address,

    // Event Description
    description: v.act+' at '+v.place
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
				calacts.template.load("calacts.template.html",calacts.fill);
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
						p.time=dur.split(" ");p.time=p.time[p.time.length-1]; // last bit
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
