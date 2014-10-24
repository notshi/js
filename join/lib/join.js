require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"onm6mO":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var join={opts:opts};

// parse query string
	join.qs={};
	var qs=window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < qs.length; i++)
	{
		var q=qs[i].split("=");
		join.qs[ q[0] ]=q[1];
	}
	
	join.vars={}

//	require('./join.html.js').setup(join);

	join.userapi="http://host.local:1408/genes/user/";

	join.template=$("<div></div>");
		
	join.fill=function(){
		opts.div.empty().append( join.template.find(".wetjoin_main").clone() );

		console.log(join.qs);
		if(join.qs.token)
		{
			join.vars.token=join.qs.token;
			join.page("token");
			$(".wetjoin_main .wetjoin_submit").focus().click();
		}
		else
		{
			join.page("login");
		}

	};

	join.page=function(pagename){
		
		$(".wetjoin").removeClass().addClass("wetjoin wetjoin_page_"+pagename);
		
		join.vars.token= $(".wetjoin_main .wetjoin_token").val() || join.vars.token;
		join.vars.name=  $(".wetjoin_main .wetjoin_name" ).val() || join.vars.name;
		join.vars.email= $(".wetjoin_main .wetjoin_email").val() || join.vars.email;
		join.vars.pass=  $(".wetjoin_main .wetjoin_pass" ).val() || join.vars.pass;

		$(".wetjoin_main .wetjoin_page").empty().append( join.template.find(".wetjoin_page_"+pagename).clone() );

		$(".wetjoin_main .wetjoin_token").val(join.vars.token);
		$(".wetjoin_main .wetjoin_name" ).val(join.vars.name);
		$(".wetjoin_main .wetjoin_email").val(join.vars.email);
		$(".wetjoin_main .wetjoin_pass" ).val(join.vars.pass);
		
		$(".wetjoin_main .span_token").text(join.vars.token);
		$(".wetjoin_main .span_name" ).text(join.vars.name);
		$(".wetjoin_main .span_email").text(join.vars.email);

		join.bind();
		return false;
	};

	join.callback=function(cmd,dat){
		console.log(cmd,dat);
		
		if(dat.error)
		{
			$(".wetjoin_main .wetjoin_error").text( dat.error );
			return;
		}
			

		if(cmd=="join"){
			join.page("join2");
		}
		else
		if(cmd=="login"){
			join.page("login2");
			
			var q="&S="+dat.session;
			
			if(join.qs["continue"])
			{
				window.location.href=join.qs["continue"]+q;
			}
			else
			{
				window.location.href="http://forum.wetgenes.com/?"+q;
			}
		}
		else
		if(cmd=="forgot"){
			join.page("forgot2");
		}

	};

	join.submit=function(cmd){
		console.log(cmd);

		$(".wetjoin_main .wetjoin_error").text("");

		var token=$(".wetjoin_main .wetjoin_token").val();
		var name= $(".wetjoin_main .wetjoin_name" ).val();
		var email=$(".wetjoin_main .wetjoin_email").val();
		var pass= $(".wetjoin_main .wetjoin_pass" ).val();

		if(cmd=="join"){
			$.post( join.userapi+"create",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("join",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="login"){
			$.post( join.userapi+"login",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("login",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="forgot"){
			$.post( join.userapi+"update",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("forgot",a,b,c);},"json");
			return false;
		}
		else
		if(cmd=="token"){
			$.post( join.userapi+"token",{
				"token":token
			},function(a,b,c){return join.callback("token",a,b,c);},"json");
			return false;
		}
	};

	join.bind=function(){
		$(".wetjoin_main .wetjoin_header_join"  ).off("click").on("click",function(){return join.page("join");});
		$(".wetjoin_main .wetjoin_header_login" ).off("click").on("click",function(){return join.page("login");});
		$(".wetjoin_main .wetjoin_header_forgot").off("click").on("click",function(){return join.page("forgot");});

		$(".wetjoin_main .wetjoin_submit_login" ).off("click").on("click",function(){return join.submit("login");});
		$(".wetjoin_main .wetjoin_submit_join"  ).off("click").on("click",function(){return join.submit("join");});
		$(".wetjoin_main .wetjoin_submit_forgot").off("click").on("click",function(){return join.submit("forgot");});
		$(".wetjoin_main .wetjoin_submit_token" ).off("click").on("click",function(){return join.submit("token");});

		// enter in inputs will auto force a submit
		$(".wetjoin_main input").off("keypress").on("keypress",function(e){
			if(e.which == 13)
			{
				$(this).blur();
				$(".wetjoin_main .wetjoin_submit").focus().click();
				return false;
			}
		});
	};
	

	join.template.load("template.html",join.fill);
	
	return join;

};

},{}],"./js/join.js":[function(require,module,exports){
module.exports=require('onm6mO');
},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2pvaW4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2pvaW4vanMvam9pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgbHM9ZnVuY3Rpb24oYSkgeyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoYSx7ZGVwdGg6bnVsbH0pKTsgfVxuXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKG9wdHMpe1xuXG5cdHZhciBqb2luPXtvcHRzOm9wdHN9O1xuXG4vLyBwYXJzZSBxdWVyeSBzdHJpbmdcblx0am9pbi5xcz17fTtcblx0dmFyIHFzPXdpbmRvdy5sb2NhdGlvbi5ocmVmLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKSArIDEpLnNwbGl0KCcmJyk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBxcy5sZW5ndGg7IGkrKylcblx0e1xuXHRcdHZhciBxPXFzW2ldLnNwbGl0KFwiPVwiKTtcblx0XHRqb2luLnFzWyBxWzBdIF09cVsxXTtcblx0fVxuXHRcblx0am9pbi52YXJzPXt9XG5cbi8vXHRyZXF1aXJlKCcuL2pvaW4uaHRtbC5qcycpLnNldHVwKGpvaW4pO1xuXG5cdGpvaW4udXNlcmFwaT1cImh0dHA6Ly9ob3N0LmxvY2FsOjE0MDgvZ2VuZXMvdXNlci9cIjtcblxuXHRqb2luLnRlbXBsYXRlPSQoXCI8ZGl2PjwvZGl2PlwiKTtcblx0XHRcblx0am9pbi5maWxsPWZ1bmN0aW9uKCl7XG5cdFx0b3B0cy5kaXYuZW1wdHkoKS5hcHBlbmQoIGpvaW4udGVtcGxhdGUuZmluZChcIi53ZXRqb2luX21haW5cIikuY2xvbmUoKSApO1xuXG5cdFx0Y29uc29sZS5sb2coam9pbi5xcyk7XG5cdFx0aWYoam9pbi5xcy50b2tlbilcblx0XHR7XG5cdFx0XHRqb2luLnZhcnMudG9rZW49am9pbi5xcy50b2tlbjtcblx0XHRcdGpvaW4ucGFnZShcInRva2VuXCIpO1xuXHRcdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0XCIpLmZvY3VzKCkuY2xpY2soKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGpvaW4ucGFnZShcImxvZ2luXCIpO1xuXHRcdH1cblxuXHR9O1xuXG5cdGpvaW4ucGFnZT1mdW5jdGlvbihwYWdlbmFtZSl7XG5cdFx0XG5cdFx0JChcIi53ZXRqb2luXCIpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoXCJ3ZXRqb2luIHdldGpvaW5fcGFnZV9cIitwYWdlbmFtZSk7XG5cdFx0XG5cdFx0am9pbi52YXJzLnRva2VuPSAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl90b2tlblwiKS52YWwoKSB8fCBqb2luLnZhcnMudG9rZW47XG5cdFx0am9pbi52YXJzLm5hbWU9ICAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9uYW1lXCIgKS52YWwoKSB8fCBqb2luLnZhcnMubmFtZTtcblx0XHRqb2luLnZhcnMuZW1haWw9ICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2VtYWlsXCIpLnZhbCgpIHx8IGpvaW4udmFycy5lbWFpbDtcblx0XHRqb2luLnZhcnMucGFzcz0gICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Bhc3NcIiApLnZhbCgpIHx8IGpvaW4udmFycy5wYXNzO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fcGFnZVwiKS5lbXB0eSgpLmFwcGVuZCggam9pbi50ZW1wbGF0ZS5maW5kKFwiLndldGpvaW5fcGFnZV9cIitwYWdlbmFtZSkuY2xvbmUoKSApO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fdG9rZW5cIikudmFsKGpvaW4udmFycy50b2tlbik7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fbmFtZVwiICkudmFsKGpvaW4udmFycy5uYW1lKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9lbWFpbFwiKS52YWwoam9pbi52YXJzLmVtYWlsKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9wYXNzXCIgKS52YWwoam9pbi52YXJzLnBhc3MpO1xuXHRcdFxuXHRcdCQoXCIud2V0am9pbl9tYWluIC5zcGFuX3Rva2VuXCIpLnRleHQoam9pbi52YXJzLnRva2VuKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAuc3Bhbl9uYW1lXCIgKS50ZXh0KGpvaW4udmFycy5uYW1lKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAuc3Bhbl9lbWFpbFwiKS50ZXh0KGpvaW4udmFycy5lbWFpbCk7XG5cblx0XHRqb2luLmJpbmQoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0am9pbi5jYWxsYmFjaz1mdW5jdGlvbihjbWQsZGF0KXtcblx0XHRjb25zb2xlLmxvZyhjbWQsZGF0KTtcblx0XHRcblx0XHRpZihkYXQuZXJyb3IpXG5cdFx0e1xuXHRcdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fZXJyb3JcIikudGV4dCggZGF0LmVycm9yICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFx0XG5cblx0XHRpZihjbWQ9PVwiam9pblwiKXtcblx0XHRcdGpvaW4ucGFnZShcImpvaW4yXCIpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cImxvZ2luXCIpe1xuXHRcdFx0am9pbi5wYWdlKFwibG9naW4yXCIpO1xuXHRcdFx0XG5cdFx0XHR2YXIgcT1cIiZTPVwiK2RhdC5zZXNzaW9uO1xuXHRcdFx0XG5cdFx0XHRpZihqb2luLnFzW1wiY29udGludWVcIl0pXG5cdFx0XHR7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmPWpvaW4ucXNbXCJjb250aW51ZVwiXStxO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZj1cImh0dHA6Ly9mb3J1bS53ZXRnZW5lcy5jb20vP1wiK3E7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZihjbWQ9PVwiZm9yZ290XCIpe1xuXHRcdFx0am9pbi5wYWdlKFwiZm9yZ290MlwiKTtcblx0XHR9XG5cblx0fTtcblxuXHRqb2luLnN1Ym1pdD1mdW5jdGlvbihjbWQpe1xuXHRcdGNvbnNvbGUubG9nKGNtZCk7XG5cblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9lcnJvclwiKS50ZXh0KFwiXCIpO1xuXG5cdFx0dmFyIHRva2VuPSQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Rva2VuXCIpLnZhbCgpO1xuXHRcdHZhciBuYW1lPSAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9uYW1lXCIgKS52YWwoKTtcblx0XHR2YXIgZW1haWw9JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fZW1haWxcIikudmFsKCk7XG5cdFx0dmFyIHBhc3M9ICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Bhc3NcIiApLnZhbCgpO1xuXG5cdFx0aWYoY21kPT1cImpvaW5cIil7XG5cdFx0XHQkLnBvc3QoIGpvaW4udXNlcmFwaStcImNyZWF0ZVwiLHtcblx0XHRcdFx0XCJuYW1lXCI6bmFtZSxcImVtYWlsXCI6ZW1haWwsXCJwYXNzXCI6cGFzc1xuXHRcdFx0fSxmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGpvaW4uY2FsbGJhY2soXCJqb2luXCIsYSxiLGMpO30sXCJqc29uXCIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cImxvZ2luXCIpe1xuXHRcdFx0JC5wb3N0KCBqb2luLnVzZXJhcGkrXCJsb2dpblwiLHtcblx0XHRcdFx0XCJuYW1lXCI6bmFtZSxcImVtYWlsXCI6ZW1haWwsXCJwYXNzXCI6cGFzc1xuXHRcdFx0fSxmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGpvaW4uY2FsbGJhY2soXCJsb2dpblwiLGEsYixjKTt9LFwianNvblwiKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCJmb3Jnb3RcIil7XG5cdFx0XHQkLnBvc3QoIGpvaW4udXNlcmFwaStcInVwZGF0ZVwiLHtcblx0XHRcdFx0XCJuYW1lXCI6bmFtZSxcImVtYWlsXCI6ZW1haWwsXCJwYXNzXCI6cGFzc1xuXHRcdFx0fSxmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGpvaW4uY2FsbGJhY2soXCJmb3Jnb3RcIixhLGIsYyk7fSxcImpzb25cIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZihjbWQ9PVwidG9rZW5cIil7XG5cdFx0XHQkLnBvc3QoIGpvaW4udXNlcmFwaStcInRva2VuXCIse1xuXHRcdFx0XHRcInRva2VuXCI6dG9rZW5cblx0XHRcdH0sZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqb2luLmNhbGxiYWNrKFwidG9rZW5cIixhLGIsYyk7fSxcImpzb25cIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9O1xuXG5cdGpvaW4uYmluZD1mdW5jdGlvbigpe1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2hlYWRlcl9qb2luXCIgICkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4ucGFnZShcImpvaW5cIik7fSk7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5faGVhZGVyX2xvZ2luXCIgKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5wYWdlKFwibG9naW5cIik7fSk7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5faGVhZGVyX2ZvcmdvdFwiKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5wYWdlKFwiZm9yZ290XCIpO30pO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0X2xvZ2luXCIgKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5zdWJtaXQoXCJsb2dpblwiKTt9KTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRfam9pblwiICApLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnN1Ym1pdChcImpvaW5cIik7fSk7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0X2ZvcmdvdFwiKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5zdWJtaXQoXCJmb3Jnb3RcIik7fSk7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0X3Rva2VuXCIgKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5zdWJtaXQoXCJ0b2tlblwiKTt9KTtcblxuXHRcdC8vIGVudGVyIGluIGlucHV0cyB3aWxsIGF1dG8gZm9yY2UgYSBzdWJtaXRcblx0XHQkKFwiLndldGpvaW5fbWFpbiBpbnB1dFwiKS5vZmYoXCJrZXlwcmVzc1wiKS5vbihcImtleXByZXNzXCIsZnVuY3Rpb24oZSl7XG5cdFx0XHRpZihlLndoaWNoID09IDEzKVxuXHRcdFx0e1xuXHRcdFx0XHQkKHRoaXMpLmJsdXIoKTtcblx0XHRcdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0XCIpLmZvY3VzKCkuY2xpY2soKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXHRcblxuXHRqb2luLnRlbXBsYXRlLmxvYWQoXCJ0ZW1wbGF0ZS5odG1sXCIsam9pbi5maWxsKTtcblx0XG5cdHJldHVybiBqb2luO1xuXG59O1xuIl19
