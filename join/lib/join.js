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
		join.vars.token= $(".wetjoin_main .wetjoin_token").val() || join.vars.token;
		join.vars.name=  $(".wetjoin_main .wetjoin_name" ).val() || join.vars.name;
		join.vars.email= $(".wetjoin_main .wetjoin_email").val() || join.vars.email;
		join.vars.pass=  $(".wetjoin_main .wetjoin_pass" ).val() || join.vars.pass;

		$(".wetjoin_main .wetjoin_page").empty().append( join.template.find(".wetjoin_page_"+pagename).clone() );

		$(".wetjoin_main .wetjoin_token").val(join.vars.token);
		$(".wetjoin_main .wetjoin_name" ).val(join.vars.name);
		$(".wetjoin_main .wetjoin_email").val(join.vars.email);
		$(".wetjoin_main .wetjoin_pass" ).val(join.vars.pass);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2pvaW4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2pvaW4vanMvam9pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgbHM9ZnVuY3Rpb24oYSkgeyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoYSx7ZGVwdGg6bnVsbH0pKTsgfVxuXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKG9wdHMpe1xuXG5cdHZhciBqb2luPXtvcHRzOm9wdHN9O1xuXG4vLyBwYXJzZSBxdWVyeSBzdHJpbmdcblx0am9pbi5xcz17fTtcblx0dmFyIHFzPXdpbmRvdy5sb2NhdGlvbi5ocmVmLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKSArIDEpLnNwbGl0KCcmJyk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBxcy5sZW5ndGg7IGkrKylcblx0e1xuXHRcdHZhciBxPXFzW2ldLnNwbGl0KFwiPVwiKTtcblx0XHRqb2luLnFzWyBxWzBdIF09cVsxXTtcblx0fVxuXHRcblx0am9pbi52YXJzPXt9XG5cbi8vXHRyZXF1aXJlKCcuL2pvaW4uaHRtbC5qcycpLnNldHVwKGpvaW4pO1xuXG5cdGpvaW4udXNlcmFwaT1cImh0dHA6Ly9ob3N0LmxvY2FsOjE0MDgvZ2VuZXMvdXNlci9cIjtcblxuXHRqb2luLnRlbXBsYXRlPSQoXCI8ZGl2PjwvZGl2PlwiKTtcblx0XHRcblx0am9pbi5maWxsPWZ1bmN0aW9uKCl7XG5cdFx0b3B0cy5kaXYuZW1wdHkoKS5hcHBlbmQoIGpvaW4udGVtcGxhdGUuZmluZChcIi53ZXRqb2luX21haW5cIikuY2xvbmUoKSApO1xuXG5cdFx0Y29uc29sZS5sb2coam9pbi5xcyk7XG5cdFx0aWYoam9pbi5xcy50b2tlbilcblx0XHR7XG5cdFx0XHRqb2luLnZhcnMudG9rZW49am9pbi5xcy50b2tlbjtcblx0XHRcdGpvaW4ucGFnZShcInRva2VuXCIpO1xuXHRcdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0XCIpLmZvY3VzKCkuY2xpY2soKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGpvaW4ucGFnZShcImxvZ2luXCIpO1xuXHRcdH1cblxuXHR9O1xuXG5cdGpvaW4ucGFnZT1mdW5jdGlvbihwYWdlbmFtZSl7XG5cdFx0am9pbi52YXJzLnRva2VuPSAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl90b2tlblwiKS52YWwoKSB8fCBqb2luLnZhcnMudG9rZW47XG5cdFx0am9pbi52YXJzLm5hbWU9ICAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9uYW1lXCIgKS52YWwoKSB8fCBqb2luLnZhcnMubmFtZTtcblx0XHRqb2luLnZhcnMuZW1haWw9ICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2VtYWlsXCIpLnZhbCgpIHx8IGpvaW4udmFycy5lbWFpbDtcblx0XHRqb2luLnZhcnMucGFzcz0gICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Bhc3NcIiApLnZhbCgpIHx8IGpvaW4udmFycy5wYXNzO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fcGFnZVwiKS5lbXB0eSgpLmFwcGVuZCggam9pbi50ZW1wbGF0ZS5maW5kKFwiLndldGpvaW5fcGFnZV9cIitwYWdlbmFtZSkuY2xvbmUoKSApO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fdG9rZW5cIikudmFsKGpvaW4udmFycy50b2tlbik7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fbmFtZVwiICkudmFsKGpvaW4udmFycy5uYW1lKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9lbWFpbFwiKS52YWwoam9pbi52YXJzLmVtYWlsKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9wYXNzXCIgKS52YWwoam9pbi52YXJzLnBhc3MpO1xuXG5cdFx0am9pbi5iaW5kKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGpvaW4uY2FsbGJhY2s9ZnVuY3Rpb24oY21kLGRhdCl7XG5cdFx0Y29uc29sZS5sb2coY21kLGRhdCk7XG5cdFx0XG5cdFx0aWYoZGF0LmVycm9yKVxuXHRcdHtcblx0XHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2Vycm9yXCIpLnRleHQoIGRhdC5lcnJvciApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcdFxuXG5cdFx0aWYoY21kPT1cImpvaW5cIil7XG5cdFx0XHRqb2luLnBhZ2UoXCJqb2luMlwiKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCJsb2dpblwiKXtcblx0XHRcdGpvaW4ucGFnZShcImxvZ2luMlwiKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCJmb3Jnb3RcIil7XG5cdFx0XHRqb2luLnBhZ2UoXCJmb3Jnb3QyXCIpO1xuXHRcdH1cblxuXHR9O1xuXG5cdGpvaW4uc3VibWl0PWZ1bmN0aW9uKGNtZCl7XG5cdFx0Y29uc29sZS5sb2coY21kKTtcblxuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2Vycm9yXCIpLnRleHQoXCJcIik7XG5cblx0XHR2YXIgdG9rZW49JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fdG9rZW5cIikudmFsKCk7XG5cdFx0dmFyIG5hbWU9ICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX25hbWVcIiApLnZhbCgpO1xuXHRcdHZhciBlbWFpbD0kKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9lbWFpbFwiKS52YWwoKTtcblx0XHR2YXIgcGFzcz0gJChcIi53ZXRqb2luX21haW4gLndldGpvaW5fcGFzc1wiICkudmFsKCk7XG5cblx0XHRpZihjbWQ9PVwiam9pblwiKXtcblx0XHRcdCQucG9zdCggam9pbi51c2VyYXBpK1wiY3JlYXRlXCIse1xuXHRcdFx0XHRcIm5hbWVcIjpuYW1lLFwiZW1haWxcIjplbWFpbCxcInBhc3NcIjpwYXNzXG5cdFx0XHR9LGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gam9pbi5jYWxsYmFjayhcImpvaW5cIixhLGIsYyk7fSxcImpzb25cIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZihjbWQ9PVwibG9naW5cIil7XG5cdFx0XHQkLnBvc3QoIGpvaW4udXNlcmFwaStcImxvZ2luXCIse1xuXHRcdFx0XHRcIm5hbWVcIjpuYW1lLFwiZW1haWxcIjplbWFpbCxcInBhc3NcIjpwYXNzXG5cdFx0XHR9LGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gam9pbi5jYWxsYmFjayhcImxvZ2luXCIsYSxiLGMpO30sXCJqc29uXCIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cImZvcmdvdFwiKXtcblx0XHRcdCQucG9zdCggam9pbi51c2VyYXBpK1widXBkYXRlXCIse1xuXHRcdFx0XHRcIm5hbWVcIjpuYW1lLFwiZW1haWxcIjplbWFpbCxcInBhc3NcIjpwYXNzXG5cdFx0XHR9LGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gam9pbi5jYWxsYmFjayhcImZvcmdvdFwiLGEsYixjKTt9LFwianNvblwiKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCJ0b2tlblwiKXtcblx0XHRcdCQucG9zdCggam9pbi51c2VyYXBpK1widG9rZW5cIix7XG5cdFx0XHRcdFwidG9rZW5cIjp0b2tlblxuXHRcdFx0fSxmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGpvaW4uY2FsbGJhY2soXCJ0b2tlblwiLGEsYixjKTt9LFwianNvblwiKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH07XG5cblx0am9pbi5iaW5kPWZ1bmN0aW9uKCl7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5faGVhZGVyX2pvaW5cIiAgKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5wYWdlKFwiam9pblwiKTt9KTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9oZWFkZXJfbG9naW5cIiApLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnBhZ2UoXCJsb2dpblwiKTt9KTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9oZWFkZXJfZm9yZ290XCIpLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnBhZ2UoXCJmb3Jnb3RcIik7fSk7XG5cblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRfbG9naW5cIiApLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnN1Ym1pdChcImxvZ2luXCIpO30pO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3N1Ym1pdF9qb2luXCIgICkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4uc3VibWl0KFwiam9pblwiKTt9KTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRfZm9yZ290XCIpLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnN1Ym1pdChcImZvcmdvdFwiKTt9KTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRfdG9rZW5cIiApLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnN1Ym1pdChcInRva2VuXCIpO30pO1xuXG5cdFx0Ly8gZW50ZXIgaW4gaW5wdXRzIHdpbGwgYXV0byBmb3JjZSBhIHN1Ym1pdFxuXHRcdCQoXCIud2V0am9pbl9tYWluIGlucHV0XCIpLm9mZihcImtleXByZXNzXCIpLm9uKFwia2V5cHJlc3NcIixmdW5jdGlvbihlKXtcblx0XHRcdGlmKGUud2hpY2ggPT0gMTMpXG5cdFx0XHR7XG5cdFx0XHRcdCQodGhpcykuYmx1cigpO1xuXHRcdFx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRcIikuZm9jdXMoKS5jbGljaygpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cdFxuXG5cdGpvaW4udGVtcGxhdGUubG9hZChcInRlbXBsYXRlLmh0bWxcIixqb2luLmZpbGwpO1xuXHRcblx0cmV0dXJuIGpvaW47XG5cbn07XG4iXX0=
