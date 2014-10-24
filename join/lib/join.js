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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3NoaS9oZy9qcy9qb2luL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9zaGkvaGcvanMvam9pbi9qcy9qb2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBscz1mdW5jdGlvbihhKSB7IGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdChhLHtkZXB0aDpudWxsfSkpOyB9XG5cbmV4cG9ydHMuc2V0dXA9ZnVuY3Rpb24ob3B0cyl7XG5cblx0dmFyIGpvaW49e29wdHM6b3B0c307XG5cbi8vIHBhcnNlIHF1ZXJ5IHN0cmluZ1xuXHRqb2luLnFzPXt9O1xuXHR2YXIgcXM9d2luZG93LmxvY2F0aW9uLmhyZWYuc2xpY2Uod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignPycpICsgMSkuc3BsaXQoJyYnKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHFzLmxlbmd0aDsgaSsrKVxuXHR7XG5cdFx0dmFyIHE9cXNbaV0uc3BsaXQoXCI9XCIpO1xuXHRcdGpvaW4ucXNbIHFbMF0gXT1xWzFdO1xuXHR9XG5cdFxuXHRqb2luLnZhcnM9e31cblxuLy9cdHJlcXVpcmUoJy4vam9pbi5odG1sLmpzJykuc2V0dXAoam9pbik7XG5cblx0am9pbi51c2VyYXBpPVwiaHR0cDovL2hvc3QubG9jYWw6MTQwOC9nZW5lcy91c2VyL1wiO1xuXG5cdGpvaW4udGVtcGxhdGU9JChcIjxkaXY+PC9kaXY+XCIpO1xuXHRcdFxuXHRqb2luLmZpbGw9ZnVuY3Rpb24oKXtcblx0XHRvcHRzLmRpdi5lbXB0eSgpLmFwcGVuZCggam9pbi50ZW1wbGF0ZS5maW5kKFwiLndldGpvaW5fbWFpblwiKS5jbG9uZSgpICk7XG5cblx0XHRjb25zb2xlLmxvZyhqb2luLnFzKTtcblx0XHRpZihqb2luLnFzLnRva2VuKVxuXHRcdHtcblx0XHRcdGpvaW4udmFycy50b2tlbj1qb2luLnFzLnRva2VuO1xuXHRcdFx0am9pbi5wYWdlKFwidG9rZW5cIik7XG5cdFx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9zdWJtaXRcIikuZm9jdXMoKS5jbGljaygpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0am9pbi5wYWdlKFwibG9naW5cIik7XG5cdFx0fVxuXG5cdH07XG5cblx0am9pbi5wYWdlPWZ1bmN0aW9uKHBhZ2VuYW1lKXtcblx0XHRqb2luLnZhcnMudG9rZW49ICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Rva2VuXCIpLnZhbCgpIHx8IGpvaW4udmFycy50b2tlbjtcblx0XHRqb2luLnZhcnMubmFtZT0gICQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX25hbWVcIiApLnZhbCgpIHx8IGpvaW4udmFycy5uYW1lO1xuXHRcdGpvaW4udmFycy5lbWFpbD0gJChcIi53ZXRqb2luX21haW4gLndldGpvaW5fZW1haWxcIikudmFsKCkgfHwgam9pbi52YXJzLmVtYWlsO1xuXHRcdGpvaW4udmFycy5wYXNzPSAgJChcIi53ZXRqb2luX21haW4gLndldGpvaW5fcGFzc1wiICkudmFsKCkgfHwgam9pbi52YXJzLnBhc3M7XG5cblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9wYWdlXCIpLmVtcHR5KCkuYXBwZW5kKCBqb2luLnRlbXBsYXRlLmZpbmQoXCIud2V0am9pbl9wYWdlX1wiK3BhZ2VuYW1lKS5jbG9uZSgpICk7XG5cblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl90b2tlblwiKS52YWwoam9pbi52YXJzLnRva2VuKTtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9uYW1lXCIgKS52YWwoam9pbi52YXJzLm5hbWUpO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2VtYWlsXCIpLnZhbChqb2luLnZhcnMuZW1haWwpO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3Bhc3NcIiApLnZhbChqb2luLnZhcnMucGFzcyk7XG5cblx0XHRqb2luLmJpbmQoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0am9pbi5jYWxsYmFjaz1mdW5jdGlvbihjbWQsZGF0KXtcblx0XHRjb25zb2xlLmxvZyhjbWQsZGF0KTtcblx0XHRcblx0XHRpZihkYXQuZXJyb3IpXG5cdFx0e1xuXHRcdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fZXJyb3JcIikudGV4dCggZGF0LmVycm9yICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFx0XG5cblx0XHRpZihjbWQ9PVwiam9pblwiKXtcblx0XHRcdGpvaW4ucGFnZShcImpvaW4yXCIpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cImxvZ2luXCIpe1xuXHRcdFx0am9pbi5wYWdlKFwibG9naW4yXCIpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cImZvcmdvdFwiKXtcblx0XHRcdGpvaW4ucGFnZShcImZvcmdvdDJcIik7XG5cdFx0fVxuXG5cdH07XG5cblx0am9pbi5zdWJtaXQ9ZnVuY3Rpb24oY21kKXtcblx0XHRjb25zb2xlLmxvZyhjbWQpO1xuXG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fZXJyb3JcIikudGV4dChcIlwiKTtcblxuXHRcdHZhciB0b2tlbj0kKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl90b2tlblwiKS52YWwoKTtcblx0XHR2YXIgbmFtZT0gJChcIi53ZXRqb2luX21haW4gLndldGpvaW5fbmFtZVwiICkudmFsKCk7XG5cdFx0dmFyIGVtYWlsPSQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2VtYWlsXCIpLnZhbCgpO1xuXHRcdHZhciBwYXNzPSAkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9wYXNzXCIgKS52YWwoKTtcblxuXHRcdGlmKGNtZD09XCJqb2luXCIpe1xuXHRcdFx0JC5wb3N0KCBqb2luLnVzZXJhcGkrXCJjcmVhdGVcIix7XG5cdFx0XHRcdFwibmFtZVwiOm5hbWUsXCJlbWFpbFwiOmVtYWlsLFwicGFzc1wiOnBhc3Ncblx0XHRcdH0sZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqb2luLmNhbGxiYWNrKFwiam9pblwiLGEsYixjKTt9LFwianNvblwiKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCJsb2dpblwiKXtcblx0XHRcdCQucG9zdCggam9pbi51c2VyYXBpK1wibG9naW5cIix7XG5cdFx0XHRcdFwibmFtZVwiOm5hbWUsXCJlbWFpbFwiOmVtYWlsLFwicGFzc1wiOnBhc3Ncblx0XHRcdH0sZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqb2luLmNhbGxiYWNrKFwibG9naW5cIixhLGIsYyk7fSxcImpzb25cIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZihjbWQ9PVwiZm9yZ290XCIpe1xuXHRcdFx0JC5wb3N0KCBqb2luLnVzZXJhcGkrXCJ1cGRhdGVcIix7XG5cdFx0XHRcdFwibmFtZVwiOm5hbWUsXCJlbWFpbFwiOmVtYWlsLFwicGFzc1wiOnBhc3Ncblx0XHRcdH0sZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqb2luLmNhbGxiYWNrKFwiZm9yZ290XCIsYSxiLGMpO30sXCJqc29uXCIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cInRva2VuXCIpe1xuXHRcdFx0JC5wb3N0KCBqb2luLnVzZXJhcGkrXCJ0b2tlblwiLHtcblx0XHRcdFx0XCJ0b2tlblwiOnRva2VuXG5cdFx0XHR9LGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gam9pbi5jYWxsYmFjayhcInRva2VuXCIsYSxiLGMpO30sXCJqc29uXCIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRqb2luLmJpbmQ9ZnVuY3Rpb24oKXtcblx0XHQkKFwiLndldGpvaW5fbWFpbiAud2V0am9pbl9oZWFkZXJfam9pblwiICApLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe3JldHVybiBqb2luLnBhZ2UoXCJqb2luXCIpO30pO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2hlYWRlcl9sb2dpblwiICkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4ucGFnZShcImxvZ2luXCIpO30pO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX2hlYWRlcl9mb3Jnb3RcIikub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4ucGFnZShcImZvcmdvdFwiKTt9KTtcblxuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3N1Ym1pdF9sb2dpblwiICkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4uc3VibWl0KFwibG9naW5cIik7fSk7XG5cdFx0JChcIi53ZXRqb2luX21haW4gLndldGpvaW5fc3VibWl0X2pvaW5cIiAgKS5vZmYoXCJjbGlja1wiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gam9pbi5zdWJtaXQoXCJqb2luXCIpO30pO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3N1Ym1pdF9mb3Jnb3RcIikub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4uc3VibWl0KFwiZm9yZ290XCIpO30pO1xuXHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3N1Ym1pdF90b2tlblwiICkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGpvaW4uc3VibWl0KFwidG9rZW5cIik7fSk7XG5cblx0XHQvLyBlbnRlciBpbiBpbnB1dHMgd2lsbCBhdXRvIGZvcmNlIGEgc3VibWl0XG5cdFx0JChcIi53ZXRqb2luX21haW4gaW5wdXRcIikub2ZmKFwia2V5cHJlc3NcIikub24oXCJrZXlwcmVzc1wiLGZ1bmN0aW9uKGUpe1xuXHRcdFx0aWYoZS53aGljaCA9PSAxMylcblx0XHRcdHtcblx0XHRcdFx0JCh0aGlzKS5ibHVyKCk7XG5cdFx0XHRcdCQoXCIud2V0am9pbl9tYWluIC53ZXRqb2luX3N1Ym1pdFwiKS5mb2N1cygpLmNsaWNrKCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblx0XG5cblx0am9pbi50ZW1wbGF0ZS5sb2FkKFwidGVtcGxhdGUuaHRtbFwiLGpvaW4uZmlsbCk7XG5cdFxuXHRyZXR1cm4gam9pbjtcblxufTtcbiJdfQ==
