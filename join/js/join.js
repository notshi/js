
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var join={opts:opts};
	
	join.vars={}

//	require('./join.html.js').setup(join);

	join.userapi="http://host.local:1408/genes/user/";

	join.template=$("<div></div>");
		
	join.fill=function(){
		opts.div.empty().append( join.template.find(".wetjoin_main").clone() );
		join.page("login")
	};

	join.page=function(pagename){
		join.vars.name= $(".wetjoin_main .wetjoin_name" ).val() || join.vars.name;
		join.vars.email=$(".wetjoin_main .wetjoin_email").val() || join.vars.email;
		join.vars.pass= $(".wetjoin_main .wetjoin_pass" ).val() || join.vars.pass;

		$(".wetjoin_main .wetjoin_page").empty().append( join.template.find(".wetjoin_page_"+pagename).clone() );

		$(".wetjoin_main .wetjoin_name" ).val(join.vars.name);
		$(".wetjoin_main .wetjoin_email").val(join.vars.email);
		$(".wetjoin_main .wetjoin_pass" ).val(join.vars.pass);

		join.bind();
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

		var name= $(".wetjoin_main .wetjoin_name" ).val();
		var email=$(".wetjoin_main .wetjoin_email").val();
		var pass= $(".wetjoin_main .wetjoin_pass" ).val();

		if(cmd=="join"){
			$.post( join.userapi+"create",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("join",a,b,c);},"json");
		}
		else
		if(cmd=="login"){
			$.post( join.userapi+"login",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("login",a,b,c);},"json");
		}
		else
		if(cmd=="forgot"){
			$.post( join.userapi+"update",{
				"name":name,"email":email,"pass":pass
			},function(a,b,c){return join.callback("forgot",a,b,c);},"json");
		}
	};

	join.bind=function(){
		$(".wetjoin_main .wetjoin_header_join"  ).off("click").on("click",function(){join.page("join");});
		$(".wetjoin_main .wetjoin_header_login" ).off("click").on("click",function(){join.page("login");});
		$(".wetjoin_main .wetjoin_header_forgot").off("click").on("click",function(){join.page("forgot");});

		$(".wetjoin_main .wetjoin_submit_login" ).off("click").on("click",function(){join.submit("login");});
		$(".wetjoin_main .wetjoin_submit_join"  ).off("click").on("click",function(){join.submit("join");});
		$(".wetjoin_main .wetjoin_submit_forgot").off("click").on("click",function(){join.submit("forgot");});

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
