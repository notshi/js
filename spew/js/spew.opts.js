
exports.setup=function(spew){


var opts=exports;


	var opts_save={"show_icons":true,"show_imgs":true,"small_font":true,"full_size":true,"chat_only":true,"big_text":true,"video_in_chat":true};
	spew.opts={};
	spew.reset_opts=function()
	{
		for(i in opts_save )
		{
			spew.opts[i]=undefined;
		}
		spew.opts["show_icons"]=true;
		spew.opts["show_imgs"]=true;
		spew.opts["small_font"]=false;
		spew.opts["big_text"]=false;
		spew.opts["full_size"]=false;
		spew.opts["chat_only"]=false;
		spew.opts["video_in_chat"]=false;
		spew.opts["cmdlog"]=[];
		spew.opts["tv"]=true;
	}
	spew.reset_opts();
	for(i in opts) { spew.opts[i]=opts[i]; } // override opts
	
	
	spew.save_opts=function()
	{
		if(!spew.storage_available) { return; }
		if(!spew.json_available) { return; }
		
		var opts={};
		
		for(i in opts_save )
		{
			opts[i]=spew.opts[i];
		}
		opts["S"]=spew.opts["S"];
		opts["cmdlog"]=spew.opts["cmdlog"];
		
		var s=JSON.stringify(opts);
		window.localStorage["wetspew_opts"]=s;
//console.log("saved "+s);
	}
	
	spew.load_opts=function()
	{
		var gets={};
		var save=false;
		// get session from url
		var s = window.location.href.toString().split('?');
		if(s[1])
		{
			gets=spew.str_to_msg(s[1]);
		}

// set here in case we do not have localstorage
		if(gets["confirm"])
		{
			spew.opts.S=gets["confirm"];
			save=true;
		}
		if(!spew.storage_available) { return; }
		if(!spew.json_available) { return; }
		
		var s=window.localStorage["wetspew_opts"];
		if(typeof(s)=="string")
		{
			var opts=JSON.parse(s);
//console.log("loaded "+s);

			for(i in opts)
			{
				spew.opts[i]=opts[i];
			}
		}
// make sure that the url overrides
		if(gets["confirm"])
		{
			spew.opts.S=gets["confirm"];
			save=true;
		}
			
		if(save){spew.save_opts()} // need to save?
	}
	
	spew.make_css_from_opts=function()
	{
		var s="";
				
		if(spew.opts.small_font)
		{
			s+=" .wetspew { font-size: 10px; } .wetspew_line { margin-bottom:1px; } ";
		}
		if(!spew.opts.show_icons)
		{
			s+=" .wetspew_icon { display:none; } ";
		}
		if(!spew.opts.show_imgs)
		{
			s+=" .wetspew_autoimg { display:none; } ";
		}
		if(spew.opts.full_size)
		{
			s+=" .wetspew { width:100%; height:100%; top:0px; left:0px; right:0px; bottom:0px; 	margin:auto; position:fixed; } ";
			s+=" .wetspew_wetv { width:67%; height:100%; } ";
			s+=" .wetspew_spew { width:33%; height:100%; } ";
			s+=" html,body { overflow:hidden; } ";
		}
		spew.opts.tv=true;
		if(spew.opts.chat_only)
		{
			spew.opts.tv=false;
			s+=" .wetspew_wetv { display:none; } ";
			s+=" .wetspew_spew { width:100%; height:100%; } ";
		}
		if( spew.opts.video_in_chat )
		{
			s+=" .wetspew_wetv { display:block; width:50%; height:50%; position:absolute; left:50%; top:10px; } ";
			s+=" .wetspew_spew { width:100%; height:100%; } ";
		}
		if(spew.opts.big_text)
		{
			s+=" .wetspew { font-size: 32px; } .wetspew_line { margin-bottom:0px; } ";
			s+=" .wetspew_icon { width:32px; height:32px; } ";
			if(spew.opts.small_font)
			{
				s+=" .wetspew { font-size: 16px; } ";
			}
		}
		spew.div_css.empty().append($("<style>"+s+"</style>"));
	}


	spew.show_opts=function()
	{
		spew.div_opts.empty();
		spew.div_opts.append("<a class=\"spew_click\" title=\"chat\">Return to chat.</a>");
		for(i in opts_save )
		{
			var n=i;
			var v=spew.opts[i]?"ON":"OFF"
			spew.div_opts.append("<a title=\""+n+"\">"+n+" : "+v+"</a>");
		}
		spew.div_opts.append("<a title=\"reset\">Reset options</a>");

		spew.div_main.empty();
		spew.div_main.append(spew.div_opts);
		
		$(".wetspew_opts a").click(spew.click_opts);
	}
	
	spew.click_opts=function()
	{
		var txt=$(this).attr("title").toLowerCase();
		
		if(txt=="reset")
		{
			spew.reset_opts();
		}
		else
		if(opts_save[txt])
		{
			spew.opts[txt]=spew.opts[txt]?false:true; // toggle
		}
		
		spew.make_css_from_opts();
		spew.show_tab("opts");
		spew.save_opts();
//console.log("opts "+txt);
		return false;
	}


};
