
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var join={opts:opts};

//	require('./join.html.js').setup(join);

	join.template=$("<div></div>");
		
	join.fill=function(){
		opts.div.empty().append( join.template.find(".wetjoin_main").clone() );
		join.page("login")
	};

	join.page=function(pagename){
		$(".wetjoin_main .wetjoin_page").empty().append( join.template.find(".wetjoin_page_"+pagename).clone() );
		join.bind();
	};

	join.bind=function(){
		$(".wetjoin_main .wetjoin_header_join").off("click").on("click",function(){join.page("join");});
		$(".wetjoin_main .wetjoin_header_login").off("click").on("click",function(){join.page("login");});
		$(".wetjoin_main .wetjoin_header_forgot").off("click").on("click",function(){join.page("forgot");});
	};
	

	join.template.load("template.html",join.fill);

	return join;

};
