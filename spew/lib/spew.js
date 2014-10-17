require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

exports.setup=function(spew){

	spew.click_login=function()
	{
		var txt=$(this).html().toLowerCase();
		if(txt=="yes")
		{
			spew.show_tab("chat");
			spew.send_msg(spew.cmd_to_msg("/login "+spew.name));
		}
		else
		{
//			spew.show_tab("chat");
			window.location=("http://lua.wetgenes.com/dumid.lua?continue="+window.location);
//			window.location=("http://api.wetgenes.com:1408/genes/dumid?continue="+window.location);
		}
//console.log("txt "+txt);
		return false;
	}
	
	spew.click_room=function()
	{
		var room=$(this).html().toLowerCase();
		spew.send_msg(spew.cmd_to_msg("/join "+room));
		spew.show_tab("chat");
//console.log("room "+room);
		return false;
	}
	
	spew.click_tab=function()
	{
		var tab=$(this).html().toLowerCase();

		if(tab=="fix")
		{
			spew.ytapi=undefined;
			spew.ytapi_count=9999;
			$("#wetspew_wetv").replaceWith("<div class=\"wetspew_wetv\" id=\"wetspew_wetv\" ></div>");
			return false;
//			spew.send_msg(spew.cmd_to_msg("/users"));
		}
		
		spew.show_tab(tab);
		
		if(tab=="users")
		{
			spew.send_msg(spew.cmd_to_msg("/users"));
		}
		else
		if(tab=="rooms")
		{
			spew.send_msg(spew.cmd_to_msg("/rooms"));
		}
//console.log($(this).html());

	}
	
	spew.click=function()
	{
		var txt=$(this).attr("title").toLowerCase();
		
		if(txt=="chat")
		{
			spew.show_tab("chat");
		}
		
		return false;
	}
	
	spew.show_tab=function(tab)
	{
		if(tab=="help")
		{
			spew.div_main.empty();
			spew.div_main.append(spew.div_help);
		}
		else
		if(tab=="news")
		{
			spew.div_main.empty();
			spew.div_main.append(spew.div_news);
		}
		else
		if(tab=="users")
		{
			spew.div_main.empty();
			spew.div_main.append(spew.div_users);
		}
		else
		if(tab=="rooms")
		{
			spew.div_main.empty();
			spew.div_main.append(spew.div_rooms);
			$(".wetspew_rooms .wetspew_line .wetspew_name").click(spew.click_room);
		}
		else
		if(tab=="opts")
		{
			spew.show_opts();
		}
		else
		if(tab=="login")
		{
			spew.div_main.empty();
			spew.name=spew.random_name();
			var login_html="<div class=\"wetspew_login\">"+
			"Hello, "+
			"<span class=\"wetspew_login_name\">"+spew.name+"</span>"+
			" Is that your name? "+
			"<span class=\"wetspew_login_buttons\">"+
			" <a class=\"wetspew_login_yes\">YES</a> "+
			" <a class=\"wetspew_login_no\">NO</a> "+
			"</span>"+
			"</div>";
			spew.div_main.append($(login_html));
			$(".wetspew_login_buttons a").click(spew.click_login);
		}
		else
		{
			spew.div_main.empty();
			spew.div_main.append(spew.div_chat);
			spew.div_chat[0].scrollTop = spew.div_chat[0].scrollHeight; // scroll to bottom
			spew.sticky_bottom=true;			
			var last_height=0;
			spew.div_chat.scroll(function(){
				if(last_height==spew.div_chat[0].scrollHeight) // height must be constant for us to care
				{
					var oldtop=spew.div_chat[0].scrollTop;
					var oldheight=spew.div_chat[0].scrollHeight-spew.div_chat[0].offsetHeight;
					if(oldtop>=(oldheight)) // sticky when at bottom
					{
						spew.sticky_bottom=true;
					}
					else
					{
						spew.sticky_bottom=false;
					}
				}
				else // remain stuck
				{
					if(spew.sticky_bottom)
					{
						spew.div_chat[0].scrollTop = spew.div_chat[0].scrollHeight; // scroll to bottom
					}
				}
				last_height=spew.div_chat[0].scrollHeight;
//console.log(spew.sticky_bottom);
			});
		}
		$(".spew_click").click(spew.click); // make sure default clicks still work
	}

	spew.autoHTMLimg=function(url){

		var urlink='<a href="'+url+'" target="_blank">'+url+'</a>';
		
		if( spew.filesizes[ url ] )
		{
			if( spew.filesizes[ url ] >= spew.max_image_size)
			{
				return urlink;
			}
		}
		else
		{
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', url, true);
			xhr.onreadystatechange = function(){
				var size=0;
				if ( xhr.readyState == 4 ) {
					if ( xhr.status == 200 ) {
						
						size=Math.floor(xhr.getResponseHeader('Content-Length'));
						
						spew.filesizes[ url ] = size ;
						
						if( size >= spew.max_image_size) // disable?
						{
							$(".wetspew_autoimg").each(function(){ // find big images and disable them
								if($(this).attr("src")==url)
								{
									$(this).replaceWith( urlink );
								}
							});
						}
					}
				}
			};
			xhr.send(null);			
		}
		
		return '<a href="'+url+'" target="_blank"><img style="max-height:33%;max-width:100%;" class="wetspew_autoimg" src="'+url+'" /></a>';

	}
	
	spew.autoHTMLlinks=function(s){
		var sn="";
		var fb=function(url){
			if(url.match(/(jpg|png|gif|jpeg)$/i)) // it is probably an image, embed it via bouncer
			{
				return spew.autoHTMLimg(url);
			}			
			return '<a href="'+url+'" target="_blank">'+url+'</a>';
		}
		sn=s.replace(/(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*)/gim, fb);
/*
		if(sn==s) // try again if nothing changed
		{
			sn=s.replace(/(www\.[\S]+(\b|$))/gim, fb);
		}
*/
		return sn;
	}
	spew.escapeHTML=function(s) {
		var div = document.createElement('div');
		var text = document.createTextNode(s);
		div.appendChild(text);
		return div.innerHTML;
	}
	
	spew.display=function(l) {
		if(l)
		{
			spew.div_chat.append("<div class=\"wetspew_line\">"+l+"</div>");
			while(spew.div_chat[0].scrollHeight>16384) // max height, remove old lines
			{
				spew.div_chat.children("div:first-child").remove();
			}
			if(spew.sticky_bottom)
			{
				spew.div_chat[0].scrollTop = spew.div_chat[0].scrollHeight; // scroll to bottom
			}
		}
	}
	spew.display_note=function(l) {
		if(l) { spew.display('<span style="color:#0f0">'+l+'</span>'); }
     }
     
	spew.dark_rgb=function(rgb){
		var r=parseInt(rgb.substr(0,1),16);
		var g=parseInt(rgb.substr(1,1),16);
		var b=parseInt(rgb.substr(2,1),16);		
		
		if(r+g+b>30)
		{
			var nr=r;
			var ng=g;
			var nb=b;
			
			r=15-Math.floor((ng+nb)/2);
			g=15-Math.floor((nr+nb)/2);
			b=15-Math.floor((nr+ng)/2);
		}
		return r.toString(16)+g.toString(16)+b.toString(16);
	}

	spew.html_setup=function(opts)
	{
		for(i in opts) { spew.opts[i]=opts[i]; } // overide opts
		spew.load_opts();
				
		spew.server_address="ws://"+opts.host+":5223/";
		spew.div=$(opts.div);
						
		spew.div_spew=$("<div class=\"wetspew_spew\"></div>");
		spew.div_wetv=$("<div class=\"wetspew_wetv\" id=\"wetspew_wetv\" ></div>");


		spew.div_tabs=$("<div class=\"wetspew_tabs\"><a>FIX</a><a>CHAT</a><a>USERS</a><a>ROOMS</a><a>OPTS</a><a>HELP</a><a>NEWS</a></div>");
		spew.div_css=$("<div style=\"display:none;\"></div>");
		spew.make_css_from_opts();		
		spew.div_main=$("<div class=\"wetspew_main\"></div>");
		spew.div_help=$("<div class=\"wetspew_help\"></div>");
		spew.div_news=$("<div class=\"wetspew_news\"></div>");
		spew.div_chat=$("<div class=\"wetspew_chat\"></div>");
		spew.div_users=$("<div class=\"wetspew_users\"></div>");
		spew.div_rooms=$("<div class=\"wetspew_rooms\"></div>");
		spew.div_opts=$("<div class=\"wetspew_opts\"></div>");
		spew.div_talk=$("<div class=\"wetspew_type\"></div>");
		spew.div_talk_form=$("<form></form>");
		spew.div_talk_form_input=$("<input type=\"text\" />");
		spew.div_talk.append(spew.div_talk_form);
		spew.div_talk_form.append(spew.div_talk_form_input);

		spew.div_help.html("<iframe style=\"width:100%;height:100%\" src=\"http://api.wetgenes.com:1408/genes/help\"></iframe>");
		spew.div_news.html("<iframe style=\"width:100%;height:100%\" src=\"http://wet.appspot.com/news.frame\"></iframe>");

		spew.div_spew.append(spew.div_css);
		spew.div_spew.append(spew.div_tabs);
		spew.div_spew.append(spew.div_main);
		spew.div_spew.append(spew.div_talk);
		
		spew.div.empty();
		spew.div.append(spew.div_spew);
		spew.div.append(spew.div_wetv);
	
		var cmdlog_off=spew.opts["cmdlog"].length;
		var tab_set=-1;
		var tab_s="";
		var tab_bg="";
		var tab_ed="";
		spew.div_talk_form.submit(function(e){
			var cl=spew.opts["cmdlog"]; // most recent at the bottom
			cl.push(spew.div_talk_form_input.val());
			while(cl.length>32)
			{
				cl.splice(0,1);
			}
			spew.save_opts();
			cmdlog_off=cl.length;
//console.log(cl.length);
		});
		spew.div_talk_form_input.keydown(function(e){
			spew.div_chat[0].scrollTop = spew.div_chat[0].scrollHeight; // scroll to bottom
			spew.sticky_bottom=true;
//console.log(e.which);
			if(e.which!=9){tab_set=-1;} // disable tab history on any other key than tab
			switch(e.which)
			{
				case 9: //tab
					if(tab_set==-1) // first tab
					{
						tab_s=spew.div_talk_form_input.val();
						tab_ed=tab_s.match(/\w+$/);
						if(tab_ed)
						{
							tab_ed=tab_ed.toString().toLowerCase()
							tab_bg=tab_s.substr(0,tab_s.length-tab_ed.length);
						}
					}
					else // next tab
					{
					}
					
					if( tab_ed )
					{
						var num=0;
						for( n in spew.users )
						{
							if( n.substr(0,tab_ed.length).toLowerCase()==tab_ed )
							{
								if(num>=tab_set)
								{
									if(tab_set==-1){tab_set++;} // mark as active now
									tab_set++;
									spew.div_talk_form_input.val(tab_bg+n);
									return false;
								}
								num++;
							}
						}
						if(tab_set>-1) // we found one before, so wrap
						{
							tab_set=0;
							spew.div_talk_form_input.val(tab_s);
						}
//console.log(ed);
					}
					return false;
				break;
				case 37: //left
				break;
				case 38: //up
					var cl=spew.opts["cmdlog"]; // most recent at the bottom
					var s=""
					cmdlog_off-=1;
					if(cmdlog_off<0) { cmdlog_off=0; }
					if(cl[cmdlog_off])
					{
						s=cl[cmdlog_off];
					}
					spew.div_talk_form_input.val(s);
					return false;
				break;
				case 39: //right
				break;
				case 40: //down
					var cl=spew.opts["cmdlog"]; // most recent at the bottom
					var s=""
					cmdlog_off+=1;
					if(cmdlog_off>cl.length) { cmdlog_off=cl.length; }
					if(cl[cmdlog_off])
					{
						s=cl[cmdlog_off];
					}
					spew.div_talk_form_input.val(s);
					return false;
				break;
			}
			tab_set=-1; // diable multiple tabs
			return true;
		}); // typing scrolls us to the bottom
	
		$(".wetspew_tabs a").click(spew.click_tab);
		spew.show_tab("login");
		
/*	
spew.div_wetv.append($('<video style="width:100%;height:100%;" '+
' src="http://www.archive.org/download/horror_express_ipod/horror_express_512kb.mp4" '+
' controls="controls" autoplay="autoplay"></video>'));
*/


		$(spew.div_talk_form).submit(function(){

			var line = $(spew.div_talk_form_input).val();
			spew.do_line(line);

		  $(spew.div_talk_form_input).val('');//.focus();
		  return false;
		})

		spew.sock_setup();
		
//		var last_hover;

		$(document).on("mouseenter",".wetspew_name",function(){
				var name=$(this).data("name");
				if(!name){ name=$(this).html(); } // this should be the name
				
				var u=spew.users[name];
//				if(u && (this!=last_hover))
				if(u)
				{
//					last_hover=this;
					
					$(this).data("name",name);
					
					u.namespan=$(this); // this is the one we want to update
					spew.send_msg({cmd:"note",note:"info",info:"user",name:name}); // ask the server for info
				}
			});
/*			
		$(document).on("mouseleave",".wetspew_name",function(){
				var name=$(this).data("name");
				if(!name){ name=$(this).html(); } // this should be the name
				var u=spew.users[name];
				if(u)
				{
					u.namespan=undefined; // do not update
				}
				$(this).html(name);
			});		
*/		
		setInterval(function(){spew.update();},1000) // call once a sec
		return spew;
	};
		
	

	spew.update=function(){
		spew.ytapi_count++;
		if( spew.opts.tv ) // tv must be enabled
		{
			if(!spew.ytapi) // reload youtube if it fails
			{
				if( spew.ytapi_count>5 ) // wait a while between retrys
				{
					spew.ytapi_count=0;

					new YT.Player('wetspew_wetv', {
						width: '640',
						height: '480',
						videoId: '9XVcIi-sLlk',
						events: {
						'onReady': function(event) {
								spew.ytapi=event.target;
								spew.send_msg({cmd:"game",gcmd:"wetv",wetv:"ready"}); // get current vid
							},
						'onStateChange': function(event) {
								if (event.data == YT.PlayerState.ENDED )
								{
									spew.send_msg({cmd:"game",gcmd:"wetv",wetv:"info"}); // this tells the server to play next vid
								}
							}
						}
					});
				}
			}
			else
			{
				if(spew.ytapi.setSize) // && !spew.ytapi_ready )
				{
					spew.ytapi_ready=true;
	//				spew.ytapi.setSize(640,480);
	//				spew.ytapi.loadVideoById("ylLzyHk54Z0");
					if(spew.nextqvid)
					{
						spew.ytapi.loadVideoById(spew.nextqvid.vid,spew.nextqvid.num);
						spew.forcetime=spew.nextqvid.num;
//console.log("forcetime set "+spew.forcetime);
					}
					spew.nextqvid=undefined;
				}
				
				if(spew.forcetime)
				{
					var d=spew.ytapi.getCurrentTime();
					if( d && (d!=0) ) // it sits on 0 for a while, wait for it to change
					{
						d=d-spew.forcetime;
//console.log("forcetime diff "+d);
						if(Math.abs(d)<10)
						{
							spew.forcetime=undefined;
						}
						else
						{
							spew.ytapi.seekTo(spew.forcetime,true);
						}
					}
				}
			}
		}
		else // unload tv
		{
			spew.ytapi=undefined;
			spew.ytapi_count=9999;
			$("#wetspew_wetv").replaceWith("<div class=\"wetspew_wetv\" id=\"wetspew_wetv\" ></div>");
		}
		
		if(spew.sticky_bottom)
		{
			spew.div_chat[0].scrollTop = spew.div_chat[0].scrollHeight; // scroll to bottom
		}
	};

// handle a line input from the user
// probably means sending a msg to the spew server

	spew.do_line=function(line){

			
		var aa=line.split(" "); // this requires a real space to seperate args...
		var cmd=aa[0];

		if(cmd=="/connect")
		{
			line=null; // do not send to server
			spew.sock_setup(); // try and setup the serverstuffs again
		}
		else
		if(cmd=="/disconnect")
		{
			line=null; // do not send to server
			spew.sock_clean(); // drop connection to server
		}

		if(line)
		{
			spew.send_msg(spew.cmd_to_msg(line));
		}

	};

};

},{}],"./js/spew.js":[function(require,module,exports){
module.exports=require('x/si8d');
},{}],"x/si8d":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){


	var spew={};

	spew.storage_available=typeof window.localStorage!=='undefined';
	spew.json_available=typeof window.JSON!=='undefined';


	spew.users={};

	spew.max_image_size=1024*1024; // 1 meg seems reasonable? bigger files are not displayed
	spew.filesizes={}; // map urls to file sizes
	
	spew.ytapi=undefined;
	spew.ytapi_count=9999;

	require('./spew.opts.js').setup(spew);
	require('./spew.sock.js').setup(spew);
	require('./spew.names.js').setup(spew);
	require('./spew.html.js').setup(spew);
	
	spew.html_setup(opts);
			
	return spew;
};

},{"./spew.html.js":1,"./spew.names.js":4,"./spew.opts.js":5,"./spew.sock.js":6}],4:[function(require,module,exports){

exports.setup=function(spew){

// random names
	
spew.random_name=function(){
var txt_adjectives=[
	"ravishing",
	"mimic",
	"famous",
	"cheerful",
	"livid",
	"obstinate",
	"exhausted",
	"graceful",
	"outrageous",
	"radical",
	"childish",
	"snobbish",
	"miserly",
	"amiable",
	"disgusting",
	"awful",
	"humorous",
	"fanciful",
	"pathetic",
	"windy",
	"dusty",
	"bashful",
	"freaky",
	"chilly",
	"stormy",
	"humid",
	"bountiful",
	"jubilant",
	"irritated",
	"patient",
	"dizzy",
	"skeptical",
	"puzzled",
	"perplexed",
	"jovial",
	"hyper",
	"squirrely",
	"jittery",
	"elegant",
	"gleeful",
	"dreary",
	"impish",
	"sneaky",
	"horrid",
	"monsterous",
	"able",
	"abnormal",
	"absent",
	"absolute",
	"accurate",
	"acidic",
	"acoustic",
	"active",
	"adequate",
	"airborne",
	"airy",
	"all",
	"alone",
	"american",
	"amphibious",
	"angry",
	"annual",
	"another",
	"any",
	"apparent",
	"artificial",
	"atomic",
	"audible",
	"automatic",
	"auxiliary",
	"available",
	"bad",
	"ballistic",
	"bare",
	"basic",
	"beautiful",
	"beneficial",
	"best",
	"better",
	"big",
	"biggest",
	"binary",
	"bipolar",
	"bitter",
	"black",
	"blind",
	"blue",
	"both",
	"brief",
	"bright",
	"broad",
	"brown",
	"busy",
	"capable",
	"careful",
	"careless",
	"carnal",
	"cautious",
	"celestial",
	"celsius",
	"central",
	"ceramic",
	"certain",
	"cheap",
	"cheaper",
	"civil",
	"clean",
	"clear",
	"closer",
	"coarse",
	"cold",
	"common",
	"compact",
	"complete",
	"complex",
	"compound",
	"compulsory",
	"concrete",
	"conscious",
	"constant",
	"continuous",
	"convenient",
	"cool",
	"correct",
	"corrosive",
	"critical",
	"cruel",
	"cubic",
	"culpable",
	"current",
	"daily",
	"dangerous",
	"dark",
	"darker",
	"darkest",
	"dead",
	"deaf",
	"dear",
	"dearer",
	"dearest",
	"decimal",
	"deep",
	"deeper",
	"deepest",
	"defective",
	"definite",
	"delicate",
	"dental",
	"dependent",
	"destructive",
	"diagonal",
	"different",
	"difficult",
	"digital",
	"dim",
	"diseased",
	"distinct",
	"ditty",
	"dormant",
	"double",
	"drafty",
	"drier",
	"driest",
	"drowsy",
	"dry",
	"dual",
	"due",
	"dull",
	"dumb",
	"dynamic",
	"each",
	"easy",
	"eighth",
	"either",
	"elastic",
	"electric",
	"eligible",
	"else",
	"empty",
	"enough",
	"entire",
	"equal",
	"erect",
	"erratic",
	"essential",
	"eventual",
	"every",
	"everyday",
	"evident",
	"exact",
	"excellent",
	"excessive",
	"exclusive",
	"explosive",
	"extensive",
	"external",
	"extra",
	"extreme",
	"extrinsic",
	"faint",
	"fair",
	"false",
	"familiar",
	"fast",
	"fat",
	"fatal",
	"fattest",
	"faulty",
	"feasible",
	"federal",
	"feeble",
	"fertile",
	"few",
	"fifth",
	"final",
	"fine",
	"firm",
	"first",
	"fiscal",
	"fit",
	"flammable",
	"flat",
	"flexible",
	"foggy",
	"foolish",
	"foreign",
	"formal",
	"former",
	"fourth",
	"free",
	"frequent",
	"fresh",
	"full",
	"gamma",
	"general",
	"gentle",
	"good",
	"gradual",
	"grand",
	"graphic",
	"grave",
	"gray",
	"great",
	"green",
	"grievous",
	"grocery",
	"happy",
	"hard",
	"harmful",
	"hazardous",
	"healthy",
	"heavy",
	"helpful",
	"high",
	"hilly",
	"hind",
	"hollow",
	"hot",
	"huge",
	"icy",
	"identical",
	"idle",
	"ill",
	"imminent",
	"important",
	"improper",
	"inboard",
	"inner",
	"instant",
	"intense",
	"internal",
	"intrinsic",
	"iterative",
	"jet",
	"julian",
	"junior",
	"keen",
	"kelvin",
	"kind",
	"knobbed",
	"large",
	"last",
	"late",
	"lawful",
	"lazy",
	"leaky",
	"lean",
	"least",
	"legal",
	"less",
	"lethal",
	"level",
	"likely",
	"linear",
	"liquid",
	"literal",
	"little",
	"lively",
	"local",
	"lone",
	"long",
	"loose",
	"loud",
	"low",
	"magnetic",
	"main",
	"many",
	"maple",
	"marine",
	"martial",
	"mean",
	"medical",
	"mental",
	"mere",
	"metallic",
	"middle",
	"minor",
	"minus",
	"misty",
	"mnemonic",
	"mobile",
	"modern",
	"modular",
	"molten",
	"moral",
	"more",
	"most",
	"movable",
	"muddy",
	"multiple",
	"mutual",
	"naked",
	"narcotic",
	"narrow",
	"national",
	"natural",
	"nautical",
	"naval",
	"neat",
	"necessary",
	"negative",
	"nervous",
	"neutral",
	"new",
	"next",
	"nice",
	"noisy",
	"nominal",
	"normal",
	"nuclear",
	"numeric",
	"numerical",
	"numerous",
	"obsolete",
	"obvious",
	"odd",
	"offline",
	"okay",
	"old",
	"online",
	"open",
	"optimum",
	"optional",
	"oral",
	"ordinary",
	"original",
	"other",
	"outboard",
	"outer",
	"outside",
	"outward",
	"overhead",
	"oversize",
	"own",
	"pale",
	"paler",
	"palest",
	"parallel",
	"partial",
	"passive",
	"past",
	"peculiar",
	"periodic",
	"permanent",
	"personal",
	"petty",
	"phonetic",
	"physical",
	"plain",
	"planar",
	"plenty",
	"poisonous",
	"polite",
	"political",
	"poor",
	"portable",
	"positive",
	"possible",
	"potential",
	"powerful",
	"practical",
	"precise",
	"pretty",
	"previous",
	"primary",
	"prior",
	"private",
	"probable",
	"prompt",
	"proper",
	"protective",
	"proximate",
	"punitive",
	"pure",
	"purple",
	"quick",
	"quiet",
	"random",
	"rapid",
	"raw",
	"ready",
	"real",
	"red",
	"regional",
	"regular",
	"relative",
	"reliable",
	"remote",
	"removable",
	"responsible",
	"retail",
	"reusable",
	"rich",
	"richer",
	"richest",
	"right",
	"rigid",
	"ripe",
	"rough",
	"sad",
	"sadder",
	"saddest",
	"safe",
	"safer",
	"safest",
	"same",
	"secondary",
	"secure",
	"senior",
	"sensitive",
	"separate",
	"serious",
	"seventh",
	"several",
	"severe",
	"shady",
	"shallow",
	"sharp",
	"shy",
	"shiny",
	"short",
	"sick",
	"silent",
	"similar",
	"simple",
	"single",
	"sixth",
	"slack",
	"slight",
	"slippery",
	"slower",
	"slowest",
	"small",
	"smart",
	"smooth",
	"snug",
	"social",
	"soft",
	"solar",
	"solid",
	"some",
	"sour",
	"special",
	"specific",
	"stable",
	"static",
	"steady",
	"steep",
	"sterile",
	"sticky",
	"stiff",
	"still",
	"straight",
	"strange",
	"strict",
	"strong",
	"such",
	"sudden",
	"suitable",
	"sunny",
	"superior",
	"sure",
	"sweet",
	"swift",
	"swollen",
	"symbolic",
	"synthetic",
	"tactical",
	"tall",
	"taut",
	"technical",
	"temporary",
	"tentative",
	"terminal",
	"thermal",
	"thick",
	"thin",
	"third",
	"thirsty",
	"tight",
	"tiny",
	"toxic",
	"tropical",
	"true",
	"turbulent",
	"typical",
	"unique",
	"upper",
	"urgent",
	"useable",
	"useful",
	"usual",
	"valid",
	"valuable",
	"various",
	"vertical",
	"viable",
	"violent",
	"virtual",
	"visible",
	"visual",
	"vital",
	"void",
	"volatile",
	"wanton",
	"warm",
	"weak",
	"weary",
	"wet",
	"white",
	"whole",
	"wide",
	"wise",
	"wooden",
	"woolen",
	"worse",
	"worst",
	"wrong",
	"yellow",
	"young",
	"harmless",
	"inactive",
	"incorrect",
	"indirect",
	"invalid",
	"unable",
	"unknown",
	"unmated",
	"unsafe",
	"unsigned",
	"unused",
	"unusual",
	"unwanted",
	"useless",
	"aged",
	"etched",
	"finished",
	"given",
	"left",
	"lost",
	"mistaken",
	"proven",
	""];


var txt_nouns=[
	"abrasive",
	"abuser",
	"accident",
	"acid",
	"acre",
	"acronym",
	"act",
	"address",
	"admiral",
	"adverb",
	"adviser",
	"affair",
	"agent",
	"aid",
	"aim",
	"air",
	"airplane",
	"airport",
	"airship",
	"alarm",
	"alcoholic",
	"algebra",
	"alias",
	"alibi",
	"alley",
	"alloy",
	"analog",
	"analyst",
	"anchor",
	"angle",
	"animal",
	"anthem",
	"apple",
	"april",
	"apron",
	"arc",
	"arch",
	"area",
	"arm",
	"army",
	"array",
	"arrest",
	"arrow",
	"atom",
	"attack",
	"ax",
	"axis",
	"baby",
	"back",
	"bag",
	"ball",
	"balloon",
	"band",
	"bang",
	"bar",
	"barge",
	"barrel",
	"base",
	"basin",
	"basket",
	"bat",
	"batch",
	"bath",
	"bather",
	"battery",
	"bay",
	"beach",
	"beacon",
	"bead",
	"beam",
	"bean",
	"bear",
	"beat",
	"bed",
	"being",
	"bend",
	"berry",
	"bigamy",
	"blade",
	"blank",
	"blanket",
	"blast",
	"blasts",
	"block",
	"blood",
	"blot",
	"blow",
	"blower",
	"boat",
	"body",
	"boil",
	"bolt",
	"bone",
	"book",
	"boot",
	"bore",
	"bottle",
	"bottom",
	"box",
	"boy",
	"brain",
	"bread",
	"breast",
	"brick",
	"broom",
	"bubble",
	"bucket",
	"builder",
	"bullet",
	"bump",
	"bus",
	"bush",
	"butt",
	"butter",
	"button",
	"byte",
	"cab",
	"cake",
	"camp",
	"cannon",
	"cap",
	"captain",
	"carpet",
	"cause",
	"cave",
	"cell",
	"cellar",
	"chair",
	"chalk",
	"cheat",
	"cheek",
	"cheese",
	"chief",
	"child",
	"chimney",
	"church",
	"circle",
	"citizen",
	"civilian",
	"clamp",
	"claw",
	"clerk",
	"clock",
	"cloud",
	"club",
	"clump",
	"coal",
	"coat",
	"coder",
	"colon",
	"comb",
	"comma",
	"computer",
	"cone",
	"console",
	"control",
	"copy",
	"cord",
	"core",
	"cork",
	"corner",
	"cough",
	"count",
	"crack",
	"cradle",
	"craft",
	"cramp",
	"crash",
	"crawl",
	"crust",
	"cube",
	"cup",
	"cure",
	"curl",
	"dam",
	"data",
	"date",
	"dealer",
	"death",
	"debris",
	"debt",
	"decay",
	"december",
	"deck",
	"decoder",
	"default",
	"defect",
	"delight",
	"dent",
	"desert",
	"desire",
	"desk",
	"device",
	"diode",
	"dirt",
	"disease",
	"disgust",
	"dish",
	"disk",
	"ditch",
	"ditches",
	"diver",
	"divider",
	"dolly",
	"dope",
	"dose",
	"drag",
	"dress",
	"drug",
	"dump",
	"ear",
	"edge",
	"egg",
	"elbow",
	"electron",
	"eleven",
	"end",
	"enemy",
	"error",
	"exit",
	"expert",
	"face",
	"factory",
	"fake",
	"fall",
	"family",
	"fan",
	"farm",
	"father",
	"fear",
	"feather",
	"feeder",
	"feet",
	"field",
	"fighter",
	"file",
	"filter",
	"finger",
	"fish",
	"fist",
	"flake",
	"flap",
	"flash",
	"flood",
	"floor",
	"flush",
	"foam",
	"fog",
	"fold",
	"food",
	"foot",
	"force",
	"forest",
	"fork",
	"form",
	"fort",
	"friction",
	"friday",
	"friend",
	"front",
	"frost",
	"fruit",
	"fur",
	"game",
	"gang",
	"gap",
	"garage",
	"garden",
	"gas",
	"gate",
	"gear",
	"gene",
	"giant",
	"girl",
	"gland",
	"glass",
	"glaze",
	"gleam",
	"glide",
	"glove",
	"glow",
	"glue",
	"goal",
	"grade",
	"graph",
	"grass",
	"grease",
	"grid",
	"grip",
	"groan",
	"gross",
	"growth",
	"guard",
	"guest",
	"guide",
	"gum",
	"gun",
	"guy",
	"habit",
	"hail",
	"hair",
	"half",
	"hall",
	"hammer",
	"hand",
	"handle",
	"hangar",
	"harbor",
	"hardware",
	"harm",
	"harpoon",
	"haste",
	"hat",
	"hatch",
	"hate",
	"hazard",
	"head",
	"heap",
	"heart",
	"heat",
	"heater",
	"heel",
	"heels",
	"height",
	"hello",
	"helm",
	"helmet",
	"help",
	"hem",
	"here",
	"hertz",
	"hill",
	"hint",
	"hip",
	"hiss",
	"hold",
	"hole",
	"home",
	"honk",
	"hood",
	"hoof",
	"hook",
	"hoop",
	"horn",
	"hose",
	"hotel",
	"hour",
	"house",
	"howl",
	"hub",
	"hug",
	"hull",
	"hum",
	"human",
	"humor",
	"hump",
	"hundred",
	"hunk",
	"hunt",
	"hush",
	"hut",
	"ice",
	"icing",
	"idea",
	"ideal",
	"image",
	"impact",
	"impulse",
	"inch",
	"injury",
	"ink",
	"inlet",
	"inlets",
	"input",
	"inquiry",
	"insanity",
	"insignia",
	"intake",
	"intakes",
	"integer",
	"integrity",
	"intent",
	"intents",
	"intercom",
	"interest",
	"interface",
	"interior",
	"interval",
	"interview",
	"invention",
	"invoice",
	"iron",
	"island",
	"issue",
	"item",
	"ivory",
	"jack",
	"jail",
	"jam",
	"jar",
	"jaw",
	"jelly",
	"jewel",
	"jig",
	"job",
	"joint",
	"judge",
	"jug",
	"july",
	"jump",
	"june",
	"junk",
	"jury",
	"justice",
	"keel",
	"kettle",
	"key",
	"keyboard",
	"keyword",
	"kick",
	"kill",
	"kiss",
	"kit",
	"kite",
	"knee",
	"knife",
	"knob",
	"knock",
	"knot",
	"label",
	"labor",
	"lace",
	"lack",
	"ladder",
	"lake",
	"lamp",
	"land",
	"lane",
	"lantern",
	"lap",
	"lapse",
	"lard",
	"laser",
	"lash",
	"latch",
	"laugh",
	"launch",
	"laundry",
	"law",
	"layer",
	"lead",
	"leader",
	"leaf",
	"leak",
	"leakage",
	"leap",
	"leaper",
	"leather",
	"leave",
	"leg",
	"legend",
	"length",
	"lesson",
	"letter",
	"liberty",
	"library",
	"lick",
	"lid",
	"life",
	"lift",
	"light",
	"limb",
	"lime",
	"limit",
	"limp",
	"line",
	"linen",
	"link",
	"lint",
	"lip",
	"liquor",
	"list",
	"liter",
	"litre",
	"liver",
	"load",
	"loaf",
	"loan",
	"lock",
	"locker",
	"log",
	"logic",
	"look",
	"loop",
	"loss",
	"lot",
	"love",
	"lumber",
	"lump",
	"lung",
	"machine",
	"magnet",
	"mail",
	"major",
	"make",
	"male",
	"man",
	"map",
	"marble",
	"march",
	"margin",
	"mark",
	"market",
	"mask",
	"mass",
	"mast",
	"master",
	"mat",
	"match",
	"mate",
	"material",
	"math",
	"meal",
	"meat",
	"medal",
	"medium",
	"meet",
	"member",
	"memory",
	"men",
	"mention",
	"mentions",
	"menu",
	"menus",
	"mess",
	"metal",
	"meter",
	"method",
	"mile",
	"milk",
	"mill",
	"mind",
	"mine",
	"mint",
	"mirror",
	"misfit",
	"miss",
	"mission",
	"mist",
	"mitt",
	"mitten",
	"mix",
	"mode",
	"model",
	"modem",
	"module",
	"moment",
	"monday",
	"money",
	"monitor",
	"moon",
	"moonlight",
	"mop",
	"moss",
	"motel",
	"mother",
	"motion",
	"motor",
	"mount",
	"mouth",
	"move",
	"mover",
	"much",
	"mud",
	"mug",
	"mule",
	"muscle",
	"music",
	"mustard",
	"nail",
	"name",
	"nation",
	"nature",
	"nausea",
	"navy",
	"neck",
	"need",
	"needle",
	"neglect",
	"nerve",
	"nest",
	"net",
	"neutron",
	"nickel",
	"night",
	"nod",
	"noise",
	"noon",
	"north",
	"nose",
	"notation",
	"note",
	"notice",
	"noun",
	"nozzle",
	"null",
	"number",
	"numeral",
	"nurse",
	"nut",
	"nylon",
	"oak",
	"oar",
	"object",
	"ocean",
	"odor",
	"odors",
	"offer",
	"officer",
	"ohm",
	"oil",
	"operand",
	"opinion",
	"option",
	"orange",
	"order",
	"ore",
	"organ",
	"orifice",
	"origin",
	"ornament",
	"ounce",
	"ounces",
	"outfit",
	"outing",
	"outlet",
	"outline",
	"output",
	"oven",
	"owner",
	"oxide",
	"oxygen",
	"pace",
	"pack",
	"pad",
	"page",
	"pail",
	"pain",
	"paint",
	"pair",
	"pan",
	"pane",
	"panel",
	"paper",
	"parcel",
	"parity",
	"park",
	"part",
	"partner",
	"party",
	"pascal",
	"pass",
	"passage",
	"paste",
	"pat",
	"patch",
	"path",
	"patient",
	"patrol",
	"paw",
	"paws",
	"pay",
	"pea",
	"peace",
	"peak",
	"pear",
	"peck",
	"pedal",
	"peg",
	"pen",
	"pencil",
	"people",
	"percent",
	"perfect",
	"period",
	"permit",
	"person",
	"phase",
	"photo",
	"pick",
	"picture",
	"piece",
	"pier",
	"pile",
	"pilot",
	"pin",
	"pink",
	"pipe",
	"pistol",
	"piston",
	"pit",
	"place",
	"plan",
	"plane",
	"plant",
	"plastic",
	"plate",
	"play",
	"plead",
	"pleasure",
	"plot",
	"plow",
	"plug",
	"pocket",
	"point",
	"poison",
	"poke",
	"pole",
	"police",
	"polish",
	"poll",
	"pond",
	"pool",
	"pop",
	"port",
	"portion",
	"post",
	"pot",
	"potato",
	"pound",
	"powder",
	"power",
	"prefix",
	"presence",
	"present",
	"president",
	"press",
	"price",
	"prime",
	"print",
	"prism",
	"prison",
	"probe",
	"problem",
	"produce",
	"product",
	"profile",
	"profit",
	"program",
	"progress",
	"project",
	"pronoun",
	"proof",
	"prop",
	"protest",
	"public",
	"puddle",
	"puff",
	"pull",
	"pulse",
	"pump",
	"punch",
	"pupil",
	"purchase",
	"purge",
	"purpose",
	"push",
	"pyramid",
	"quart",
	"quarter",
	"question",
	"quiet",
	"quota",
	"race",
	"rack",
	"radar",
	"radian",
	"radio",
	"rag",
	"rail",
	"rain",
	"rainbow",
	"raincoat",
	"raise",
	"rake",
	"ram",
	"ramp",
	"range",
	"rank",
	"rap",
	"rate",
	"ratio",
	"ratios",
	"rattle",
	"ray",
	"reach",
	"reader",
	"ream",
	"rear",
	"reason",
	"rebound",
	"receipt",
	"recess",
	"record",
	"recovery",
	"recruit",
	"reel",
	"refund",
	"refuse",
	"region",
	"regret",
	"relay",
	"release",
	"relief",
	"remedy",
	"removal",
	"repair",
	"report",
	"request",
	"rescue",
	"reserve",
	"resident",
	"residue",
	"resource",
	"respect",
	"rest",
	"result",
	"return",
	"reverse",
	"review",
	"reward",
	"rheostat",
	"rhythm",
	"rib",
	"ribbon",
	"rice",
	"riddle",
	"ride",
	"rifle",
	"rig",
	"rim",
	"rinse",
	"river",
	"road",
	"roar",
	"rock",
	"rocket",
	"rod",
	"roll",
	"roof",
	"room",
	"root",
	"rope",
	"rose",
	"round",
	"route",
	"rower",
	"rubber",
	"rudder",
	"rug",
	"rule",
	"rumble",
	"run",
	"runner",
	"rush",
	"rust",
	"sack",
	"saddle",
	"safety",
	"sail",
	"sailor",
	"sale",
	"salt",
	"salute",
	"sample",
	"sand",
	"sap",
	"sash",
	"scab",
	"scale",
	"scene",
	"school",
	"science",
	"scope",
	"score",
	"scrap",
	"scratch",
	"scream",
	"screen",
	"screw",
	"sea",
	"seal",
	"seam",
	"search",
	"season",
	"seat",
	"second",
	"secret",
	"sector",
	"seed",
	"self",
	"sense",
	"sentry",
	"serial",
	"series",
	"servant",
	"session",
	"setup",
	"sewage",
	"sewer",
	"sex",
	"shade",
	"shadow",
	"shaft",
	"shame",
	"shape",
	"share",
	"shave",
	"sheet",
	"shelf",
	"shell",
	"shelter",
	"shield",
	"shift",
	"ship",
	"shirt",
	"shock",
	"shoe",
	"shop",
	"shore",
	"shoulder",
	"shout",
	"shovel",
	"show",
	"shower",
	"side",
	"sight",
	"sign",
	"silence",
	"silk",
	"sill",
	"silver",
	"sink",
	"sip",
	"sir",
	"siren",
	"sister",
	"site",
	"size",
	"skew",
	"skill",
	"skin",
	"skip",
	"skirt",
	"sky",
	"slap",
	"slash",
	"slate",
	"slave",
	"sled",
	"sleep",
	"sleeve",
	"slice",
	"slide",
	"slope",
	"slot",
	"smash",
	"smell",
	"smile",
	"smoke",
	"snap",
	"sneeze",
	"snow",
	"soap",
	"society",
	"sock",
	"socket",
	"sod",
	"software",
	"soil",
	"soldier",
	"sole",
	"son",
	"sonar",
	"song",
	"sort",
	"sound",
	"soup",
	"source",
	"south",
	"space",
	"spacer",
	"spade",
	"span",
	"spar",
	"spare",
	"spark",
	"speaker",
	"spear",
	"speech",
	"speed",
	"speeder",
	"spike",
	"spill",
	"spiral",
	"splash",
	"splice",
	"splint",
	"spoke",
	"sponge",
	"sponsor",
	"sponsors",
	"spool",
	"spoon",
	"sport",
	"spot",
	"spray",
	"spring",
	"square",
	"squeak",
	"stack",
	"staff",
	"stage",
	"stair",
	"stake",
	"stall",
	"stamp",
	"stand",
	"staple",
	"star",
	"stare",
	"start",
	"state",
	"status",
	"steam",
	"steamer",
	"steel",
	"stem",
	"step",
	"stern",
	"stick",
	"sting",
	"stitch",
	"stock",
	"stomach",
	"stone",
	"stool",
	"stop",
	"store",
	"storm",
	"story",
	"stove",
	"strain",
	"strand",
	"strap",
	"straw",
	"streak",
	"stream",
	"street",
	"stress",
	"strike",
	"string",
	"strip",
	"stripe",
	"strobe",
	"stroke",
	"strut",
	"stub",
	"student",
	"study",
	"stuff",
	"stump",
	"submarine",
	"success",
	"sugar",
	"suit",
	"sum",
	"sun",
	"sunday",
	"sunlight",
	"sunrise",
	"sunset",
	"sunshine",
	"surface",
	"surge",
	"surprise",
	"swab",
	"swallow",
	"swamp",
	"swap",
	"sweep",
	"swell",
	"swim",
	"swimmer",
	"swing",
	"switch",
	"swivel",
	"sword",
	"symbol",
	"system",
	"tab",
	"table",
	"tablet",
	"tack",
	"tactic",
	"tag",
	"tail",
	"tailor",
	"talk",
	"tan",
	"tank",
	"tap",
	"tape",
	"tar",
	"target",
	"task",
	"taste",
	"tax",
	"taxi",
	"team",
	"tear",
	"teeth",
	"teller",
	"temper",
	"tender",
	"tens",
	"tension",
	"tent",
	"tenth",
	"term",
	"terrain",
	"test",
	"tests",
	"text",
	"theory",
	"thin",
	"thing",
	"thirty",
	"thread",
	"threat",
	"throat",
	"thumb",
	"thunder",
	"tick",
	"tide",
	"tie",
	"till",
	"time",
	"timer",
	"timers",
	"times",
	"tin",
	"tip",
	"tips",
	"tire",
	"tissue",
	"title",
	"today",
	"toe",
	"ton",
	"tongue",
	"tool",
	"tools",
	"tooth",
	"top",
	"topic",
	"toss",
	"total",
	"touch",
	"tour",
	"towel",
	"tower",
	"town",
	"trace",
	"track",
	"tracker",
	"tractor",
	"trade",
	"traffic",
	"trail",
	"trailer",
	"train",
	"transfer",
	"transit",
	"trap",
	"trash",
	"tray",
	"tree",
	"trial",
	"trick",
	"trigger",
	"trim",
	"trip",
	"troop",
	"trouble",
	"truck",
	"trunk",
	"truth",
	"try",
	"tub",
	"tug",
	"tune",
	"tunnel",
	"turn",
	"twig",
	"twin",
	"twine",
	"twirl",
	"twist",
	"type",
	"typist",
	"umbrella",
	"uniform",
	"unit",
	"update",
	"upside",
	"usage",
	"use",
	"user",
	"vacuum",
	"value",
	"valve",
	"vapor",
	"vector",
	"vehicle",
	"vendor",
	"vent",
	"verb",
	"version",
	"vessel",
	"veteran",
	"vice",
	"victim",
	"video",
	"view",
	"village",
	"vine",
	"violet",
	"visit",
	"voice",
	"volt",
	"vomit",
	"wafer",
	"wage",
	"wagon",
	"waist",
	"wait",
	"wake",
	"walk",
	"wall",
	"want",
	"war",
	"wash",
	"waste",
	"watch",
	"water",
	"watt",
	"wave",
	"wax",
	"way",
	"web",
	"weed",
	"week",
	"weight",
	"weld",
	"west",
	"wheel",
	"whip",
	"whirl",
	"width",
	"wiggle",
	"win",
	"winch",
	"wind",
	"wine",
	"wing",
	"winter",
	"wire",
	"wish",
	"woman",
	"wonder",
	"wood",
	"wool",
	"word",
	"work",
	"world",
	"worm",
	"worry",
	"worth",
	"wrap",
	"wreck",
	"wrench",
	"wrist",
	"writer",
	"yard",
	"yarn",
	"year",
	"yell",
	"yield",
	"yolk",
	"zero",
	"zip",
	"zone",
	"can",
	"may",
	"coupling",
	"damping",
	"ending",
	"rigging",
	"ring",
	"sizing",
	"sling",
	"nothing",
	"cast",
	"cost",
	"cut",
	"drunk",
	"felt",
	"ground",
	"hit",
	"lent",
	"offset",
	"set",
	"shed",
	"shot",
	"slit",
	"thought",
	"wound",
	""];
	
			var d;
			d=Math.floor(Math.random()*65536);
		var	da=d%(txt_adjectives.length-1);
			d=Math.floor(Math.random()*65536);
		var	dn=d%(txt_nouns.length-1);		
		var	ds=txt_adjectives[da]+"_"+txt_nouns[dn];
		return ds;
	}

};

},{}],5:[function(require,module,exports){

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
		if(gets["S"])
		{
			spew.opts.S=gets["S"];
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
		if(gets["S"])
		{
			spew.opts.S=gets["S"];
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

},{}],6:[function(require,module,exports){

exports.setup=function(spew){

	var msg={}; // our base of comunications, new msgs are deltas on this object



// javascript is a bit crap at utf8, so we use these escapes
	function enc(s)
	{
		var s2="";
		if(s)
		{
			try
			{
//				s2=unescape( encodeURIComponent( s ) ); // force into utf8 ??
				s2=s.split("%").join("%25").split("=").join("%3d").split("&").join("%26");
//console.log("enc "+s+" : "+s2);
				return s2;
			}
			catch(e)
			{
				return "";
			}
		}
		return "";
	};
	
//this should shortcircuit if 7bit clean (which we mostly would be)
	function dec_utf8(t) {
		
		if(!t.match(/[^\x01-\x7f]/)) { return t; }
		
        var s = "";  
        var i = 0;  
        var c = c1 = c2 = 0;
  
        while ( i < t.length ) {  
            c = t.charCodeAt(i);  
            if (c < 128) {  
                s += String.fromCharCode(c);  
                i++;  
            }  
            else if((c > 191) && (c < 224)) {  
                c2 = t.charCodeAt(i+1);  
                s += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            }  
            else {  
                c2 = t.charCodeAt(i+1);  
                c3 = t.charCodeAt(i+2);  
                s += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
  
        }
//console.log("convert "+t+" : "+s);

        return s;  
    }  
	
	function dec(s)
	{
		var s2="";
		if(s)
		{
			try
			{
				s2=s.split("%26").join("&").split("%3d").join("=").split("%25").join("%");
				s2=/*dec_utf8*/( s2 ); // convert from utf8 ???
//console.log("dec "+s+" : "+s2);
				return s2;
			}
			catch(e)
			{
				return "";
			}
		}
		return "";
	};

	spew.str_to_msg=function(s) // split a query like string
	{
	var i;
		var msg={};
		
		var aa=s.split("&");
		for(i in aa)
		{
		var v=aa[i];
			var va=v.split("=");
			msg[dec(va[0])]=dec(va[1]);
		}
		
		return msg;
	};
	
	spew.msg_to_str=function(msg)// create a query like string
	{
	var i;
		var s="&";
		
		for(i in msg)
		{
		var v=msg[i];
			
			s=s+enc(i)+"="+enc(v)+"&";
		}
		
		return s;
	};
	
	spew.msg_update=function(msg,newmsg) // override data with that in the new msg
	{
	var i;
		for(i in newmsg)
		{
			msg[i]=newmsg[i];
		}
		return msg;
	};

	spew.send_data=function(s) {
	//		console.log("send"+s);
		if (spew.ws) {
		  spew.ws.send(s);
		}
		else {
		}
	};
	  
      spew.send_msg=function(m) {
		spew.send_data(spew.msg_to_str(m));
	  };
	  
      spew.cmd_to_msg=function(s) { // convert a typed in command into a msg

// actually, since I had to add the functionality for telnet connections anyway
// we will cheat for now and just send it as a string and the server will convert it for us.

		var m={};
		m.cmd="cmd";
		m.txt=s;
		
		return m;	  
	  };
	  
	  spew.msg_to_html=function(msg){
	
	  var s;
	  
	  var cmd=msg.cmd;
	  var frm=msg.frm; if(!msg.frm){msg.frm="*";}
	  var txt=msg.txt; if(!msg.txt){msg.txt="*";}
	  
	  txt=spew.escapeHTML(txt); // escape any text input to remove html
	  if(window.ansi_up) // allow ansi escapes?
	  {
		txt= window.ansi_up.ansi_to_html(txt);
	  }
	  
	  var frmlnk="<a target=\"_blank\" href=\"http://api.wetgenes.com:1408/genes/profile/"+frm+"\" class=\"wetspew_name\" >"+frm+"</a>"
	  
		switch(cmd)
		{
			case "say":
				if(frm=="*")
				{
					s="*"+txt+"*";
				}
				else
				{
					s="<img src=\"http://api.wetgenes.com:1408/genes/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLlinks(txt);
				}
			break;
			
			case "act":
				s="**"+frmlnk+" "+spew.autoHTMLlinks(txt)+"**";
			break;
			
			case "mux":
				s=txt;
			break;

			case "lnk":
				if(msg.lnk.match(/(jpg|png|gif|jpeg)$/)) // it is probably an image, embed it via bouncer
				{
					s="<img src=\"http://api.wetgenes.com:1408/genes/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLimg(msg.lnk)
				}
				else
				{
					s="<a href='"+msg.lnk+"' target='_blank'>**<span class=\"wetspew_name\">"+frm+"</span> "+txt+"**</a>";
				}
			break;
			
			case "note":
				var note=msg.note;
				var a1=msg.arg1;
				var a2=msg.arg2;
				var a3=msg.arg3;
				switch(note)
				{
					case "name":
						spew.name=a1;
						spew.show_tab("chat");
					break;
					
					case "notice":
					case "welcome":
					case "warning":
					case "error":
						s="-= "+a1+" =-";
					break;
					
					case "act":
						s="-* "+a1+" *-";
					break
					
					case "ban":
						s="-= "+a2+" has been banned by "+a1+" =-"
					break
					case "gag":
						s="-= "+a2+" has been gagged by "+a1+" =-"
					break
					case "dis":
						s="-= "+a2+" has been disemvoweled by "+a1+" =-"
					break
					
				}
			break;
			
		}
		if(s) { s='<span style="color:#'+msg.rgb+'">'+s+'</span>'; }
		return s;
	};

	spew.sock_clean=function() // disconnect
	{
		spew.ws.close();
//		delete spew.ws;
	}

	spew.sock_setup=function() // connect
	{
		spew.ws=new WebSocket(spew.server_address);
		
		spew.ws.onopen = function() {
		
			spew.display_note("Congratulations websockets are working and you have connected to "+spew.server_address);
			spew.display_note("You will need to /LOGIN NAME PASS (no password needed for guest logins).")

			var hash=window.location.href.split("#")[1]; // auto connect to this room?
			if(spew.opts.hash) { hash=spew.opts.hash; } // overide
			
			spew.send_msg({cmd:"note",note:"playing",arg1:"wetv",arg2:"",arg3:"",arg4:"",hash:hash});
			
			if(spew.opts["S"])
			{
				spew.send_msg({cmd:"session",sess:spew.opts["S"]});
			}


//			console.log("spew open");
		};
		
		spew.ws.onclose = function(evt) {
		
			spew.display_note("Disconnected from "+spew.server_address);
			
			spew.ws = null;
			
//			console.log("spew close");
		};
		
		spew.ws.onmessage = function(evt) {

// it seems that some things can break the framing causing a "" instead of valid data
// so all >7bit chars are getting stripped server side for now
			var dat = evt.data;
			
			if(dat.length<1) { return; } // ignore empty lines
			
//console.log(dat);

			spew.msg_update(msg,spew.str_to_msg(dat));
			
			spew.receive_msg(msg);
			
			spew.display(spew.msg_to_html(msg));
			
		};
	};

	 spew.remember_name=function(name){
			if(!spew.users[name])
			{
				spew.users[name]={name:name};
			}
	};

	spew.receive_msg=function(msg){
		
	  var cmd=msg.cmd;
// remember every name we see
		if(msg.frm)
		{
			spew.remember_name(msg.frm);
		}

		switch(cmd)
		{
			case "note":
				var note=msg.note;
				switch(note)
				{
					case "join":
						if(msg.arg1)
						{
							spew.remember_name(msg.arg1);
							if( (msg.arg2) && (msg.arg1!="*") )
							{
								spew.users[msg.arg1].room=msg.arg2;
							}
						}
					break;
					case "rooms":
						var aa=msg.list.split(",");
						var order=[];
						for(i in aa)
						{
							var v=aa[i];
							var l="";
							var a=v.split(":");
							var name=a[0];
							var basename=name.split(".")[0];
							var count=parseInt(a[1]);
							var color="fff";

							l+="<img src=\"http://api.wetgenes.com:1408/genes/avatar/"+basename+"\" class=\"wetspew_icon\" />";
							l+="<span class=\"wetspew_count\">"+count+"</span>";
							l+="<a target=\"_blank\" href=\"http://api.wetgenes.com:1408/genes/profile/"+basename+"\" class=\"wetspew_name\">"+name+"</a>";
							l="<div class=\"wetspew_line\" style=\"color:#"+color+"\">"+l+"</div>";
							order[order.length]={l:l,n:count,s:name};
						}
						order.sort(function(a,b){if(b.n==a.n) { return (b.s<a.s)-(a.s<b.s); } else return b.n-a.n; });
						spew.div_rooms.empty();
						spew.div_rooms.append("<a class=\"spew_click\" title=\"chat\">Return to chat.</a>");
						for(i in order)
						{
							var v=order[i];
							spew.div_rooms.append(v.l);
						}
						spew.show_tab("rooms");
					break;
					
					case "users":
						var aa=msg.list.split(",");
						var order=[];
						for(i in aa)
						{
							var v=aa[i];
							var l="";
							var a=v.split(":");
							var name=a[0];
							var game=a[1];
							var gameid=parseInt(a[2]);
							var form=a[3];
							var level=parseInt(form.substr(1));
							var color=a[4];
							
							spew.remember_name(name);
							
							l+="<img src=\"http://api.wetgenes.com:1408/genes/avatar/"+name+"\" class=\"wetspew_icon\" />";
							l+="<span class=\"wetspew_form\">"+form+"</span>";
							l+="<a target=\"_blank\" href=\"http://api.wetgenes.com:1408/genes/profile/"+name+"\" class=\"wetspew_name\">"+name+"</a>";
							l+="<a target=\"_blank\" href=\"http://api.wetgenes.com:1408/genes/game/"+gameid+"\" class=\"wetspew_gamename\">"+game+"</a>";
							l="<div class=\"wetspew_line\" style=\"color:#"+color+"\">"+l+"</div>";
							order[order.length]={l:l,n:level,s:name};
						}
						order.sort(function(a,b){if(b.n==a.n) { return (b.s<a.s)-(a.s<b.s); } else return b.n-a.n; });
						spew.div_users.empty();
//						spew.div_users.append("You are in room, "+roomname);
						spew.div_users.append("<a class=\"spew_click\" title=\"chat\">Return to chat.</a>");
						for(i in order)
						{
							var v=order[i];
							spew.div_users.append(v.l);
						}
						spew.show_tab("users");
					break;
					
					case "info":
						if(msg.info=="user")
						{
							var name=msg.name; // this should be the name
							var u=spew.users[name];
							if(u)
							{
								var it=u.namespan; // this is the one we want to update
								if(it)
								{
									if(msg.stat!="-") // got info
									{
										var t=(new Date(msg.joined*1000));
										var s=(msg.name+" "+msg.stat+" playing "+msg.gamename+" since "+t.getFullYear()+"/"+(1+t.getMonth())+"/"+t.getDate()+"");
										it.attr("title",s);
									}
									else
									{
										var s=(msg.name+" (offline)");
										it.attr("title",s);
									}
								}
							}
						}
					break;
				}
			break;
		}

		if(msg.cmd=="game")
		{
			spew.on_msg_game(msg);
		}
		
	};
		

	spew.on_msg_game=function(msg){
	
		if(msg.gcmd=="wetv")
		{
			spew.on_msg_game_wetv(msg);
		}
	}
	
	spew.on_msg_game_wetv=function(msg){
		if(msg.wetv=="play")
		{
			var p=msg.play;
			var aa=msg.play.split(",")
			var vid=aa[0];
			var num=parseInt(aa[1]);

//			if(spew.ytapi_ready)
//			{
//				spew.ytapi.loadVideoById(vid,num);
//			}
//			else
//			{
				spew.nextqvid={vid:vid,num:num};
//			}
		}
	}

};

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL3NwZXcvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL3NwZXcvanMvc3Bldy5odG1sLmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3LmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3Lm5hbWVzLmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3Lm9wdHMuanMiLCIvaG9tZS9rcmlzcy9oZy9qcy9zcGV3L2pzL3NwZXcuc29jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzc0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKHNwZXcpe1xuXG5cdHNwZXcuY2xpY2tfbG9naW49ZnVuY3Rpb24oKVxuXHR7XG5cdFx0dmFyIHR4dD0kKHRoaXMpLmh0bWwoKS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmKHR4dD09XCJ5ZXNcIilcblx0XHR7XG5cdFx0XHRzcGV3LnNob3dfdGFiKFwiY2hhdFwiKTtcblx0XHRcdHNwZXcuc2VuZF9tc2coc3Bldy5jbWRfdG9fbXNnKFwiL2xvZ2luIFwiK3NwZXcubmFtZSkpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuLy9cdFx0XHRzcGV3LnNob3dfdGFiKFwiY2hhdFwiKTtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbj0oXCJodHRwOi8vbHVhLndldGdlbmVzLmNvbS9kdW1pZC5sdWE/Y29udGludWU9XCIrd2luZG93LmxvY2F0aW9uKTtcbi8vXHRcdFx0d2luZG93LmxvY2F0aW9uPShcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvZHVtaWQ/Y29udGludWU9XCIrd2luZG93LmxvY2F0aW9uKTtcblx0XHR9XG4vL2NvbnNvbGUubG9nKFwidHh0IFwiK3R4dCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdFxuXHRzcGV3LmNsaWNrX3Jvb209ZnVuY3Rpb24oKVxuXHR7XG5cdFx0dmFyIHJvb209JCh0aGlzKS5odG1sKCkudG9Mb3dlckNhc2UoKTtcblx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhcIi9qb2luIFwiK3Jvb20pKTtcblx0XHRzcGV3LnNob3dfdGFiKFwiY2hhdFwiKTtcbi8vY29uc29sZS5sb2coXCJyb29tIFwiK3Jvb20pO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRcblx0c3Bldy5jbGlja190YWI9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0dmFyIHRhYj0kKHRoaXMpLmh0bWwoKS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYodGFiPT1cImZpeFwiKVxuXHRcdHtcblx0XHRcdHNwZXcueXRhcGk9dW5kZWZpbmVkO1xuXHRcdFx0c3Bldy55dGFwaV9jb3VudD05OTk5O1xuXHRcdFx0JChcIiN3ZXRzcGV3X3dldHZcIikucmVwbGFjZVdpdGgoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3dldHZcXFwiIGlkPVxcXCJ3ZXRzcGV3X3dldHZcXFwiID48L2Rpdj5cIik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG4vL1x0XHRcdHNwZXcuc2VuZF9tc2coc3Bldy5jbWRfdG9fbXNnKFwiL3VzZXJzXCIpKTtcblx0XHR9XG5cdFx0XG5cdFx0c3Bldy5zaG93X3RhYih0YWIpO1xuXHRcdFxuXHRcdGlmKHRhYj09XCJ1c2Vyc1wiKVxuXHRcdHtcblx0XHRcdHNwZXcuc2VuZF9tc2coc3Bldy5jbWRfdG9fbXNnKFwiL3VzZXJzXCIpKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKHRhYj09XCJyb29tc1wiKVxuXHRcdHtcblx0XHRcdHNwZXcuc2VuZF9tc2coc3Bldy5jbWRfdG9fbXNnKFwiL3Jvb21zXCIpKTtcblx0XHR9XG4vL2NvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcblxuXHR9XG5cdFxuXHRzcGV3LmNsaWNrPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciB0eHQ9JCh0aGlzKS5hdHRyKFwidGl0bGVcIikudG9Mb3dlckNhc2UoKTtcblx0XHRcblx0XHRpZih0eHQ9PVwiY2hhdFwiKVxuXHRcdHtcblx0XHRcdHNwZXcuc2hvd190YWIoXCJjaGF0XCIpO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0XG5cdHNwZXcuc2hvd190YWI9ZnVuY3Rpb24odGFiKVxuXHR7XG5cdFx0aWYodGFiPT1cImhlbHBcIilcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZChzcGV3LmRpdl9oZWxwKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKHRhYj09XCJuZXdzXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5lbXB0eSgpO1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5hcHBlbmQoc3Bldy5kaXZfbmV3cyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwidXNlcnNcIilcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZChzcGV3LmRpdl91c2Vycyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwicm9vbXNcIilcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZChzcGV3LmRpdl9yb29tcyk7XG5cdFx0XHQkKFwiLndldHNwZXdfcm9vbXMgLndldHNwZXdfbGluZSAud2V0c3Bld19uYW1lXCIpLmNsaWNrKHNwZXcuY2xpY2tfcm9vbSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwib3B0c1wiKVxuXHRcdHtcblx0XHRcdHNwZXcuc2hvd19vcHRzKCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwibG9naW5cIilcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0XHRzcGV3Lm5hbWU9c3Bldy5yYW5kb21fbmFtZSgpO1xuXHRcdFx0dmFyIGxvZ2luX2h0bWw9XCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X2xvZ2luXFxcIj5cIitcblx0XHRcdFwiSGVsbG8sIFwiK1xuXHRcdFx0XCI8c3BhbiBjbGFzcz1cXFwid2V0c3Bld19sb2dpbl9uYW1lXFxcIj5cIitzcGV3Lm5hbWUrXCI8L3NwYW4+XCIrXG5cdFx0XHRcIiBJcyB0aGF0IHlvdXIgbmFtZT8gXCIrXG5cdFx0XHRcIjxzcGFuIGNsYXNzPVxcXCJ3ZXRzcGV3X2xvZ2luX2J1dHRvbnNcXFwiPlwiK1xuXHRcdFx0XCIgPGEgY2xhc3M9XFxcIndldHNwZXdfbG9naW5feWVzXFxcIj5ZRVM8L2E+IFwiK1xuXHRcdFx0XCIgPGEgY2xhc3M9XFxcIndldHNwZXdfbG9naW5fbm9cXFwiPk5PPC9hPiBcIitcblx0XHRcdFwiPC9zcGFuPlwiK1xuXHRcdFx0XCI8L2Rpdj5cIjtcblx0XHRcdHNwZXcuZGl2X21haW4uYXBwZW5kKCQobG9naW5faHRtbCkpO1xuXHRcdFx0JChcIi53ZXRzcGV3X2xvZ2luX2J1dHRvbnMgYVwiKS5jbGljayhzcGV3LmNsaWNrX2xvZ2luKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHNwZXcuZGl2X21haW4uZW1wdHkoKTtcblx0XHRcdHNwZXcuZGl2X21haW4uYXBwZW5kKHNwZXcuZGl2X2NoYXQpO1xuXHRcdFx0c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxUb3AgPSBzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodDsgLy8gc2Nyb2xsIHRvIGJvdHRvbVxuXHRcdFx0c3Bldy5zdGlja3lfYm90dG9tPXRydWU7XHRcdFx0XG5cdFx0XHR2YXIgbGFzdF9oZWlnaHQ9MDtcblx0XHRcdHNwZXcuZGl2X2NoYXQuc2Nyb2xsKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKGxhc3RfaGVpZ2h0PT1zcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodCkgLy8gaGVpZ2h0IG11c3QgYmUgY29uc3RhbnQgZm9yIHVzIHRvIGNhcmVcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBvbGR0b3A9c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxUb3A7XG5cdFx0XHRcdFx0dmFyIG9sZGhlaWdodD1zcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodC1zcGV3LmRpdl9jaGF0WzBdLm9mZnNldEhlaWdodDtcblx0XHRcdFx0XHRpZihvbGR0b3A+PShvbGRoZWlnaHQpKSAvLyBzdGlja3kgd2hlbiBhdCBib3R0b21cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcGV3LnN0aWNreV9ib3R0b209dHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNwZXcuc3RpY2t5X2JvdHRvbT1mYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSAvLyByZW1haW4gc3R1Y2tcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmKHNwZXcuc3RpY2t5X2JvdHRvbSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbFRvcCA9IHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0OyAvLyBzY3JvbGwgdG8gYm90dG9tXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxhc3RfaGVpZ2h0PXNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0O1xuLy9jb25zb2xlLmxvZyhzcGV3LnN0aWNreV9ib3R0b20pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCQoXCIuc3Bld19jbGlja1wiKS5jbGljayhzcGV3LmNsaWNrKTsgLy8gbWFrZSBzdXJlIGRlZmF1bHQgY2xpY2tzIHN0aWxsIHdvcmtcblx0fVxuXG5cdHNwZXcuYXV0b0hUTUxpbWc9ZnVuY3Rpb24odXJsKXtcblxuXHRcdHZhciB1cmxpbms9JzxhIGhyZWY9XCInK3VybCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt1cmwrJzwvYT4nO1xuXHRcdFxuXHRcdGlmKCBzcGV3LmZpbGVzaXplc1sgdXJsIF0gKVxuXHRcdHtcblx0XHRcdGlmKCBzcGV3LmZpbGVzaXplc1sgdXJsIF0gPj0gc3Bldy5tYXhfaW1hZ2Vfc2l6ZSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHVybGluaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHhoci5vcGVuKCdIRUFEJywgdXJsLCB0cnVlKTtcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgc2l6ZT0wO1xuXHRcdFx0XHRpZiAoIHhoci5yZWFkeVN0YXRlID09IDQgKSB7XG5cdFx0XHRcdFx0aWYgKCB4aHIuc3RhdHVzID09IDIwMCApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0c2l6ZT1NYXRoLmZsb29yKHhoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1MZW5ndGgnKSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHNwZXcuZmlsZXNpemVzWyB1cmwgXSA9IHNpemUgO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiggc2l6ZSA+PSBzcGV3Lm1heF9pbWFnZV9zaXplKSAvLyBkaXNhYmxlP1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQkKFwiLndldHNwZXdfYXV0b2ltZ1wiKS5lYWNoKGZ1bmN0aW9uKCl7IC8vIGZpbmQgYmlnIGltYWdlcyBhbmQgZGlzYWJsZSB0aGVtXG5cdFx0XHRcdFx0XHRcdFx0aWYoJCh0aGlzKS5hdHRyKFwic3JjXCIpPT11cmwpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5yZXBsYWNlV2l0aCggdXJsaW5rICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR4aHIuc2VuZChudWxsKTtcdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuICc8YSBocmVmPVwiJyt1cmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPjxpbWcgc3R5bGU9XCJtYXgtaGVpZ2h0OjMzJTttYXgtd2lkdGg6MTAwJTtcIiBjbGFzcz1cIndldHNwZXdfYXV0b2ltZ1wiIHNyYz1cIicrdXJsKydcIiAvPjwvYT4nO1xuXG5cdH1cblx0XG5cdHNwZXcuYXV0b0hUTUxsaW5rcz1mdW5jdGlvbihzKXtcblx0XHR2YXIgc249XCJcIjtcblx0XHR2YXIgZmI9ZnVuY3Rpb24odXJsKXtcblx0XHRcdGlmKHVybC5tYXRjaCgvKGpwZ3xwbmd8Z2lmfGpwZWcpJC9pKSkgLy8gaXQgaXMgcHJvYmFibHkgYW4gaW1hZ2UsIGVtYmVkIGl0IHZpYSBib3VuY2VyXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBzcGV3LmF1dG9IVE1MaW1nKHVybCk7XG5cdFx0XHR9XHRcdFx0XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCInK3VybCsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Jyt1cmwrJzwvYT4nO1xuXHRcdH1cblx0XHRzbj1zLnJlcGxhY2UoLyhodHRwcz86XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKikvZ2ltLCBmYik7XG4vKlxuXHRcdGlmKHNuPT1zKSAvLyB0cnkgYWdhaW4gaWYgbm90aGluZyBjaGFuZ2VkXG5cdFx0e1xuXHRcdFx0c249cy5yZXBsYWNlKC8od3d3XFwuW1xcU10rKFxcYnwkKSkvZ2ltLCBmYik7XG5cdFx0fVxuKi9cblx0XHRyZXR1cm4gc247XG5cdH1cblx0c3Bldy5lc2NhcGVIVE1MPWZ1bmN0aW9uKHMpIHtcblx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzKTtcblx0XHRkaXYuYXBwZW5kQ2hpbGQodGV4dCk7XG5cdFx0cmV0dXJuIGRpdi5pbm5lckhUTUw7XG5cdH1cblx0XG5cdHNwZXcuZGlzcGxheT1mdW5jdGlvbihsKSB7XG5cdFx0aWYobClcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9jaGF0LmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfbGluZVxcXCI+XCIrbCtcIjwvZGl2PlwiKTtcblx0XHRcdHdoaWxlKHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0PjE2Mzg0KSAvLyBtYXggaGVpZ2h0LCByZW1vdmUgb2xkIGxpbmVzXG5cdFx0XHR7XG5cdFx0XHRcdHNwZXcuZGl2X2NoYXQuY2hpbGRyZW4oXCJkaXY6Zmlyc3QtY2hpbGRcIikucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihzcGV3LnN0aWNreV9ib3R0b20pXG5cdFx0XHR7XG5cdFx0XHRcdHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsVG9wID0gc3Bldy5kaXZfY2hhdFswXS5zY3JvbGxIZWlnaHQ7IC8vIHNjcm9sbCB0byBib3R0b21cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0c3Bldy5kaXNwbGF5X25vdGU9ZnVuY3Rpb24obCkge1xuXHRcdGlmKGwpIHsgc3Bldy5kaXNwbGF5KCc8c3BhbiBzdHlsZT1cImNvbG9yOiMwZjBcIj4nK2wrJzwvc3Bhbj4nKTsgfVxuICAgICB9XG4gICAgIFxuXHRzcGV3LmRhcmtfcmdiPWZ1bmN0aW9uKHJnYil7XG5cdFx0dmFyIHI9cGFyc2VJbnQocmdiLnN1YnN0cigwLDEpLDE2KTtcblx0XHR2YXIgZz1wYXJzZUludChyZ2Iuc3Vic3RyKDEsMSksMTYpO1xuXHRcdHZhciBiPXBhcnNlSW50KHJnYi5zdWJzdHIoMiwxKSwxNik7XHRcdFxuXHRcdFxuXHRcdGlmKHIrZytiPjMwKVxuXHRcdHtcblx0XHRcdHZhciBucj1yO1xuXHRcdFx0dmFyIG5nPWc7XG5cdFx0XHR2YXIgbmI9Yjtcblx0XHRcdFxuXHRcdFx0cj0xNS1NYXRoLmZsb29yKChuZytuYikvMik7XG5cdFx0XHRnPTE1LU1hdGguZmxvb3IoKG5yK25iKS8yKTtcblx0XHRcdGI9MTUtTWF0aC5mbG9vcigobnIrbmcpLzIpO1xuXHRcdH1cblx0XHRyZXR1cm4gci50b1N0cmluZygxNikrZy50b1N0cmluZygxNikrYi50b1N0cmluZygxNik7XG5cdH1cblxuXHRzcGV3Lmh0bWxfc2V0dXA9ZnVuY3Rpb24ob3B0cylcblx0e1xuXHRcdGZvcihpIGluIG9wdHMpIHsgc3Bldy5vcHRzW2ldPW9wdHNbaV07IH0gLy8gb3ZlcmlkZSBvcHRzXG5cdFx0c3Bldy5sb2FkX29wdHMoKTtcblx0XHRcdFx0XG5cdFx0c3Bldy5zZXJ2ZXJfYWRkcmVzcz1cIndzOi8vXCIrb3B0cy5ob3N0K1wiOjUyMjMvXCI7XG5cdFx0c3Bldy5kaXY9JChvcHRzLmRpdik7XG5cdFx0XHRcdFx0XHRcblx0XHRzcGV3LmRpdl9zcGV3PSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3NwZXdcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl93ZXR2PSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3dldHZcXFwiIGlkPVxcXCJ3ZXRzcGV3X3dldHZcXFwiID48L2Rpdj5cIik7XG5cblxuXHRcdHNwZXcuZGl2X3RhYnM9JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfdGFic1xcXCI+PGE+RklYPC9hPjxhPkNIQVQ8L2E+PGE+VVNFUlM8L2E+PGE+Uk9PTVM8L2E+PGE+T1BUUzwvYT48YT5IRUxQPC9hPjxhPk5FV1M8L2E+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X2Nzcz0kKFwiPGRpdiBzdHlsZT1cXFwiZGlzcGxheTpub25lO1xcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcubWFrZV9jc3NfZnJvbV9vcHRzKCk7XHRcdFxuXHRcdHNwZXcuZGl2X21haW49JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfbWFpblxcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X2hlbHA9JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfaGVscFxcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X25ld3M9JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfbmV3c1xcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X2NoYXQ9JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfY2hhdFxcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X3VzZXJzPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3VzZXJzXFxcIj48L2Rpdj5cIik7XG5cdFx0c3Bldy5kaXZfcm9vbXM9JChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfcm9vbXNcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl9vcHRzPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X29wdHNcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl90YWxrPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3R5cGVcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl90YWxrX2Zvcm09JChcIjxmb3JtPjwvZm9ybT5cIik7XG5cdFx0c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0PSQoXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgLz5cIik7XG5cdFx0c3Bldy5kaXZfdGFsay5hcHBlbmQoc3Bldy5kaXZfdGFsa19mb3JtKTtcblx0XHRzcGV3LmRpdl90YWxrX2Zvcm0uYXBwZW5kKHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dCk7XG5cblx0XHRzcGV3LmRpdl9oZWxwLmh0bWwoXCI8aWZyYW1lIHN0eWxlPVxcXCJ3aWR0aDoxMDAlO2hlaWdodDoxMDAlXFxcIiBzcmM9XFxcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvaGVscFxcXCI+PC9pZnJhbWU+XCIpO1xuXHRcdHNwZXcuZGl2X25ld3MuaHRtbChcIjxpZnJhbWUgc3R5bGU9XFxcIndpZHRoOjEwMCU7aGVpZ2h0OjEwMCVcXFwiIHNyYz1cXFwiaHR0cDovL3dldC5hcHBzcG90LmNvbS9uZXdzLmZyYW1lXFxcIj48L2lmcmFtZT5cIik7XG5cblx0XHRzcGV3LmRpdl9zcGV3LmFwcGVuZChzcGV3LmRpdl9jc3MpO1xuXHRcdHNwZXcuZGl2X3NwZXcuYXBwZW5kKHNwZXcuZGl2X3RhYnMpO1xuXHRcdHNwZXcuZGl2X3NwZXcuYXBwZW5kKHNwZXcuZGl2X21haW4pO1xuXHRcdHNwZXcuZGl2X3NwZXcuYXBwZW5kKHNwZXcuZGl2X3RhbGspO1xuXHRcdFxuXHRcdHNwZXcuZGl2LmVtcHR5KCk7XG5cdFx0c3Bldy5kaXYuYXBwZW5kKHNwZXcuZGl2X3NwZXcpO1xuXHRcdHNwZXcuZGl2LmFwcGVuZChzcGV3LmRpdl93ZXR2KTtcblx0XG5cdFx0dmFyIGNtZGxvZ19vZmY9c3Bldy5vcHRzW1wiY21kbG9nXCJdLmxlbmd0aDtcblx0XHR2YXIgdGFiX3NldD0tMTtcblx0XHR2YXIgdGFiX3M9XCJcIjtcblx0XHR2YXIgdGFiX2JnPVwiXCI7XG5cdFx0dmFyIHRhYl9lZD1cIlwiO1xuXHRcdHNwZXcuZGl2X3RhbGtfZm9ybS5zdWJtaXQoZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgY2w9c3Bldy5vcHRzW1wiY21kbG9nXCJdOyAvLyBtb3N0IHJlY2VudCBhdCB0aGUgYm90dG9tXG5cdFx0XHRjbC5wdXNoKHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dC52YWwoKSk7XG5cdFx0XHR3aGlsZShjbC5sZW5ndGg+MzIpXG5cdFx0XHR7XG5cdFx0XHRcdGNsLnNwbGljZSgwLDEpO1xuXHRcdFx0fVxuXHRcdFx0c3Bldy5zYXZlX29wdHMoKTtcblx0XHRcdGNtZGxvZ19vZmY9Y2wubGVuZ3RoO1xuLy9jb25zb2xlLmxvZyhjbC5sZW5ndGgpO1xuXHRcdH0pO1xuXHRcdHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dC5rZXlkb3duKGZ1bmN0aW9uKGUpe1xuXHRcdFx0c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxUb3AgPSBzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodDsgLy8gc2Nyb2xsIHRvIGJvdHRvbVxuXHRcdFx0c3Bldy5zdGlja3lfYm90dG9tPXRydWU7XG4vL2NvbnNvbGUubG9nKGUud2hpY2gpO1xuXHRcdFx0aWYoZS53aGljaCE9OSl7dGFiX3NldD0tMTt9IC8vIGRpc2FibGUgdGFiIGhpc3Rvcnkgb24gYW55IG90aGVyIGtleSB0aGFuIHRhYlxuXHRcdFx0c3dpdGNoKGUud2hpY2gpXG5cdFx0XHR7XG5cdFx0XHRcdGNhc2UgOTogLy90YWJcblx0XHRcdFx0XHRpZih0YWJfc2V0PT0tMSkgLy8gZmlyc3QgdGFiXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGFiX3M9c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LnZhbCgpO1xuXHRcdFx0XHRcdFx0dGFiX2VkPXRhYl9zLm1hdGNoKC9cXHcrJC8pO1xuXHRcdFx0XHRcdFx0aWYodGFiX2VkKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0YWJfZWQ9dGFiX2VkLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuXHRcdFx0XHRcdFx0XHR0YWJfYmc9dGFiX3Muc3Vic3RyKDAsdGFiX3MubGVuZ3RoLXRhYl9lZC5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIC8vIG5leHQgdGFiXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiggdGFiX2VkIClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YXIgbnVtPTA7XG5cdFx0XHRcdFx0XHRmb3IoIG4gaW4gc3Bldy51c2VycyApXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGlmKCBuLnN1YnN0cigwLHRhYl9lZC5sZW5ndGgpLnRvTG93ZXJDYXNlKCk9PXRhYl9lZCApXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRpZihudW0+PXRhYl9zZXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYodGFiX3NldD09LTEpe3RhYl9zZXQrKzt9IC8vIG1hcmsgYXMgYWN0aXZlIG5vd1xuXHRcdFx0XHRcdFx0XHRcdFx0dGFiX3NldCsrO1xuXHRcdFx0XHRcdFx0XHRcdFx0c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LnZhbCh0YWJfYmcrbik7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdG51bSsrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZih0YWJfc2V0Pi0xKSAvLyB3ZSBmb3VuZCBvbmUgYmVmb3JlLCBzbyB3cmFwXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRhYl9zZXQ9MDtcblx0XHRcdFx0XHRcdFx0c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LnZhbCh0YWJfcyk7XG5cdFx0XHRcdFx0XHR9XG4vL2NvbnNvbGUubG9nKGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzNzogLy9sZWZ0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM4OiAvL3VwXG5cdFx0XHRcdFx0dmFyIGNsPXNwZXcub3B0c1tcImNtZGxvZ1wiXTsgLy8gbW9zdCByZWNlbnQgYXQgdGhlIGJvdHRvbVxuXHRcdFx0XHRcdHZhciBzPVwiXCJcblx0XHRcdFx0XHRjbWRsb2dfb2ZmLT0xO1xuXHRcdFx0XHRcdGlmKGNtZGxvZ19vZmY8MCkgeyBjbWRsb2dfb2ZmPTA7IH1cblx0XHRcdFx0XHRpZihjbFtjbWRsb2dfb2ZmXSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzPWNsW2NtZGxvZ19vZmZdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQudmFsKHMpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzk6IC8vcmlnaHRcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDA6IC8vZG93blxuXHRcdFx0XHRcdHZhciBjbD1zcGV3Lm9wdHNbXCJjbWRsb2dcIl07IC8vIG1vc3QgcmVjZW50IGF0IHRoZSBib3R0b21cblx0XHRcdFx0XHR2YXIgcz1cIlwiXG5cdFx0XHRcdFx0Y21kbG9nX29mZis9MTtcblx0XHRcdFx0XHRpZihjbWRsb2dfb2ZmPmNsLmxlbmd0aCkgeyBjbWRsb2dfb2ZmPWNsLmxlbmd0aDsgfVxuXHRcdFx0XHRcdGlmKGNsW2NtZGxvZ19vZmZdKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHM9Y2xbY21kbG9nX29mZl07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dC52YWwocyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHRhYl9zZXQ9LTE7IC8vIGRpYWJsZSBtdWx0aXBsZSB0YWJzXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KTsgLy8gdHlwaW5nIHNjcm9sbHMgdXMgdG8gdGhlIGJvdHRvbVxuXHRcblx0XHQkKFwiLndldHNwZXdfdGFicyBhXCIpLmNsaWNrKHNwZXcuY2xpY2tfdGFiKTtcblx0XHRzcGV3LnNob3dfdGFiKFwibG9naW5cIik7XG5cdFx0XG4vKlx0XG5zcGV3LmRpdl93ZXR2LmFwcGVuZCgkKCc8dmlkZW8gc3R5bGU9XCJ3aWR0aDoxMDAlO2hlaWdodDoxMDAlO1wiICcrXG4nIHNyYz1cImh0dHA6Ly93d3cuYXJjaGl2ZS5vcmcvZG93bmxvYWQvaG9ycm9yX2V4cHJlc3NfaXBvZC9ob3Jyb3JfZXhwcmVzc181MTJrYi5tcDRcIiAnK1xuJyBjb250cm9scz1cImNvbnRyb2xzXCIgYXV0b3BsYXk9XCJhdXRvcGxheVwiPjwvdmlkZW8+JykpO1xuKi9cblxuXG5cdFx0JChzcGV3LmRpdl90YWxrX2Zvcm0pLnN1Ym1pdChmdW5jdGlvbigpe1xuXG5cdFx0XHR2YXIgbGluZSA9ICQoc3Bldy5kaXZfdGFsa19mb3JtX2lucHV0KS52YWwoKTtcblx0XHRcdHNwZXcuZG9fbGluZShsaW5lKTtcblxuXHRcdCAgJChzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQpLnZhbCgnJyk7Ly8uZm9jdXMoKTtcblx0XHQgIHJldHVybiBmYWxzZTtcblx0XHR9KVxuXG5cdFx0c3Bldy5zb2NrX3NldHVwKCk7XG5cdFx0XG4vL1x0XHR2YXIgbGFzdF9ob3ZlcjtcblxuXHRcdCQoZG9jdW1lbnQpLm9uKFwibW91c2VlbnRlclwiLFwiLndldHNwZXdfbmFtZVwiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBuYW1lPSQodGhpcykuZGF0YShcIm5hbWVcIik7XG5cdFx0XHRcdGlmKCFuYW1lKXsgbmFtZT0kKHRoaXMpLmh0bWwoKTsgfSAvLyB0aGlzIHNob3VsZCBiZSB0aGUgbmFtZVxuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHU9c3Bldy51c2Vyc1tuYW1lXTtcbi8vXHRcdFx0XHRpZih1ICYmICh0aGlzIT1sYXN0X2hvdmVyKSlcblx0XHRcdFx0aWYodSlcblx0XHRcdFx0e1xuLy9cdFx0XHRcdFx0bGFzdF9ob3Zlcj10aGlzO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdCQodGhpcykuZGF0YShcIm5hbWVcIixuYW1lKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR1Lm5hbWVzcGFuPSQodGhpcyk7IC8vIHRoaXMgaXMgdGhlIG9uZSB3ZSB3YW50IHRvIHVwZGF0ZVxuXHRcdFx0XHRcdHNwZXcuc2VuZF9tc2coe2NtZDpcIm5vdGVcIixub3RlOlwiaW5mb1wiLGluZm86XCJ1c2VyXCIsbmFtZTpuYW1lfSk7IC8vIGFzayB0aGUgc2VydmVyIGZvciBpbmZvXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuLypcdFx0XHRcblx0XHQkKGRvY3VtZW50KS5vbihcIm1vdXNlbGVhdmVcIixcIi53ZXRzcGV3X25hbWVcIixmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbmFtZT0kKHRoaXMpLmRhdGEoXCJuYW1lXCIpO1xuXHRcdFx0XHRpZighbmFtZSl7IG5hbWU9JCh0aGlzKS5odG1sKCk7IH0gLy8gdGhpcyBzaG91bGQgYmUgdGhlIG5hbWVcblx0XHRcdFx0dmFyIHU9c3Bldy51c2Vyc1tuYW1lXTtcblx0XHRcdFx0aWYodSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHUubmFtZXNwYW49dW5kZWZpbmVkOyAvLyBkbyBub3QgdXBkYXRlXG5cdFx0XHRcdH1cblx0XHRcdFx0JCh0aGlzKS5odG1sKG5hbWUpO1xuXHRcdFx0fSk7XHRcdFxuKi9cdFx0XG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtzcGV3LnVwZGF0ZSgpO30sMTAwMCkgLy8gY2FsbCBvbmNlIGEgc2VjXG5cdFx0cmV0dXJuIHNwZXc7XG5cdH07XG5cdFx0XG5cdFxuXG5cdHNwZXcudXBkYXRlPWZ1bmN0aW9uKCl7XG5cdFx0c3Bldy55dGFwaV9jb3VudCsrO1xuXHRcdGlmKCBzcGV3Lm9wdHMudHYgKSAvLyB0diBtdXN0IGJlIGVuYWJsZWRcblx0XHR7XG5cdFx0XHRpZighc3Bldy55dGFwaSkgLy8gcmVsb2FkIHlvdXR1YmUgaWYgaXQgZmFpbHNcblx0XHRcdHtcblx0XHRcdFx0aWYoIHNwZXcueXRhcGlfY291bnQ+NSApIC8vIHdhaXQgYSB3aGlsZSBiZXR3ZWVuIHJldHJ5c1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3Bldy55dGFwaV9jb3VudD0wO1xuXG5cdFx0XHRcdFx0bmV3IFlULlBsYXllcignd2V0c3Bld193ZXR2Jywge1xuXHRcdFx0XHRcdFx0d2lkdGg6ICc2NDAnLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAnNDgwJyxcblx0XHRcdFx0XHRcdHZpZGVvSWQ6ICc5WFZjSWktc0xsaycsXG5cdFx0XHRcdFx0XHRldmVudHM6IHtcblx0XHRcdFx0XHRcdCdvblJlYWR5JzogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRzcGV3Lnl0YXBpPWV2ZW50LnRhcmdldDtcblx0XHRcdFx0XHRcdFx0XHRzcGV3LnNlbmRfbXNnKHtjbWQ6XCJnYW1lXCIsZ2NtZDpcIndldHZcIix3ZXR2OlwicmVhZHlcIn0pOyAvLyBnZXQgY3VycmVudCB2aWRcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZXZlbnQuZGF0YSA9PSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRCApXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0c3Bldy5zZW5kX21zZyh7Y21kOlwiZ2FtZVwiLGdjbWQ6XCJ3ZXR2XCIsd2V0djpcImluZm9cIn0pOyAvLyB0aGlzIHRlbGxzIHRoZSBzZXJ2ZXIgdG8gcGxheSBuZXh0IHZpZFxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGlmKHNwZXcueXRhcGkuc2V0U2l6ZSkgLy8gJiYgIXNwZXcueXRhcGlfcmVhZHkgKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3Bldy55dGFwaV9yZWFkeT10cnVlO1xuXHQvL1x0XHRcdFx0c3Bldy55dGFwaS5zZXRTaXplKDY0MCw0ODApO1xuXHQvL1x0XHRcdFx0c3Bldy55dGFwaS5sb2FkVmlkZW9CeUlkKFwieWxMenlIazU0WjBcIik7XG5cdFx0XHRcdFx0aWYoc3Bldy5uZXh0cXZpZClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcGV3Lnl0YXBpLmxvYWRWaWRlb0J5SWQoc3Bldy5uZXh0cXZpZC52aWQsc3Bldy5uZXh0cXZpZC5udW0pO1xuXHRcdFx0XHRcdFx0c3Bldy5mb3JjZXRpbWU9c3Bldy5uZXh0cXZpZC5udW07XG4vL2NvbnNvbGUubG9nKFwiZm9yY2V0aW1lIHNldCBcIitzcGV3LmZvcmNldGltZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNwZXcubmV4dHF2aWQ9dW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZihzcGV3LmZvcmNldGltZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBkPXNwZXcueXRhcGkuZ2V0Q3VycmVudFRpbWUoKTtcblx0XHRcdFx0XHRpZiggZCAmJiAoZCE9MCkgKSAvLyBpdCBzaXRzIG9uIDAgZm9yIGEgd2hpbGUsIHdhaXQgZm9yIGl0IHRvIGNoYW5nZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGQ9ZC1zcGV3LmZvcmNldGltZTtcbi8vY29uc29sZS5sb2coXCJmb3JjZXRpbWUgZGlmZiBcIitkKTtcblx0XHRcdFx0XHRcdGlmKE1hdGguYWJzKGQpPDEwKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzcGV3LmZvcmNldGltZT11bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNwZXcueXRhcGkuc2Vla1RvKHNwZXcuZm9yY2V0aW1lLHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIC8vIHVubG9hZCB0dlxuXHRcdHtcblx0XHRcdHNwZXcueXRhcGk9dW5kZWZpbmVkO1xuXHRcdFx0c3Bldy55dGFwaV9jb3VudD05OTk5O1xuXHRcdFx0JChcIiN3ZXRzcGV3X3dldHZcIikucmVwbGFjZVdpdGgoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3dldHZcXFwiIGlkPVxcXCJ3ZXRzcGV3X3dldHZcXFwiID48L2Rpdj5cIik7XG5cdFx0fVxuXHRcdFxuXHRcdGlmKHNwZXcuc3RpY2t5X2JvdHRvbSlcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbFRvcCA9IHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0OyAvLyBzY3JvbGwgdG8gYm90dG9tXG5cdFx0fVxuXHR9O1xuXG4vLyBoYW5kbGUgYSBsaW5lIGlucHV0IGZyb20gdGhlIHVzZXJcbi8vIHByb2JhYmx5IG1lYW5zIHNlbmRpbmcgYSBtc2cgdG8gdGhlIHNwZXcgc2VydmVyXG5cblx0c3Bldy5kb19saW5lPWZ1bmN0aW9uKGxpbmUpe1xuXG5cdFx0XHRcblx0XHR2YXIgYWE9bGluZS5zcGxpdChcIiBcIik7IC8vIHRoaXMgcmVxdWlyZXMgYSByZWFsIHNwYWNlIHRvIHNlcGVyYXRlIGFyZ3MuLi5cblx0XHR2YXIgY21kPWFhWzBdO1xuXG5cdFx0aWYoY21kPT1cIi9jb25uZWN0XCIpXG5cdFx0e1xuXHRcdFx0bGluZT1udWxsOyAvLyBkbyBub3Qgc2VuZCB0byBzZXJ2ZXJcblx0XHRcdHNwZXcuc29ja19zZXR1cCgpOyAvLyB0cnkgYW5kIHNldHVwIHRoZSBzZXJ2ZXJzdHVmZnMgYWdhaW5cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdGlmKGNtZD09XCIvZGlzY29ubmVjdFwiKVxuXHRcdHtcblx0XHRcdGxpbmU9bnVsbDsgLy8gZG8gbm90IHNlbmQgdG8gc2VydmVyXG5cdFx0XHRzcGV3LnNvY2tfY2xlYW4oKTsgLy8gZHJvcCBjb25uZWN0aW9uIHRvIHNlcnZlclxuXHRcdH1cblxuXHRcdGlmKGxpbmUpXG5cdFx0e1xuXHRcdFx0c3Bldy5zZW5kX21zZyhzcGV3LmNtZF90b19tc2cobGluZSkpO1xuXHRcdH1cblxuXHR9O1xuXG59O1xuIiwiXG52YXIgbHM9ZnVuY3Rpb24oYSkgeyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoYSx7ZGVwdGg6bnVsbH0pKTsgfVxuXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKG9wdHMpe1xuXG5cblx0dmFyIHNwZXc9e307XG5cblx0c3Bldy5zdG9yYWdlX2F2YWlsYWJsZT10eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSE9PSd1bmRlZmluZWQnO1xuXHRzcGV3Lmpzb25fYXZhaWxhYmxlPXR5cGVvZiB3aW5kb3cuSlNPTiE9PSd1bmRlZmluZWQnO1xuXG5cblx0c3Bldy51c2Vycz17fTtcblxuXHRzcGV3Lm1heF9pbWFnZV9zaXplPTEwMjQqMTAyNDsgLy8gMSBtZWcgc2VlbXMgcmVhc29uYWJsZT8gYmlnZ2VyIGZpbGVzIGFyZSBub3QgZGlzcGxheWVkXG5cdHNwZXcuZmlsZXNpemVzPXt9OyAvLyBtYXAgdXJscyB0byBmaWxlIHNpemVzXG5cdFxuXHRzcGV3Lnl0YXBpPXVuZGVmaW5lZDtcblx0c3Bldy55dGFwaV9jb3VudD05OTk5O1xuXG5cdHJlcXVpcmUoJy4vc3Bldy5vcHRzLmpzJykuc2V0dXAoc3Bldyk7XG5cdHJlcXVpcmUoJy4vc3Bldy5zb2NrLmpzJykuc2V0dXAoc3Bldyk7XG5cdHJlcXVpcmUoJy4vc3Bldy5uYW1lcy5qcycpLnNldHVwKHNwZXcpO1xuXHRyZXF1aXJlKCcuL3NwZXcuaHRtbC5qcycpLnNldHVwKHNwZXcpO1xuXHRcblx0c3Bldy5odG1sX3NldHVwKG9wdHMpO1xuXHRcdFx0XG5cdHJldHVybiBzcGV3O1xufTtcbiIsIlxuZXhwb3J0cy5zZXR1cD1mdW5jdGlvbihzcGV3KXtcblxuLy8gcmFuZG9tIG5hbWVzXG5cdFxuc3Bldy5yYW5kb21fbmFtZT1mdW5jdGlvbigpe1xudmFyIHR4dF9hZGplY3RpdmVzPVtcblx0XCJyYXZpc2hpbmdcIixcblx0XCJtaW1pY1wiLFxuXHRcImZhbW91c1wiLFxuXHRcImNoZWVyZnVsXCIsXG5cdFwibGl2aWRcIixcblx0XCJvYnN0aW5hdGVcIixcblx0XCJleGhhdXN0ZWRcIixcblx0XCJncmFjZWZ1bFwiLFxuXHRcIm91dHJhZ2VvdXNcIixcblx0XCJyYWRpY2FsXCIsXG5cdFwiY2hpbGRpc2hcIixcblx0XCJzbm9iYmlzaFwiLFxuXHRcIm1pc2VybHlcIixcblx0XCJhbWlhYmxlXCIsXG5cdFwiZGlzZ3VzdGluZ1wiLFxuXHRcImF3ZnVsXCIsXG5cdFwiaHVtb3JvdXNcIixcblx0XCJmYW5jaWZ1bFwiLFxuXHRcInBhdGhldGljXCIsXG5cdFwid2luZHlcIixcblx0XCJkdXN0eVwiLFxuXHRcImJhc2hmdWxcIixcblx0XCJmcmVha3lcIixcblx0XCJjaGlsbHlcIixcblx0XCJzdG9ybXlcIixcblx0XCJodW1pZFwiLFxuXHRcImJvdW50aWZ1bFwiLFxuXHRcImp1YmlsYW50XCIsXG5cdFwiaXJyaXRhdGVkXCIsXG5cdFwicGF0aWVudFwiLFxuXHRcImRpenp5XCIsXG5cdFwic2tlcHRpY2FsXCIsXG5cdFwicHV6emxlZFwiLFxuXHRcInBlcnBsZXhlZFwiLFxuXHRcImpvdmlhbFwiLFxuXHRcImh5cGVyXCIsXG5cdFwic3F1aXJyZWx5XCIsXG5cdFwiaml0dGVyeVwiLFxuXHRcImVsZWdhbnRcIixcblx0XCJnbGVlZnVsXCIsXG5cdFwiZHJlYXJ5XCIsXG5cdFwiaW1waXNoXCIsXG5cdFwic25lYWt5XCIsXG5cdFwiaG9ycmlkXCIsXG5cdFwibW9uc3Rlcm91c1wiLFxuXHRcImFibGVcIixcblx0XCJhYm5vcm1hbFwiLFxuXHRcImFic2VudFwiLFxuXHRcImFic29sdXRlXCIsXG5cdFwiYWNjdXJhdGVcIixcblx0XCJhY2lkaWNcIixcblx0XCJhY291c3RpY1wiLFxuXHRcImFjdGl2ZVwiLFxuXHRcImFkZXF1YXRlXCIsXG5cdFwiYWlyYm9ybmVcIixcblx0XCJhaXJ5XCIsXG5cdFwiYWxsXCIsXG5cdFwiYWxvbmVcIixcblx0XCJhbWVyaWNhblwiLFxuXHRcImFtcGhpYmlvdXNcIixcblx0XCJhbmdyeVwiLFxuXHRcImFubnVhbFwiLFxuXHRcImFub3RoZXJcIixcblx0XCJhbnlcIixcblx0XCJhcHBhcmVudFwiLFxuXHRcImFydGlmaWNpYWxcIixcblx0XCJhdG9taWNcIixcblx0XCJhdWRpYmxlXCIsXG5cdFwiYXV0b21hdGljXCIsXG5cdFwiYXV4aWxpYXJ5XCIsXG5cdFwiYXZhaWxhYmxlXCIsXG5cdFwiYmFkXCIsXG5cdFwiYmFsbGlzdGljXCIsXG5cdFwiYmFyZVwiLFxuXHRcImJhc2ljXCIsXG5cdFwiYmVhdXRpZnVsXCIsXG5cdFwiYmVuZWZpY2lhbFwiLFxuXHRcImJlc3RcIixcblx0XCJiZXR0ZXJcIixcblx0XCJiaWdcIixcblx0XCJiaWdnZXN0XCIsXG5cdFwiYmluYXJ5XCIsXG5cdFwiYmlwb2xhclwiLFxuXHRcImJpdHRlclwiLFxuXHRcImJsYWNrXCIsXG5cdFwiYmxpbmRcIixcblx0XCJibHVlXCIsXG5cdFwiYm90aFwiLFxuXHRcImJyaWVmXCIsXG5cdFwiYnJpZ2h0XCIsXG5cdFwiYnJvYWRcIixcblx0XCJicm93blwiLFxuXHRcImJ1c3lcIixcblx0XCJjYXBhYmxlXCIsXG5cdFwiY2FyZWZ1bFwiLFxuXHRcImNhcmVsZXNzXCIsXG5cdFwiY2FybmFsXCIsXG5cdFwiY2F1dGlvdXNcIixcblx0XCJjZWxlc3RpYWxcIixcblx0XCJjZWxzaXVzXCIsXG5cdFwiY2VudHJhbFwiLFxuXHRcImNlcmFtaWNcIixcblx0XCJjZXJ0YWluXCIsXG5cdFwiY2hlYXBcIixcblx0XCJjaGVhcGVyXCIsXG5cdFwiY2l2aWxcIixcblx0XCJjbGVhblwiLFxuXHRcImNsZWFyXCIsXG5cdFwiY2xvc2VyXCIsXG5cdFwiY29hcnNlXCIsXG5cdFwiY29sZFwiLFxuXHRcImNvbW1vblwiLFxuXHRcImNvbXBhY3RcIixcblx0XCJjb21wbGV0ZVwiLFxuXHRcImNvbXBsZXhcIixcblx0XCJjb21wb3VuZFwiLFxuXHRcImNvbXB1bHNvcnlcIixcblx0XCJjb25jcmV0ZVwiLFxuXHRcImNvbnNjaW91c1wiLFxuXHRcImNvbnN0YW50XCIsXG5cdFwiY29udGludW91c1wiLFxuXHRcImNvbnZlbmllbnRcIixcblx0XCJjb29sXCIsXG5cdFwiY29ycmVjdFwiLFxuXHRcImNvcnJvc2l2ZVwiLFxuXHRcImNyaXRpY2FsXCIsXG5cdFwiY3J1ZWxcIixcblx0XCJjdWJpY1wiLFxuXHRcImN1bHBhYmxlXCIsXG5cdFwiY3VycmVudFwiLFxuXHRcImRhaWx5XCIsXG5cdFwiZGFuZ2Vyb3VzXCIsXG5cdFwiZGFya1wiLFxuXHRcImRhcmtlclwiLFxuXHRcImRhcmtlc3RcIixcblx0XCJkZWFkXCIsXG5cdFwiZGVhZlwiLFxuXHRcImRlYXJcIixcblx0XCJkZWFyZXJcIixcblx0XCJkZWFyZXN0XCIsXG5cdFwiZGVjaW1hbFwiLFxuXHRcImRlZXBcIixcblx0XCJkZWVwZXJcIixcblx0XCJkZWVwZXN0XCIsXG5cdFwiZGVmZWN0aXZlXCIsXG5cdFwiZGVmaW5pdGVcIixcblx0XCJkZWxpY2F0ZVwiLFxuXHRcImRlbnRhbFwiLFxuXHRcImRlcGVuZGVudFwiLFxuXHRcImRlc3RydWN0aXZlXCIsXG5cdFwiZGlhZ29uYWxcIixcblx0XCJkaWZmZXJlbnRcIixcblx0XCJkaWZmaWN1bHRcIixcblx0XCJkaWdpdGFsXCIsXG5cdFwiZGltXCIsXG5cdFwiZGlzZWFzZWRcIixcblx0XCJkaXN0aW5jdFwiLFxuXHRcImRpdHR5XCIsXG5cdFwiZG9ybWFudFwiLFxuXHRcImRvdWJsZVwiLFxuXHRcImRyYWZ0eVwiLFxuXHRcImRyaWVyXCIsXG5cdFwiZHJpZXN0XCIsXG5cdFwiZHJvd3N5XCIsXG5cdFwiZHJ5XCIsXG5cdFwiZHVhbFwiLFxuXHRcImR1ZVwiLFxuXHRcImR1bGxcIixcblx0XCJkdW1iXCIsXG5cdFwiZHluYW1pY1wiLFxuXHRcImVhY2hcIixcblx0XCJlYXN5XCIsXG5cdFwiZWlnaHRoXCIsXG5cdFwiZWl0aGVyXCIsXG5cdFwiZWxhc3RpY1wiLFxuXHRcImVsZWN0cmljXCIsXG5cdFwiZWxpZ2libGVcIixcblx0XCJlbHNlXCIsXG5cdFwiZW1wdHlcIixcblx0XCJlbm91Z2hcIixcblx0XCJlbnRpcmVcIixcblx0XCJlcXVhbFwiLFxuXHRcImVyZWN0XCIsXG5cdFwiZXJyYXRpY1wiLFxuXHRcImVzc2VudGlhbFwiLFxuXHRcImV2ZW50dWFsXCIsXG5cdFwiZXZlcnlcIixcblx0XCJldmVyeWRheVwiLFxuXHRcImV2aWRlbnRcIixcblx0XCJleGFjdFwiLFxuXHRcImV4Y2VsbGVudFwiLFxuXHRcImV4Y2Vzc2l2ZVwiLFxuXHRcImV4Y2x1c2l2ZVwiLFxuXHRcImV4cGxvc2l2ZVwiLFxuXHRcImV4dGVuc2l2ZVwiLFxuXHRcImV4dGVybmFsXCIsXG5cdFwiZXh0cmFcIixcblx0XCJleHRyZW1lXCIsXG5cdFwiZXh0cmluc2ljXCIsXG5cdFwiZmFpbnRcIixcblx0XCJmYWlyXCIsXG5cdFwiZmFsc2VcIixcblx0XCJmYW1pbGlhclwiLFxuXHRcImZhc3RcIixcblx0XCJmYXRcIixcblx0XCJmYXRhbFwiLFxuXHRcImZhdHRlc3RcIixcblx0XCJmYXVsdHlcIixcblx0XCJmZWFzaWJsZVwiLFxuXHRcImZlZGVyYWxcIixcblx0XCJmZWVibGVcIixcblx0XCJmZXJ0aWxlXCIsXG5cdFwiZmV3XCIsXG5cdFwiZmlmdGhcIixcblx0XCJmaW5hbFwiLFxuXHRcImZpbmVcIixcblx0XCJmaXJtXCIsXG5cdFwiZmlyc3RcIixcblx0XCJmaXNjYWxcIixcblx0XCJmaXRcIixcblx0XCJmbGFtbWFibGVcIixcblx0XCJmbGF0XCIsXG5cdFwiZmxleGlibGVcIixcblx0XCJmb2dneVwiLFxuXHRcImZvb2xpc2hcIixcblx0XCJmb3JlaWduXCIsXG5cdFwiZm9ybWFsXCIsXG5cdFwiZm9ybWVyXCIsXG5cdFwiZm91cnRoXCIsXG5cdFwiZnJlZVwiLFxuXHRcImZyZXF1ZW50XCIsXG5cdFwiZnJlc2hcIixcblx0XCJmdWxsXCIsXG5cdFwiZ2FtbWFcIixcblx0XCJnZW5lcmFsXCIsXG5cdFwiZ2VudGxlXCIsXG5cdFwiZ29vZFwiLFxuXHRcImdyYWR1YWxcIixcblx0XCJncmFuZFwiLFxuXHRcImdyYXBoaWNcIixcblx0XCJncmF2ZVwiLFxuXHRcImdyYXlcIixcblx0XCJncmVhdFwiLFxuXHRcImdyZWVuXCIsXG5cdFwiZ3JpZXZvdXNcIixcblx0XCJncm9jZXJ5XCIsXG5cdFwiaGFwcHlcIixcblx0XCJoYXJkXCIsXG5cdFwiaGFybWZ1bFwiLFxuXHRcImhhemFyZG91c1wiLFxuXHRcImhlYWx0aHlcIixcblx0XCJoZWF2eVwiLFxuXHRcImhlbHBmdWxcIixcblx0XCJoaWdoXCIsXG5cdFwiaGlsbHlcIixcblx0XCJoaW5kXCIsXG5cdFwiaG9sbG93XCIsXG5cdFwiaG90XCIsXG5cdFwiaHVnZVwiLFxuXHRcImljeVwiLFxuXHRcImlkZW50aWNhbFwiLFxuXHRcImlkbGVcIixcblx0XCJpbGxcIixcblx0XCJpbW1pbmVudFwiLFxuXHRcImltcG9ydGFudFwiLFxuXHRcImltcHJvcGVyXCIsXG5cdFwiaW5ib2FyZFwiLFxuXHRcImlubmVyXCIsXG5cdFwiaW5zdGFudFwiLFxuXHRcImludGVuc2VcIixcblx0XCJpbnRlcm5hbFwiLFxuXHRcImludHJpbnNpY1wiLFxuXHRcIml0ZXJhdGl2ZVwiLFxuXHRcImpldFwiLFxuXHRcImp1bGlhblwiLFxuXHRcImp1bmlvclwiLFxuXHRcImtlZW5cIixcblx0XCJrZWx2aW5cIixcblx0XCJraW5kXCIsXG5cdFwia25vYmJlZFwiLFxuXHRcImxhcmdlXCIsXG5cdFwibGFzdFwiLFxuXHRcImxhdGVcIixcblx0XCJsYXdmdWxcIixcblx0XCJsYXp5XCIsXG5cdFwibGVha3lcIixcblx0XCJsZWFuXCIsXG5cdFwibGVhc3RcIixcblx0XCJsZWdhbFwiLFxuXHRcImxlc3NcIixcblx0XCJsZXRoYWxcIixcblx0XCJsZXZlbFwiLFxuXHRcImxpa2VseVwiLFxuXHRcImxpbmVhclwiLFxuXHRcImxpcXVpZFwiLFxuXHRcImxpdGVyYWxcIixcblx0XCJsaXR0bGVcIixcblx0XCJsaXZlbHlcIixcblx0XCJsb2NhbFwiLFxuXHRcImxvbmVcIixcblx0XCJsb25nXCIsXG5cdFwibG9vc2VcIixcblx0XCJsb3VkXCIsXG5cdFwibG93XCIsXG5cdFwibWFnbmV0aWNcIixcblx0XCJtYWluXCIsXG5cdFwibWFueVwiLFxuXHRcIm1hcGxlXCIsXG5cdFwibWFyaW5lXCIsXG5cdFwibWFydGlhbFwiLFxuXHRcIm1lYW5cIixcblx0XCJtZWRpY2FsXCIsXG5cdFwibWVudGFsXCIsXG5cdFwibWVyZVwiLFxuXHRcIm1ldGFsbGljXCIsXG5cdFwibWlkZGxlXCIsXG5cdFwibWlub3JcIixcblx0XCJtaW51c1wiLFxuXHRcIm1pc3R5XCIsXG5cdFwibW5lbW9uaWNcIixcblx0XCJtb2JpbGVcIixcblx0XCJtb2Rlcm5cIixcblx0XCJtb2R1bGFyXCIsXG5cdFwibW9sdGVuXCIsXG5cdFwibW9yYWxcIixcblx0XCJtb3JlXCIsXG5cdFwibW9zdFwiLFxuXHRcIm1vdmFibGVcIixcblx0XCJtdWRkeVwiLFxuXHRcIm11bHRpcGxlXCIsXG5cdFwibXV0dWFsXCIsXG5cdFwibmFrZWRcIixcblx0XCJuYXJjb3RpY1wiLFxuXHRcIm5hcnJvd1wiLFxuXHRcIm5hdGlvbmFsXCIsXG5cdFwibmF0dXJhbFwiLFxuXHRcIm5hdXRpY2FsXCIsXG5cdFwibmF2YWxcIixcblx0XCJuZWF0XCIsXG5cdFwibmVjZXNzYXJ5XCIsXG5cdFwibmVnYXRpdmVcIixcblx0XCJuZXJ2b3VzXCIsXG5cdFwibmV1dHJhbFwiLFxuXHRcIm5ld1wiLFxuXHRcIm5leHRcIixcblx0XCJuaWNlXCIsXG5cdFwibm9pc3lcIixcblx0XCJub21pbmFsXCIsXG5cdFwibm9ybWFsXCIsXG5cdFwibnVjbGVhclwiLFxuXHRcIm51bWVyaWNcIixcblx0XCJudW1lcmljYWxcIixcblx0XCJudW1lcm91c1wiLFxuXHRcIm9ic29sZXRlXCIsXG5cdFwib2J2aW91c1wiLFxuXHRcIm9kZFwiLFxuXHRcIm9mZmxpbmVcIixcblx0XCJva2F5XCIsXG5cdFwib2xkXCIsXG5cdFwib25saW5lXCIsXG5cdFwib3BlblwiLFxuXHRcIm9wdGltdW1cIixcblx0XCJvcHRpb25hbFwiLFxuXHRcIm9yYWxcIixcblx0XCJvcmRpbmFyeVwiLFxuXHRcIm9yaWdpbmFsXCIsXG5cdFwib3RoZXJcIixcblx0XCJvdXRib2FyZFwiLFxuXHRcIm91dGVyXCIsXG5cdFwib3V0c2lkZVwiLFxuXHRcIm91dHdhcmRcIixcblx0XCJvdmVyaGVhZFwiLFxuXHRcIm92ZXJzaXplXCIsXG5cdFwib3duXCIsXG5cdFwicGFsZVwiLFxuXHRcInBhbGVyXCIsXG5cdFwicGFsZXN0XCIsXG5cdFwicGFyYWxsZWxcIixcblx0XCJwYXJ0aWFsXCIsXG5cdFwicGFzc2l2ZVwiLFxuXHRcInBhc3RcIixcblx0XCJwZWN1bGlhclwiLFxuXHRcInBlcmlvZGljXCIsXG5cdFwicGVybWFuZW50XCIsXG5cdFwicGVyc29uYWxcIixcblx0XCJwZXR0eVwiLFxuXHRcInBob25ldGljXCIsXG5cdFwicGh5c2ljYWxcIixcblx0XCJwbGFpblwiLFxuXHRcInBsYW5hclwiLFxuXHRcInBsZW50eVwiLFxuXHRcInBvaXNvbm91c1wiLFxuXHRcInBvbGl0ZVwiLFxuXHRcInBvbGl0aWNhbFwiLFxuXHRcInBvb3JcIixcblx0XCJwb3J0YWJsZVwiLFxuXHRcInBvc2l0aXZlXCIsXG5cdFwicG9zc2libGVcIixcblx0XCJwb3RlbnRpYWxcIixcblx0XCJwb3dlcmZ1bFwiLFxuXHRcInByYWN0aWNhbFwiLFxuXHRcInByZWNpc2VcIixcblx0XCJwcmV0dHlcIixcblx0XCJwcmV2aW91c1wiLFxuXHRcInByaW1hcnlcIixcblx0XCJwcmlvclwiLFxuXHRcInByaXZhdGVcIixcblx0XCJwcm9iYWJsZVwiLFxuXHRcInByb21wdFwiLFxuXHRcInByb3BlclwiLFxuXHRcInByb3RlY3RpdmVcIixcblx0XCJwcm94aW1hdGVcIixcblx0XCJwdW5pdGl2ZVwiLFxuXHRcInB1cmVcIixcblx0XCJwdXJwbGVcIixcblx0XCJxdWlja1wiLFxuXHRcInF1aWV0XCIsXG5cdFwicmFuZG9tXCIsXG5cdFwicmFwaWRcIixcblx0XCJyYXdcIixcblx0XCJyZWFkeVwiLFxuXHRcInJlYWxcIixcblx0XCJyZWRcIixcblx0XCJyZWdpb25hbFwiLFxuXHRcInJlZ3VsYXJcIixcblx0XCJyZWxhdGl2ZVwiLFxuXHRcInJlbGlhYmxlXCIsXG5cdFwicmVtb3RlXCIsXG5cdFwicmVtb3ZhYmxlXCIsXG5cdFwicmVzcG9uc2libGVcIixcblx0XCJyZXRhaWxcIixcblx0XCJyZXVzYWJsZVwiLFxuXHRcInJpY2hcIixcblx0XCJyaWNoZXJcIixcblx0XCJyaWNoZXN0XCIsXG5cdFwicmlnaHRcIixcblx0XCJyaWdpZFwiLFxuXHRcInJpcGVcIixcblx0XCJyb3VnaFwiLFxuXHRcInNhZFwiLFxuXHRcInNhZGRlclwiLFxuXHRcInNhZGRlc3RcIixcblx0XCJzYWZlXCIsXG5cdFwic2FmZXJcIixcblx0XCJzYWZlc3RcIixcblx0XCJzYW1lXCIsXG5cdFwic2Vjb25kYXJ5XCIsXG5cdFwic2VjdXJlXCIsXG5cdFwic2VuaW9yXCIsXG5cdFwic2Vuc2l0aXZlXCIsXG5cdFwic2VwYXJhdGVcIixcblx0XCJzZXJpb3VzXCIsXG5cdFwic2V2ZW50aFwiLFxuXHRcInNldmVyYWxcIixcblx0XCJzZXZlcmVcIixcblx0XCJzaGFkeVwiLFxuXHRcInNoYWxsb3dcIixcblx0XCJzaGFycFwiLFxuXHRcInNoeVwiLFxuXHRcInNoaW55XCIsXG5cdFwic2hvcnRcIixcblx0XCJzaWNrXCIsXG5cdFwic2lsZW50XCIsXG5cdFwic2ltaWxhclwiLFxuXHRcInNpbXBsZVwiLFxuXHRcInNpbmdsZVwiLFxuXHRcInNpeHRoXCIsXG5cdFwic2xhY2tcIixcblx0XCJzbGlnaHRcIixcblx0XCJzbGlwcGVyeVwiLFxuXHRcInNsb3dlclwiLFxuXHRcInNsb3dlc3RcIixcblx0XCJzbWFsbFwiLFxuXHRcInNtYXJ0XCIsXG5cdFwic21vb3RoXCIsXG5cdFwic251Z1wiLFxuXHRcInNvY2lhbFwiLFxuXHRcInNvZnRcIixcblx0XCJzb2xhclwiLFxuXHRcInNvbGlkXCIsXG5cdFwic29tZVwiLFxuXHRcInNvdXJcIixcblx0XCJzcGVjaWFsXCIsXG5cdFwic3BlY2lmaWNcIixcblx0XCJzdGFibGVcIixcblx0XCJzdGF0aWNcIixcblx0XCJzdGVhZHlcIixcblx0XCJzdGVlcFwiLFxuXHRcInN0ZXJpbGVcIixcblx0XCJzdGlja3lcIixcblx0XCJzdGlmZlwiLFxuXHRcInN0aWxsXCIsXG5cdFwic3RyYWlnaHRcIixcblx0XCJzdHJhbmdlXCIsXG5cdFwic3RyaWN0XCIsXG5cdFwic3Ryb25nXCIsXG5cdFwic3VjaFwiLFxuXHRcInN1ZGRlblwiLFxuXHRcInN1aXRhYmxlXCIsXG5cdFwic3VubnlcIixcblx0XCJzdXBlcmlvclwiLFxuXHRcInN1cmVcIixcblx0XCJzd2VldFwiLFxuXHRcInN3aWZ0XCIsXG5cdFwic3dvbGxlblwiLFxuXHRcInN5bWJvbGljXCIsXG5cdFwic3ludGhldGljXCIsXG5cdFwidGFjdGljYWxcIixcblx0XCJ0YWxsXCIsXG5cdFwidGF1dFwiLFxuXHRcInRlY2huaWNhbFwiLFxuXHRcInRlbXBvcmFyeVwiLFxuXHRcInRlbnRhdGl2ZVwiLFxuXHRcInRlcm1pbmFsXCIsXG5cdFwidGhlcm1hbFwiLFxuXHRcInRoaWNrXCIsXG5cdFwidGhpblwiLFxuXHRcInRoaXJkXCIsXG5cdFwidGhpcnN0eVwiLFxuXHRcInRpZ2h0XCIsXG5cdFwidGlueVwiLFxuXHRcInRveGljXCIsXG5cdFwidHJvcGljYWxcIixcblx0XCJ0cnVlXCIsXG5cdFwidHVyYnVsZW50XCIsXG5cdFwidHlwaWNhbFwiLFxuXHRcInVuaXF1ZVwiLFxuXHRcInVwcGVyXCIsXG5cdFwidXJnZW50XCIsXG5cdFwidXNlYWJsZVwiLFxuXHRcInVzZWZ1bFwiLFxuXHRcInVzdWFsXCIsXG5cdFwidmFsaWRcIixcblx0XCJ2YWx1YWJsZVwiLFxuXHRcInZhcmlvdXNcIixcblx0XCJ2ZXJ0aWNhbFwiLFxuXHRcInZpYWJsZVwiLFxuXHRcInZpb2xlbnRcIixcblx0XCJ2aXJ0dWFsXCIsXG5cdFwidmlzaWJsZVwiLFxuXHRcInZpc3VhbFwiLFxuXHRcInZpdGFsXCIsXG5cdFwidm9pZFwiLFxuXHRcInZvbGF0aWxlXCIsXG5cdFwid2FudG9uXCIsXG5cdFwid2FybVwiLFxuXHRcIndlYWtcIixcblx0XCJ3ZWFyeVwiLFxuXHRcIndldFwiLFxuXHRcIndoaXRlXCIsXG5cdFwid2hvbGVcIixcblx0XCJ3aWRlXCIsXG5cdFwid2lzZVwiLFxuXHRcIndvb2RlblwiLFxuXHRcIndvb2xlblwiLFxuXHRcIndvcnNlXCIsXG5cdFwid29yc3RcIixcblx0XCJ3cm9uZ1wiLFxuXHRcInllbGxvd1wiLFxuXHRcInlvdW5nXCIsXG5cdFwiaGFybWxlc3NcIixcblx0XCJpbmFjdGl2ZVwiLFxuXHRcImluY29ycmVjdFwiLFxuXHRcImluZGlyZWN0XCIsXG5cdFwiaW52YWxpZFwiLFxuXHRcInVuYWJsZVwiLFxuXHRcInVua25vd25cIixcblx0XCJ1bm1hdGVkXCIsXG5cdFwidW5zYWZlXCIsXG5cdFwidW5zaWduZWRcIixcblx0XCJ1bnVzZWRcIixcblx0XCJ1bnVzdWFsXCIsXG5cdFwidW53YW50ZWRcIixcblx0XCJ1c2VsZXNzXCIsXG5cdFwiYWdlZFwiLFxuXHRcImV0Y2hlZFwiLFxuXHRcImZpbmlzaGVkXCIsXG5cdFwiZ2l2ZW5cIixcblx0XCJsZWZ0XCIsXG5cdFwibG9zdFwiLFxuXHRcIm1pc3Rha2VuXCIsXG5cdFwicHJvdmVuXCIsXG5cdFwiXCJdO1xuXG5cbnZhciB0eHRfbm91bnM9W1xuXHRcImFicmFzaXZlXCIsXG5cdFwiYWJ1c2VyXCIsXG5cdFwiYWNjaWRlbnRcIixcblx0XCJhY2lkXCIsXG5cdFwiYWNyZVwiLFxuXHRcImFjcm9ueW1cIixcblx0XCJhY3RcIixcblx0XCJhZGRyZXNzXCIsXG5cdFwiYWRtaXJhbFwiLFxuXHRcImFkdmVyYlwiLFxuXHRcImFkdmlzZXJcIixcblx0XCJhZmZhaXJcIixcblx0XCJhZ2VudFwiLFxuXHRcImFpZFwiLFxuXHRcImFpbVwiLFxuXHRcImFpclwiLFxuXHRcImFpcnBsYW5lXCIsXG5cdFwiYWlycG9ydFwiLFxuXHRcImFpcnNoaXBcIixcblx0XCJhbGFybVwiLFxuXHRcImFsY29ob2xpY1wiLFxuXHRcImFsZ2VicmFcIixcblx0XCJhbGlhc1wiLFxuXHRcImFsaWJpXCIsXG5cdFwiYWxsZXlcIixcblx0XCJhbGxveVwiLFxuXHRcImFuYWxvZ1wiLFxuXHRcImFuYWx5c3RcIixcblx0XCJhbmNob3JcIixcblx0XCJhbmdsZVwiLFxuXHRcImFuaW1hbFwiLFxuXHRcImFudGhlbVwiLFxuXHRcImFwcGxlXCIsXG5cdFwiYXByaWxcIixcblx0XCJhcHJvblwiLFxuXHRcImFyY1wiLFxuXHRcImFyY2hcIixcblx0XCJhcmVhXCIsXG5cdFwiYXJtXCIsXG5cdFwiYXJteVwiLFxuXHRcImFycmF5XCIsXG5cdFwiYXJyZXN0XCIsXG5cdFwiYXJyb3dcIixcblx0XCJhdG9tXCIsXG5cdFwiYXR0YWNrXCIsXG5cdFwiYXhcIixcblx0XCJheGlzXCIsXG5cdFwiYmFieVwiLFxuXHRcImJhY2tcIixcblx0XCJiYWdcIixcblx0XCJiYWxsXCIsXG5cdFwiYmFsbG9vblwiLFxuXHRcImJhbmRcIixcblx0XCJiYW5nXCIsXG5cdFwiYmFyXCIsXG5cdFwiYmFyZ2VcIixcblx0XCJiYXJyZWxcIixcblx0XCJiYXNlXCIsXG5cdFwiYmFzaW5cIixcblx0XCJiYXNrZXRcIixcblx0XCJiYXRcIixcblx0XCJiYXRjaFwiLFxuXHRcImJhdGhcIixcblx0XCJiYXRoZXJcIixcblx0XCJiYXR0ZXJ5XCIsXG5cdFwiYmF5XCIsXG5cdFwiYmVhY2hcIixcblx0XCJiZWFjb25cIixcblx0XCJiZWFkXCIsXG5cdFwiYmVhbVwiLFxuXHRcImJlYW5cIixcblx0XCJiZWFyXCIsXG5cdFwiYmVhdFwiLFxuXHRcImJlZFwiLFxuXHRcImJlaW5nXCIsXG5cdFwiYmVuZFwiLFxuXHRcImJlcnJ5XCIsXG5cdFwiYmlnYW15XCIsXG5cdFwiYmxhZGVcIixcblx0XCJibGFua1wiLFxuXHRcImJsYW5rZXRcIixcblx0XCJibGFzdFwiLFxuXHRcImJsYXN0c1wiLFxuXHRcImJsb2NrXCIsXG5cdFwiYmxvb2RcIixcblx0XCJibG90XCIsXG5cdFwiYmxvd1wiLFxuXHRcImJsb3dlclwiLFxuXHRcImJvYXRcIixcblx0XCJib2R5XCIsXG5cdFwiYm9pbFwiLFxuXHRcImJvbHRcIixcblx0XCJib25lXCIsXG5cdFwiYm9va1wiLFxuXHRcImJvb3RcIixcblx0XCJib3JlXCIsXG5cdFwiYm90dGxlXCIsXG5cdFwiYm90dG9tXCIsXG5cdFwiYm94XCIsXG5cdFwiYm95XCIsXG5cdFwiYnJhaW5cIixcblx0XCJicmVhZFwiLFxuXHRcImJyZWFzdFwiLFxuXHRcImJyaWNrXCIsXG5cdFwiYnJvb21cIixcblx0XCJidWJibGVcIixcblx0XCJidWNrZXRcIixcblx0XCJidWlsZGVyXCIsXG5cdFwiYnVsbGV0XCIsXG5cdFwiYnVtcFwiLFxuXHRcImJ1c1wiLFxuXHRcImJ1c2hcIixcblx0XCJidXR0XCIsXG5cdFwiYnV0dGVyXCIsXG5cdFwiYnV0dG9uXCIsXG5cdFwiYnl0ZVwiLFxuXHRcImNhYlwiLFxuXHRcImNha2VcIixcblx0XCJjYW1wXCIsXG5cdFwiY2Fubm9uXCIsXG5cdFwiY2FwXCIsXG5cdFwiY2FwdGFpblwiLFxuXHRcImNhcnBldFwiLFxuXHRcImNhdXNlXCIsXG5cdFwiY2F2ZVwiLFxuXHRcImNlbGxcIixcblx0XCJjZWxsYXJcIixcblx0XCJjaGFpclwiLFxuXHRcImNoYWxrXCIsXG5cdFwiY2hlYXRcIixcblx0XCJjaGVla1wiLFxuXHRcImNoZWVzZVwiLFxuXHRcImNoaWVmXCIsXG5cdFwiY2hpbGRcIixcblx0XCJjaGltbmV5XCIsXG5cdFwiY2h1cmNoXCIsXG5cdFwiY2lyY2xlXCIsXG5cdFwiY2l0aXplblwiLFxuXHRcImNpdmlsaWFuXCIsXG5cdFwiY2xhbXBcIixcblx0XCJjbGF3XCIsXG5cdFwiY2xlcmtcIixcblx0XCJjbG9ja1wiLFxuXHRcImNsb3VkXCIsXG5cdFwiY2x1YlwiLFxuXHRcImNsdW1wXCIsXG5cdFwiY29hbFwiLFxuXHRcImNvYXRcIixcblx0XCJjb2RlclwiLFxuXHRcImNvbG9uXCIsXG5cdFwiY29tYlwiLFxuXHRcImNvbW1hXCIsXG5cdFwiY29tcHV0ZXJcIixcblx0XCJjb25lXCIsXG5cdFwiY29uc29sZVwiLFxuXHRcImNvbnRyb2xcIixcblx0XCJjb3B5XCIsXG5cdFwiY29yZFwiLFxuXHRcImNvcmVcIixcblx0XCJjb3JrXCIsXG5cdFwiY29ybmVyXCIsXG5cdFwiY291Z2hcIixcblx0XCJjb3VudFwiLFxuXHRcImNyYWNrXCIsXG5cdFwiY3JhZGxlXCIsXG5cdFwiY3JhZnRcIixcblx0XCJjcmFtcFwiLFxuXHRcImNyYXNoXCIsXG5cdFwiY3Jhd2xcIixcblx0XCJjcnVzdFwiLFxuXHRcImN1YmVcIixcblx0XCJjdXBcIixcblx0XCJjdXJlXCIsXG5cdFwiY3VybFwiLFxuXHRcImRhbVwiLFxuXHRcImRhdGFcIixcblx0XCJkYXRlXCIsXG5cdFwiZGVhbGVyXCIsXG5cdFwiZGVhdGhcIixcblx0XCJkZWJyaXNcIixcblx0XCJkZWJ0XCIsXG5cdFwiZGVjYXlcIixcblx0XCJkZWNlbWJlclwiLFxuXHRcImRlY2tcIixcblx0XCJkZWNvZGVyXCIsXG5cdFwiZGVmYXVsdFwiLFxuXHRcImRlZmVjdFwiLFxuXHRcImRlbGlnaHRcIixcblx0XCJkZW50XCIsXG5cdFwiZGVzZXJ0XCIsXG5cdFwiZGVzaXJlXCIsXG5cdFwiZGVza1wiLFxuXHRcImRldmljZVwiLFxuXHRcImRpb2RlXCIsXG5cdFwiZGlydFwiLFxuXHRcImRpc2Vhc2VcIixcblx0XCJkaXNndXN0XCIsXG5cdFwiZGlzaFwiLFxuXHRcImRpc2tcIixcblx0XCJkaXRjaFwiLFxuXHRcImRpdGNoZXNcIixcblx0XCJkaXZlclwiLFxuXHRcImRpdmlkZXJcIixcblx0XCJkb2xseVwiLFxuXHRcImRvcGVcIixcblx0XCJkb3NlXCIsXG5cdFwiZHJhZ1wiLFxuXHRcImRyZXNzXCIsXG5cdFwiZHJ1Z1wiLFxuXHRcImR1bXBcIixcblx0XCJlYXJcIixcblx0XCJlZGdlXCIsXG5cdFwiZWdnXCIsXG5cdFwiZWxib3dcIixcblx0XCJlbGVjdHJvblwiLFxuXHRcImVsZXZlblwiLFxuXHRcImVuZFwiLFxuXHRcImVuZW15XCIsXG5cdFwiZXJyb3JcIixcblx0XCJleGl0XCIsXG5cdFwiZXhwZXJ0XCIsXG5cdFwiZmFjZVwiLFxuXHRcImZhY3RvcnlcIixcblx0XCJmYWtlXCIsXG5cdFwiZmFsbFwiLFxuXHRcImZhbWlseVwiLFxuXHRcImZhblwiLFxuXHRcImZhcm1cIixcblx0XCJmYXRoZXJcIixcblx0XCJmZWFyXCIsXG5cdFwiZmVhdGhlclwiLFxuXHRcImZlZWRlclwiLFxuXHRcImZlZXRcIixcblx0XCJmaWVsZFwiLFxuXHRcImZpZ2h0ZXJcIixcblx0XCJmaWxlXCIsXG5cdFwiZmlsdGVyXCIsXG5cdFwiZmluZ2VyXCIsXG5cdFwiZmlzaFwiLFxuXHRcImZpc3RcIixcblx0XCJmbGFrZVwiLFxuXHRcImZsYXBcIixcblx0XCJmbGFzaFwiLFxuXHRcImZsb29kXCIsXG5cdFwiZmxvb3JcIixcblx0XCJmbHVzaFwiLFxuXHRcImZvYW1cIixcblx0XCJmb2dcIixcblx0XCJmb2xkXCIsXG5cdFwiZm9vZFwiLFxuXHRcImZvb3RcIixcblx0XCJmb3JjZVwiLFxuXHRcImZvcmVzdFwiLFxuXHRcImZvcmtcIixcblx0XCJmb3JtXCIsXG5cdFwiZm9ydFwiLFxuXHRcImZyaWN0aW9uXCIsXG5cdFwiZnJpZGF5XCIsXG5cdFwiZnJpZW5kXCIsXG5cdFwiZnJvbnRcIixcblx0XCJmcm9zdFwiLFxuXHRcImZydWl0XCIsXG5cdFwiZnVyXCIsXG5cdFwiZ2FtZVwiLFxuXHRcImdhbmdcIixcblx0XCJnYXBcIixcblx0XCJnYXJhZ2VcIixcblx0XCJnYXJkZW5cIixcblx0XCJnYXNcIixcblx0XCJnYXRlXCIsXG5cdFwiZ2VhclwiLFxuXHRcImdlbmVcIixcblx0XCJnaWFudFwiLFxuXHRcImdpcmxcIixcblx0XCJnbGFuZFwiLFxuXHRcImdsYXNzXCIsXG5cdFwiZ2xhemVcIixcblx0XCJnbGVhbVwiLFxuXHRcImdsaWRlXCIsXG5cdFwiZ2xvdmVcIixcblx0XCJnbG93XCIsXG5cdFwiZ2x1ZVwiLFxuXHRcImdvYWxcIixcblx0XCJncmFkZVwiLFxuXHRcImdyYXBoXCIsXG5cdFwiZ3Jhc3NcIixcblx0XCJncmVhc2VcIixcblx0XCJncmlkXCIsXG5cdFwiZ3JpcFwiLFxuXHRcImdyb2FuXCIsXG5cdFwiZ3Jvc3NcIixcblx0XCJncm93dGhcIixcblx0XCJndWFyZFwiLFxuXHRcImd1ZXN0XCIsXG5cdFwiZ3VpZGVcIixcblx0XCJndW1cIixcblx0XCJndW5cIixcblx0XCJndXlcIixcblx0XCJoYWJpdFwiLFxuXHRcImhhaWxcIixcblx0XCJoYWlyXCIsXG5cdFwiaGFsZlwiLFxuXHRcImhhbGxcIixcblx0XCJoYW1tZXJcIixcblx0XCJoYW5kXCIsXG5cdFwiaGFuZGxlXCIsXG5cdFwiaGFuZ2FyXCIsXG5cdFwiaGFyYm9yXCIsXG5cdFwiaGFyZHdhcmVcIixcblx0XCJoYXJtXCIsXG5cdFwiaGFycG9vblwiLFxuXHRcImhhc3RlXCIsXG5cdFwiaGF0XCIsXG5cdFwiaGF0Y2hcIixcblx0XCJoYXRlXCIsXG5cdFwiaGF6YXJkXCIsXG5cdFwiaGVhZFwiLFxuXHRcImhlYXBcIixcblx0XCJoZWFydFwiLFxuXHRcImhlYXRcIixcblx0XCJoZWF0ZXJcIixcblx0XCJoZWVsXCIsXG5cdFwiaGVlbHNcIixcblx0XCJoZWlnaHRcIixcblx0XCJoZWxsb1wiLFxuXHRcImhlbG1cIixcblx0XCJoZWxtZXRcIixcblx0XCJoZWxwXCIsXG5cdFwiaGVtXCIsXG5cdFwiaGVyZVwiLFxuXHRcImhlcnR6XCIsXG5cdFwiaGlsbFwiLFxuXHRcImhpbnRcIixcblx0XCJoaXBcIixcblx0XCJoaXNzXCIsXG5cdFwiaG9sZFwiLFxuXHRcImhvbGVcIixcblx0XCJob21lXCIsXG5cdFwiaG9ua1wiLFxuXHRcImhvb2RcIixcblx0XCJob29mXCIsXG5cdFwiaG9va1wiLFxuXHRcImhvb3BcIixcblx0XCJob3JuXCIsXG5cdFwiaG9zZVwiLFxuXHRcImhvdGVsXCIsXG5cdFwiaG91clwiLFxuXHRcImhvdXNlXCIsXG5cdFwiaG93bFwiLFxuXHRcImh1YlwiLFxuXHRcImh1Z1wiLFxuXHRcImh1bGxcIixcblx0XCJodW1cIixcblx0XCJodW1hblwiLFxuXHRcImh1bW9yXCIsXG5cdFwiaHVtcFwiLFxuXHRcImh1bmRyZWRcIixcblx0XCJodW5rXCIsXG5cdFwiaHVudFwiLFxuXHRcImh1c2hcIixcblx0XCJodXRcIixcblx0XCJpY2VcIixcblx0XCJpY2luZ1wiLFxuXHRcImlkZWFcIixcblx0XCJpZGVhbFwiLFxuXHRcImltYWdlXCIsXG5cdFwiaW1wYWN0XCIsXG5cdFwiaW1wdWxzZVwiLFxuXHRcImluY2hcIixcblx0XCJpbmp1cnlcIixcblx0XCJpbmtcIixcblx0XCJpbmxldFwiLFxuXHRcImlubGV0c1wiLFxuXHRcImlucHV0XCIsXG5cdFwiaW5xdWlyeVwiLFxuXHRcImluc2FuaXR5XCIsXG5cdFwiaW5zaWduaWFcIixcblx0XCJpbnRha2VcIixcblx0XCJpbnRha2VzXCIsXG5cdFwiaW50ZWdlclwiLFxuXHRcImludGVncml0eVwiLFxuXHRcImludGVudFwiLFxuXHRcImludGVudHNcIixcblx0XCJpbnRlcmNvbVwiLFxuXHRcImludGVyZXN0XCIsXG5cdFwiaW50ZXJmYWNlXCIsXG5cdFwiaW50ZXJpb3JcIixcblx0XCJpbnRlcnZhbFwiLFxuXHRcImludGVydmlld1wiLFxuXHRcImludmVudGlvblwiLFxuXHRcImludm9pY2VcIixcblx0XCJpcm9uXCIsXG5cdFwiaXNsYW5kXCIsXG5cdFwiaXNzdWVcIixcblx0XCJpdGVtXCIsXG5cdFwiaXZvcnlcIixcblx0XCJqYWNrXCIsXG5cdFwiamFpbFwiLFxuXHRcImphbVwiLFxuXHRcImphclwiLFxuXHRcImphd1wiLFxuXHRcImplbGx5XCIsXG5cdFwiamV3ZWxcIixcblx0XCJqaWdcIixcblx0XCJqb2JcIixcblx0XCJqb2ludFwiLFxuXHRcImp1ZGdlXCIsXG5cdFwianVnXCIsXG5cdFwianVseVwiLFxuXHRcImp1bXBcIixcblx0XCJqdW5lXCIsXG5cdFwianVua1wiLFxuXHRcImp1cnlcIixcblx0XCJqdXN0aWNlXCIsXG5cdFwia2VlbFwiLFxuXHRcImtldHRsZVwiLFxuXHRcImtleVwiLFxuXHRcImtleWJvYXJkXCIsXG5cdFwia2V5d29yZFwiLFxuXHRcImtpY2tcIixcblx0XCJraWxsXCIsXG5cdFwia2lzc1wiLFxuXHRcImtpdFwiLFxuXHRcImtpdGVcIixcblx0XCJrbmVlXCIsXG5cdFwia25pZmVcIixcblx0XCJrbm9iXCIsXG5cdFwia25vY2tcIixcblx0XCJrbm90XCIsXG5cdFwibGFiZWxcIixcblx0XCJsYWJvclwiLFxuXHRcImxhY2VcIixcblx0XCJsYWNrXCIsXG5cdFwibGFkZGVyXCIsXG5cdFwibGFrZVwiLFxuXHRcImxhbXBcIixcblx0XCJsYW5kXCIsXG5cdFwibGFuZVwiLFxuXHRcImxhbnRlcm5cIixcblx0XCJsYXBcIixcblx0XCJsYXBzZVwiLFxuXHRcImxhcmRcIixcblx0XCJsYXNlclwiLFxuXHRcImxhc2hcIixcblx0XCJsYXRjaFwiLFxuXHRcImxhdWdoXCIsXG5cdFwibGF1bmNoXCIsXG5cdFwibGF1bmRyeVwiLFxuXHRcImxhd1wiLFxuXHRcImxheWVyXCIsXG5cdFwibGVhZFwiLFxuXHRcImxlYWRlclwiLFxuXHRcImxlYWZcIixcblx0XCJsZWFrXCIsXG5cdFwibGVha2FnZVwiLFxuXHRcImxlYXBcIixcblx0XCJsZWFwZXJcIixcblx0XCJsZWF0aGVyXCIsXG5cdFwibGVhdmVcIixcblx0XCJsZWdcIixcblx0XCJsZWdlbmRcIixcblx0XCJsZW5ndGhcIixcblx0XCJsZXNzb25cIixcblx0XCJsZXR0ZXJcIixcblx0XCJsaWJlcnR5XCIsXG5cdFwibGlicmFyeVwiLFxuXHRcImxpY2tcIixcblx0XCJsaWRcIixcblx0XCJsaWZlXCIsXG5cdFwibGlmdFwiLFxuXHRcImxpZ2h0XCIsXG5cdFwibGltYlwiLFxuXHRcImxpbWVcIixcblx0XCJsaW1pdFwiLFxuXHRcImxpbXBcIixcblx0XCJsaW5lXCIsXG5cdFwibGluZW5cIixcblx0XCJsaW5rXCIsXG5cdFwibGludFwiLFxuXHRcImxpcFwiLFxuXHRcImxpcXVvclwiLFxuXHRcImxpc3RcIixcblx0XCJsaXRlclwiLFxuXHRcImxpdHJlXCIsXG5cdFwibGl2ZXJcIixcblx0XCJsb2FkXCIsXG5cdFwibG9hZlwiLFxuXHRcImxvYW5cIixcblx0XCJsb2NrXCIsXG5cdFwibG9ja2VyXCIsXG5cdFwibG9nXCIsXG5cdFwibG9naWNcIixcblx0XCJsb29rXCIsXG5cdFwibG9vcFwiLFxuXHRcImxvc3NcIixcblx0XCJsb3RcIixcblx0XCJsb3ZlXCIsXG5cdFwibHVtYmVyXCIsXG5cdFwibHVtcFwiLFxuXHRcImx1bmdcIixcblx0XCJtYWNoaW5lXCIsXG5cdFwibWFnbmV0XCIsXG5cdFwibWFpbFwiLFxuXHRcIm1ham9yXCIsXG5cdFwibWFrZVwiLFxuXHRcIm1hbGVcIixcblx0XCJtYW5cIixcblx0XCJtYXBcIixcblx0XCJtYXJibGVcIixcblx0XCJtYXJjaFwiLFxuXHRcIm1hcmdpblwiLFxuXHRcIm1hcmtcIixcblx0XCJtYXJrZXRcIixcblx0XCJtYXNrXCIsXG5cdFwibWFzc1wiLFxuXHRcIm1hc3RcIixcblx0XCJtYXN0ZXJcIixcblx0XCJtYXRcIixcblx0XCJtYXRjaFwiLFxuXHRcIm1hdGVcIixcblx0XCJtYXRlcmlhbFwiLFxuXHRcIm1hdGhcIixcblx0XCJtZWFsXCIsXG5cdFwibWVhdFwiLFxuXHRcIm1lZGFsXCIsXG5cdFwibWVkaXVtXCIsXG5cdFwibWVldFwiLFxuXHRcIm1lbWJlclwiLFxuXHRcIm1lbW9yeVwiLFxuXHRcIm1lblwiLFxuXHRcIm1lbnRpb25cIixcblx0XCJtZW50aW9uc1wiLFxuXHRcIm1lbnVcIixcblx0XCJtZW51c1wiLFxuXHRcIm1lc3NcIixcblx0XCJtZXRhbFwiLFxuXHRcIm1ldGVyXCIsXG5cdFwibWV0aG9kXCIsXG5cdFwibWlsZVwiLFxuXHRcIm1pbGtcIixcblx0XCJtaWxsXCIsXG5cdFwibWluZFwiLFxuXHRcIm1pbmVcIixcblx0XCJtaW50XCIsXG5cdFwibWlycm9yXCIsXG5cdFwibWlzZml0XCIsXG5cdFwibWlzc1wiLFxuXHRcIm1pc3Npb25cIixcblx0XCJtaXN0XCIsXG5cdFwibWl0dFwiLFxuXHRcIm1pdHRlblwiLFxuXHRcIm1peFwiLFxuXHRcIm1vZGVcIixcblx0XCJtb2RlbFwiLFxuXHRcIm1vZGVtXCIsXG5cdFwibW9kdWxlXCIsXG5cdFwibW9tZW50XCIsXG5cdFwibW9uZGF5XCIsXG5cdFwibW9uZXlcIixcblx0XCJtb25pdG9yXCIsXG5cdFwibW9vblwiLFxuXHRcIm1vb25saWdodFwiLFxuXHRcIm1vcFwiLFxuXHRcIm1vc3NcIixcblx0XCJtb3RlbFwiLFxuXHRcIm1vdGhlclwiLFxuXHRcIm1vdGlvblwiLFxuXHRcIm1vdG9yXCIsXG5cdFwibW91bnRcIixcblx0XCJtb3V0aFwiLFxuXHRcIm1vdmVcIixcblx0XCJtb3ZlclwiLFxuXHRcIm11Y2hcIixcblx0XCJtdWRcIixcblx0XCJtdWdcIixcblx0XCJtdWxlXCIsXG5cdFwibXVzY2xlXCIsXG5cdFwibXVzaWNcIixcblx0XCJtdXN0YXJkXCIsXG5cdFwibmFpbFwiLFxuXHRcIm5hbWVcIixcblx0XCJuYXRpb25cIixcblx0XCJuYXR1cmVcIixcblx0XCJuYXVzZWFcIixcblx0XCJuYXZ5XCIsXG5cdFwibmVja1wiLFxuXHRcIm5lZWRcIixcblx0XCJuZWVkbGVcIixcblx0XCJuZWdsZWN0XCIsXG5cdFwibmVydmVcIixcblx0XCJuZXN0XCIsXG5cdFwibmV0XCIsXG5cdFwibmV1dHJvblwiLFxuXHRcIm5pY2tlbFwiLFxuXHRcIm5pZ2h0XCIsXG5cdFwibm9kXCIsXG5cdFwibm9pc2VcIixcblx0XCJub29uXCIsXG5cdFwibm9ydGhcIixcblx0XCJub3NlXCIsXG5cdFwibm90YXRpb25cIixcblx0XCJub3RlXCIsXG5cdFwibm90aWNlXCIsXG5cdFwibm91blwiLFxuXHRcIm5venpsZVwiLFxuXHRcIm51bGxcIixcblx0XCJudW1iZXJcIixcblx0XCJudW1lcmFsXCIsXG5cdFwibnVyc2VcIixcblx0XCJudXRcIixcblx0XCJueWxvblwiLFxuXHRcIm9ha1wiLFxuXHRcIm9hclwiLFxuXHRcIm9iamVjdFwiLFxuXHRcIm9jZWFuXCIsXG5cdFwib2RvclwiLFxuXHRcIm9kb3JzXCIsXG5cdFwib2ZmZXJcIixcblx0XCJvZmZpY2VyXCIsXG5cdFwib2htXCIsXG5cdFwib2lsXCIsXG5cdFwib3BlcmFuZFwiLFxuXHRcIm9waW5pb25cIixcblx0XCJvcHRpb25cIixcblx0XCJvcmFuZ2VcIixcblx0XCJvcmRlclwiLFxuXHRcIm9yZVwiLFxuXHRcIm9yZ2FuXCIsXG5cdFwib3JpZmljZVwiLFxuXHRcIm9yaWdpblwiLFxuXHRcIm9ybmFtZW50XCIsXG5cdFwib3VuY2VcIixcblx0XCJvdW5jZXNcIixcblx0XCJvdXRmaXRcIixcblx0XCJvdXRpbmdcIixcblx0XCJvdXRsZXRcIixcblx0XCJvdXRsaW5lXCIsXG5cdFwib3V0cHV0XCIsXG5cdFwib3ZlblwiLFxuXHRcIm93bmVyXCIsXG5cdFwib3hpZGVcIixcblx0XCJveHlnZW5cIixcblx0XCJwYWNlXCIsXG5cdFwicGFja1wiLFxuXHRcInBhZFwiLFxuXHRcInBhZ2VcIixcblx0XCJwYWlsXCIsXG5cdFwicGFpblwiLFxuXHRcInBhaW50XCIsXG5cdFwicGFpclwiLFxuXHRcInBhblwiLFxuXHRcInBhbmVcIixcblx0XCJwYW5lbFwiLFxuXHRcInBhcGVyXCIsXG5cdFwicGFyY2VsXCIsXG5cdFwicGFyaXR5XCIsXG5cdFwicGFya1wiLFxuXHRcInBhcnRcIixcblx0XCJwYXJ0bmVyXCIsXG5cdFwicGFydHlcIixcblx0XCJwYXNjYWxcIixcblx0XCJwYXNzXCIsXG5cdFwicGFzc2FnZVwiLFxuXHRcInBhc3RlXCIsXG5cdFwicGF0XCIsXG5cdFwicGF0Y2hcIixcblx0XCJwYXRoXCIsXG5cdFwicGF0aWVudFwiLFxuXHRcInBhdHJvbFwiLFxuXHRcInBhd1wiLFxuXHRcInBhd3NcIixcblx0XCJwYXlcIixcblx0XCJwZWFcIixcblx0XCJwZWFjZVwiLFxuXHRcInBlYWtcIixcblx0XCJwZWFyXCIsXG5cdFwicGVja1wiLFxuXHRcInBlZGFsXCIsXG5cdFwicGVnXCIsXG5cdFwicGVuXCIsXG5cdFwicGVuY2lsXCIsXG5cdFwicGVvcGxlXCIsXG5cdFwicGVyY2VudFwiLFxuXHRcInBlcmZlY3RcIixcblx0XCJwZXJpb2RcIixcblx0XCJwZXJtaXRcIixcblx0XCJwZXJzb25cIixcblx0XCJwaGFzZVwiLFxuXHRcInBob3RvXCIsXG5cdFwicGlja1wiLFxuXHRcInBpY3R1cmVcIixcblx0XCJwaWVjZVwiLFxuXHRcInBpZXJcIixcblx0XCJwaWxlXCIsXG5cdFwicGlsb3RcIixcblx0XCJwaW5cIixcblx0XCJwaW5rXCIsXG5cdFwicGlwZVwiLFxuXHRcInBpc3RvbFwiLFxuXHRcInBpc3RvblwiLFxuXHRcInBpdFwiLFxuXHRcInBsYWNlXCIsXG5cdFwicGxhblwiLFxuXHRcInBsYW5lXCIsXG5cdFwicGxhbnRcIixcblx0XCJwbGFzdGljXCIsXG5cdFwicGxhdGVcIixcblx0XCJwbGF5XCIsXG5cdFwicGxlYWRcIixcblx0XCJwbGVhc3VyZVwiLFxuXHRcInBsb3RcIixcblx0XCJwbG93XCIsXG5cdFwicGx1Z1wiLFxuXHRcInBvY2tldFwiLFxuXHRcInBvaW50XCIsXG5cdFwicG9pc29uXCIsXG5cdFwicG9rZVwiLFxuXHRcInBvbGVcIixcblx0XCJwb2xpY2VcIixcblx0XCJwb2xpc2hcIixcblx0XCJwb2xsXCIsXG5cdFwicG9uZFwiLFxuXHRcInBvb2xcIixcblx0XCJwb3BcIixcblx0XCJwb3J0XCIsXG5cdFwicG9ydGlvblwiLFxuXHRcInBvc3RcIixcblx0XCJwb3RcIixcblx0XCJwb3RhdG9cIixcblx0XCJwb3VuZFwiLFxuXHRcInBvd2RlclwiLFxuXHRcInBvd2VyXCIsXG5cdFwicHJlZml4XCIsXG5cdFwicHJlc2VuY2VcIixcblx0XCJwcmVzZW50XCIsXG5cdFwicHJlc2lkZW50XCIsXG5cdFwicHJlc3NcIixcblx0XCJwcmljZVwiLFxuXHRcInByaW1lXCIsXG5cdFwicHJpbnRcIixcblx0XCJwcmlzbVwiLFxuXHRcInByaXNvblwiLFxuXHRcInByb2JlXCIsXG5cdFwicHJvYmxlbVwiLFxuXHRcInByb2R1Y2VcIixcblx0XCJwcm9kdWN0XCIsXG5cdFwicHJvZmlsZVwiLFxuXHRcInByb2ZpdFwiLFxuXHRcInByb2dyYW1cIixcblx0XCJwcm9ncmVzc1wiLFxuXHRcInByb2plY3RcIixcblx0XCJwcm9ub3VuXCIsXG5cdFwicHJvb2ZcIixcblx0XCJwcm9wXCIsXG5cdFwicHJvdGVzdFwiLFxuXHRcInB1YmxpY1wiLFxuXHRcInB1ZGRsZVwiLFxuXHRcInB1ZmZcIixcblx0XCJwdWxsXCIsXG5cdFwicHVsc2VcIixcblx0XCJwdW1wXCIsXG5cdFwicHVuY2hcIixcblx0XCJwdXBpbFwiLFxuXHRcInB1cmNoYXNlXCIsXG5cdFwicHVyZ2VcIixcblx0XCJwdXJwb3NlXCIsXG5cdFwicHVzaFwiLFxuXHRcInB5cmFtaWRcIixcblx0XCJxdWFydFwiLFxuXHRcInF1YXJ0ZXJcIixcblx0XCJxdWVzdGlvblwiLFxuXHRcInF1aWV0XCIsXG5cdFwicXVvdGFcIixcblx0XCJyYWNlXCIsXG5cdFwicmFja1wiLFxuXHRcInJhZGFyXCIsXG5cdFwicmFkaWFuXCIsXG5cdFwicmFkaW9cIixcblx0XCJyYWdcIixcblx0XCJyYWlsXCIsXG5cdFwicmFpblwiLFxuXHRcInJhaW5ib3dcIixcblx0XCJyYWluY29hdFwiLFxuXHRcInJhaXNlXCIsXG5cdFwicmFrZVwiLFxuXHRcInJhbVwiLFxuXHRcInJhbXBcIixcblx0XCJyYW5nZVwiLFxuXHRcInJhbmtcIixcblx0XCJyYXBcIixcblx0XCJyYXRlXCIsXG5cdFwicmF0aW9cIixcblx0XCJyYXRpb3NcIixcblx0XCJyYXR0bGVcIixcblx0XCJyYXlcIixcblx0XCJyZWFjaFwiLFxuXHRcInJlYWRlclwiLFxuXHRcInJlYW1cIixcblx0XCJyZWFyXCIsXG5cdFwicmVhc29uXCIsXG5cdFwicmVib3VuZFwiLFxuXHRcInJlY2VpcHRcIixcblx0XCJyZWNlc3NcIixcblx0XCJyZWNvcmRcIixcblx0XCJyZWNvdmVyeVwiLFxuXHRcInJlY3J1aXRcIixcblx0XCJyZWVsXCIsXG5cdFwicmVmdW5kXCIsXG5cdFwicmVmdXNlXCIsXG5cdFwicmVnaW9uXCIsXG5cdFwicmVncmV0XCIsXG5cdFwicmVsYXlcIixcblx0XCJyZWxlYXNlXCIsXG5cdFwicmVsaWVmXCIsXG5cdFwicmVtZWR5XCIsXG5cdFwicmVtb3ZhbFwiLFxuXHRcInJlcGFpclwiLFxuXHRcInJlcG9ydFwiLFxuXHRcInJlcXVlc3RcIixcblx0XCJyZXNjdWVcIixcblx0XCJyZXNlcnZlXCIsXG5cdFwicmVzaWRlbnRcIixcblx0XCJyZXNpZHVlXCIsXG5cdFwicmVzb3VyY2VcIixcblx0XCJyZXNwZWN0XCIsXG5cdFwicmVzdFwiLFxuXHRcInJlc3VsdFwiLFxuXHRcInJldHVyblwiLFxuXHRcInJldmVyc2VcIixcblx0XCJyZXZpZXdcIixcblx0XCJyZXdhcmRcIixcblx0XCJyaGVvc3RhdFwiLFxuXHRcInJoeXRobVwiLFxuXHRcInJpYlwiLFxuXHRcInJpYmJvblwiLFxuXHRcInJpY2VcIixcblx0XCJyaWRkbGVcIixcblx0XCJyaWRlXCIsXG5cdFwicmlmbGVcIixcblx0XCJyaWdcIixcblx0XCJyaW1cIixcblx0XCJyaW5zZVwiLFxuXHRcInJpdmVyXCIsXG5cdFwicm9hZFwiLFxuXHRcInJvYXJcIixcblx0XCJyb2NrXCIsXG5cdFwicm9ja2V0XCIsXG5cdFwicm9kXCIsXG5cdFwicm9sbFwiLFxuXHRcInJvb2ZcIixcblx0XCJyb29tXCIsXG5cdFwicm9vdFwiLFxuXHRcInJvcGVcIixcblx0XCJyb3NlXCIsXG5cdFwicm91bmRcIixcblx0XCJyb3V0ZVwiLFxuXHRcInJvd2VyXCIsXG5cdFwicnViYmVyXCIsXG5cdFwicnVkZGVyXCIsXG5cdFwicnVnXCIsXG5cdFwicnVsZVwiLFxuXHRcInJ1bWJsZVwiLFxuXHRcInJ1blwiLFxuXHRcInJ1bm5lclwiLFxuXHRcInJ1c2hcIixcblx0XCJydXN0XCIsXG5cdFwic2Fja1wiLFxuXHRcInNhZGRsZVwiLFxuXHRcInNhZmV0eVwiLFxuXHRcInNhaWxcIixcblx0XCJzYWlsb3JcIixcblx0XCJzYWxlXCIsXG5cdFwic2FsdFwiLFxuXHRcInNhbHV0ZVwiLFxuXHRcInNhbXBsZVwiLFxuXHRcInNhbmRcIixcblx0XCJzYXBcIixcblx0XCJzYXNoXCIsXG5cdFwic2NhYlwiLFxuXHRcInNjYWxlXCIsXG5cdFwic2NlbmVcIixcblx0XCJzY2hvb2xcIixcblx0XCJzY2llbmNlXCIsXG5cdFwic2NvcGVcIixcblx0XCJzY29yZVwiLFxuXHRcInNjcmFwXCIsXG5cdFwic2NyYXRjaFwiLFxuXHRcInNjcmVhbVwiLFxuXHRcInNjcmVlblwiLFxuXHRcInNjcmV3XCIsXG5cdFwic2VhXCIsXG5cdFwic2VhbFwiLFxuXHRcInNlYW1cIixcblx0XCJzZWFyY2hcIixcblx0XCJzZWFzb25cIixcblx0XCJzZWF0XCIsXG5cdFwic2Vjb25kXCIsXG5cdFwic2VjcmV0XCIsXG5cdFwic2VjdG9yXCIsXG5cdFwic2VlZFwiLFxuXHRcInNlbGZcIixcblx0XCJzZW5zZVwiLFxuXHRcInNlbnRyeVwiLFxuXHRcInNlcmlhbFwiLFxuXHRcInNlcmllc1wiLFxuXHRcInNlcnZhbnRcIixcblx0XCJzZXNzaW9uXCIsXG5cdFwic2V0dXBcIixcblx0XCJzZXdhZ2VcIixcblx0XCJzZXdlclwiLFxuXHRcInNleFwiLFxuXHRcInNoYWRlXCIsXG5cdFwic2hhZG93XCIsXG5cdFwic2hhZnRcIixcblx0XCJzaGFtZVwiLFxuXHRcInNoYXBlXCIsXG5cdFwic2hhcmVcIixcblx0XCJzaGF2ZVwiLFxuXHRcInNoZWV0XCIsXG5cdFwic2hlbGZcIixcblx0XCJzaGVsbFwiLFxuXHRcInNoZWx0ZXJcIixcblx0XCJzaGllbGRcIixcblx0XCJzaGlmdFwiLFxuXHRcInNoaXBcIixcblx0XCJzaGlydFwiLFxuXHRcInNob2NrXCIsXG5cdFwic2hvZVwiLFxuXHRcInNob3BcIixcblx0XCJzaG9yZVwiLFxuXHRcInNob3VsZGVyXCIsXG5cdFwic2hvdXRcIixcblx0XCJzaG92ZWxcIixcblx0XCJzaG93XCIsXG5cdFwic2hvd2VyXCIsXG5cdFwic2lkZVwiLFxuXHRcInNpZ2h0XCIsXG5cdFwic2lnblwiLFxuXHRcInNpbGVuY2VcIixcblx0XCJzaWxrXCIsXG5cdFwic2lsbFwiLFxuXHRcInNpbHZlclwiLFxuXHRcInNpbmtcIixcblx0XCJzaXBcIixcblx0XCJzaXJcIixcblx0XCJzaXJlblwiLFxuXHRcInNpc3RlclwiLFxuXHRcInNpdGVcIixcblx0XCJzaXplXCIsXG5cdFwic2tld1wiLFxuXHRcInNraWxsXCIsXG5cdFwic2tpblwiLFxuXHRcInNraXBcIixcblx0XCJza2lydFwiLFxuXHRcInNreVwiLFxuXHRcInNsYXBcIixcblx0XCJzbGFzaFwiLFxuXHRcInNsYXRlXCIsXG5cdFwic2xhdmVcIixcblx0XCJzbGVkXCIsXG5cdFwic2xlZXBcIixcblx0XCJzbGVldmVcIixcblx0XCJzbGljZVwiLFxuXHRcInNsaWRlXCIsXG5cdFwic2xvcGVcIixcblx0XCJzbG90XCIsXG5cdFwic21hc2hcIixcblx0XCJzbWVsbFwiLFxuXHRcInNtaWxlXCIsXG5cdFwic21va2VcIixcblx0XCJzbmFwXCIsXG5cdFwic25lZXplXCIsXG5cdFwic25vd1wiLFxuXHRcInNvYXBcIixcblx0XCJzb2NpZXR5XCIsXG5cdFwic29ja1wiLFxuXHRcInNvY2tldFwiLFxuXHRcInNvZFwiLFxuXHRcInNvZnR3YXJlXCIsXG5cdFwic29pbFwiLFxuXHRcInNvbGRpZXJcIixcblx0XCJzb2xlXCIsXG5cdFwic29uXCIsXG5cdFwic29uYXJcIixcblx0XCJzb25nXCIsXG5cdFwic29ydFwiLFxuXHRcInNvdW5kXCIsXG5cdFwic291cFwiLFxuXHRcInNvdXJjZVwiLFxuXHRcInNvdXRoXCIsXG5cdFwic3BhY2VcIixcblx0XCJzcGFjZXJcIixcblx0XCJzcGFkZVwiLFxuXHRcInNwYW5cIixcblx0XCJzcGFyXCIsXG5cdFwic3BhcmVcIixcblx0XCJzcGFya1wiLFxuXHRcInNwZWFrZXJcIixcblx0XCJzcGVhclwiLFxuXHRcInNwZWVjaFwiLFxuXHRcInNwZWVkXCIsXG5cdFwic3BlZWRlclwiLFxuXHRcInNwaWtlXCIsXG5cdFwic3BpbGxcIixcblx0XCJzcGlyYWxcIixcblx0XCJzcGxhc2hcIixcblx0XCJzcGxpY2VcIixcblx0XCJzcGxpbnRcIixcblx0XCJzcG9rZVwiLFxuXHRcInNwb25nZVwiLFxuXHRcInNwb25zb3JcIixcblx0XCJzcG9uc29yc1wiLFxuXHRcInNwb29sXCIsXG5cdFwic3Bvb25cIixcblx0XCJzcG9ydFwiLFxuXHRcInNwb3RcIixcblx0XCJzcHJheVwiLFxuXHRcInNwcmluZ1wiLFxuXHRcInNxdWFyZVwiLFxuXHRcInNxdWVha1wiLFxuXHRcInN0YWNrXCIsXG5cdFwic3RhZmZcIixcblx0XCJzdGFnZVwiLFxuXHRcInN0YWlyXCIsXG5cdFwic3Rha2VcIixcblx0XCJzdGFsbFwiLFxuXHRcInN0YW1wXCIsXG5cdFwic3RhbmRcIixcblx0XCJzdGFwbGVcIixcblx0XCJzdGFyXCIsXG5cdFwic3RhcmVcIixcblx0XCJzdGFydFwiLFxuXHRcInN0YXRlXCIsXG5cdFwic3RhdHVzXCIsXG5cdFwic3RlYW1cIixcblx0XCJzdGVhbWVyXCIsXG5cdFwic3RlZWxcIixcblx0XCJzdGVtXCIsXG5cdFwic3RlcFwiLFxuXHRcInN0ZXJuXCIsXG5cdFwic3RpY2tcIixcblx0XCJzdGluZ1wiLFxuXHRcInN0aXRjaFwiLFxuXHRcInN0b2NrXCIsXG5cdFwic3RvbWFjaFwiLFxuXHRcInN0b25lXCIsXG5cdFwic3Rvb2xcIixcblx0XCJzdG9wXCIsXG5cdFwic3RvcmVcIixcblx0XCJzdG9ybVwiLFxuXHRcInN0b3J5XCIsXG5cdFwic3RvdmVcIixcblx0XCJzdHJhaW5cIixcblx0XCJzdHJhbmRcIixcblx0XCJzdHJhcFwiLFxuXHRcInN0cmF3XCIsXG5cdFwic3RyZWFrXCIsXG5cdFwic3RyZWFtXCIsXG5cdFwic3RyZWV0XCIsXG5cdFwic3RyZXNzXCIsXG5cdFwic3RyaWtlXCIsXG5cdFwic3RyaW5nXCIsXG5cdFwic3RyaXBcIixcblx0XCJzdHJpcGVcIixcblx0XCJzdHJvYmVcIixcblx0XCJzdHJva2VcIixcblx0XCJzdHJ1dFwiLFxuXHRcInN0dWJcIixcblx0XCJzdHVkZW50XCIsXG5cdFwic3R1ZHlcIixcblx0XCJzdHVmZlwiLFxuXHRcInN0dW1wXCIsXG5cdFwic3VibWFyaW5lXCIsXG5cdFwic3VjY2Vzc1wiLFxuXHRcInN1Z2FyXCIsXG5cdFwic3VpdFwiLFxuXHRcInN1bVwiLFxuXHRcInN1blwiLFxuXHRcInN1bmRheVwiLFxuXHRcInN1bmxpZ2h0XCIsXG5cdFwic3VucmlzZVwiLFxuXHRcInN1bnNldFwiLFxuXHRcInN1bnNoaW5lXCIsXG5cdFwic3VyZmFjZVwiLFxuXHRcInN1cmdlXCIsXG5cdFwic3VycHJpc2VcIixcblx0XCJzd2FiXCIsXG5cdFwic3dhbGxvd1wiLFxuXHRcInN3YW1wXCIsXG5cdFwic3dhcFwiLFxuXHRcInN3ZWVwXCIsXG5cdFwic3dlbGxcIixcblx0XCJzd2ltXCIsXG5cdFwic3dpbW1lclwiLFxuXHRcInN3aW5nXCIsXG5cdFwic3dpdGNoXCIsXG5cdFwic3dpdmVsXCIsXG5cdFwic3dvcmRcIixcblx0XCJzeW1ib2xcIixcblx0XCJzeXN0ZW1cIixcblx0XCJ0YWJcIixcblx0XCJ0YWJsZVwiLFxuXHRcInRhYmxldFwiLFxuXHRcInRhY2tcIixcblx0XCJ0YWN0aWNcIixcblx0XCJ0YWdcIixcblx0XCJ0YWlsXCIsXG5cdFwidGFpbG9yXCIsXG5cdFwidGFsa1wiLFxuXHRcInRhblwiLFxuXHRcInRhbmtcIixcblx0XCJ0YXBcIixcblx0XCJ0YXBlXCIsXG5cdFwidGFyXCIsXG5cdFwidGFyZ2V0XCIsXG5cdFwidGFza1wiLFxuXHRcInRhc3RlXCIsXG5cdFwidGF4XCIsXG5cdFwidGF4aVwiLFxuXHRcInRlYW1cIixcblx0XCJ0ZWFyXCIsXG5cdFwidGVldGhcIixcblx0XCJ0ZWxsZXJcIixcblx0XCJ0ZW1wZXJcIixcblx0XCJ0ZW5kZXJcIixcblx0XCJ0ZW5zXCIsXG5cdFwidGVuc2lvblwiLFxuXHRcInRlbnRcIixcblx0XCJ0ZW50aFwiLFxuXHRcInRlcm1cIixcblx0XCJ0ZXJyYWluXCIsXG5cdFwidGVzdFwiLFxuXHRcInRlc3RzXCIsXG5cdFwidGV4dFwiLFxuXHRcInRoZW9yeVwiLFxuXHRcInRoaW5cIixcblx0XCJ0aGluZ1wiLFxuXHRcInRoaXJ0eVwiLFxuXHRcInRocmVhZFwiLFxuXHRcInRocmVhdFwiLFxuXHRcInRocm9hdFwiLFxuXHRcInRodW1iXCIsXG5cdFwidGh1bmRlclwiLFxuXHRcInRpY2tcIixcblx0XCJ0aWRlXCIsXG5cdFwidGllXCIsXG5cdFwidGlsbFwiLFxuXHRcInRpbWVcIixcblx0XCJ0aW1lclwiLFxuXHRcInRpbWVyc1wiLFxuXHRcInRpbWVzXCIsXG5cdFwidGluXCIsXG5cdFwidGlwXCIsXG5cdFwidGlwc1wiLFxuXHRcInRpcmVcIixcblx0XCJ0aXNzdWVcIixcblx0XCJ0aXRsZVwiLFxuXHRcInRvZGF5XCIsXG5cdFwidG9lXCIsXG5cdFwidG9uXCIsXG5cdFwidG9uZ3VlXCIsXG5cdFwidG9vbFwiLFxuXHRcInRvb2xzXCIsXG5cdFwidG9vdGhcIixcblx0XCJ0b3BcIixcblx0XCJ0b3BpY1wiLFxuXHRcInRvc3NcIixcblx0XCJ0b3RhbFwiLFxuXHRcInRvdWNoXCIsXG5cdFwidG91clwiLFxuXHRcInRvd2VsXCIsXG5cdFwidG93ZXJcIixcblx0XCJ0b3duXCIsXG5cdFwidHJhY2VcIixcblx0XCJ0cmFja1wiLFxuXHRcInRyYWNrZXJcIixcblx0XCJ0cmFjdG9yXCIsXG5cdFwidHJhZGVcIixcblx0XCJ0cmFmZmljXCIsXG5cdFwidHJhaWxcIixcblx0XCJ0cmFpbGVyXCIsXG5cdFwidHJhaW5cIixcblx0XCJ0cmFuc2ZlclwiLFxuXHRcInRyYW5zaXRcIixcblx0XCJ0cmFwXCIsXG5cdFwidHJhc2hcIixcblx0XCJ0cmF5XCIsXG5cdFwidHJlZVwiLFxuXHRcInRyaWFsXCIsXG5cdFwidHJpY2tcIixcblx0XCJ0cmlnZ2VyXCIsXG5cdFwidHJpbVwiLFxuXHRcInRyaXBcIixcblx0XCJ0cm9vcFwiLFxuXHRcInRyb3VibGVcIixcblx0XCJ0cnVja1wiLFxuXHRcInRydW5rXCIsXG5cdFwidHJ1dGhcIixcblx0XCJ0cnlcIixcblx0XCJ0dWJcIixcblx0XCJ0dWdcIixcblx0XCJ0dW5lXCIsXG5cdFwidHVubmVsXCIsXG5cdFwidHVyblwiLFxuXHRcInR3aWdcIixcblx0XCJ0d2luXCIsXG5cdFwidHdpbmVcIixcblx0XCJ0d2lybFwiLFxuXHRcInR3aXN0XCIsXG5cdFwidHlwZVwiLFxuXHRcInR5cGlzdFwiLFxuXHRcInVtYnJlbGxhXCIsXG5cdFwidW5pZm9ybVwiLFxuXHRcInVuaXRcIixcblx0XCJ1cGRhdGVcIixcblx0XCJ1cHNpZGVcIixcblx0XCJ1c2FnZVwiLFxuXHRcInVzZVwiLFxuXHRcInVzZXJcIixcblx0XCJ2YWN1dW1cIixcblx0XCJ2YWx1ZVwiLFxuXHRcInZhbHZlXCIsXG5cdFwidmFwb3JcIixcblx0XCJ2ZWN0b3JcIixcblx0XCJ2ZWhpY2xlXCIsXG5cdFwidmVuZG9yXCIsXG5cdFwidmVudFwiLFxuXHRcInZlcmJcIixcblx0XCJ2ZXJzaW9uXCIsXG5cdFwidmVzc2VsXCIsXG5cdFwidmV0ZXJhblwiLFxuXHRcInZpY2VcIixcblx0XCJ2aWN0aW1cIixcblx0XCJ2aWRlb1wiLFxuXHRcInZpZXdcIixcblx0XCJ2aWxsYWdlXCIsXG5cdFwidmluZVwiLFxuXHRcInZpb2xldFwiLFxuXHRcInZpc2l0XCIsXG5cdFwidm9pY2VcIixcblx0XCJ2b2x0XCIsXG5cdFwidm9taXRcIixcblx0XCJ3YWZlclwiLFxuXHRcIndhZ2VcIixcblx0XCJ3YWdvblwiLFxuXHRcIndhaXN0XCIsXG5cdFwid2FpdFwiLFxuXHRcIndha2VcIixcblx0XCJ3YWxrXCIsXG5cdFwid2FsbFwiLFxuXHRcIndhbnRcIixcblx0XCJ3YXJcIixcblx0XCJ3YXNoXCIsXG5cdFwid2FzdGVcIixcblx0XCJ3YXRjaFwiLFxuXHRcIndhdGVyXCIsXG5cdFwid2F0dFwiLFxuXHRcIndhdmVcIixcblx0XCJ3YXhcIixcblx0XCJ3YXlcIixcblx0XCJ3ZWJcIixcblx0XCJ3ZWVkXCIsXG5cdFwid2Vla1wiLFxuXHRcIndlaWdodFwiLFxuXHRcIndlbGRcIixcblx0XCJ3ZXN0XCIsXG5cdFwid2hlZWxcIixcblx0XCJ3aGlwXCIsXG5cdFwid2hpcmxcIixcblx0XCJ3aWR0aFwiLFxuXHRcIndpZ2dsZVwiLFxuXHRcIndpblwiLFxuXHRcIndpbmNoXCIsXG5cdFwid2luZFwiLFxuXHRcIndpbmVcIixcblx0XCJ3aW5nXCIsXG5cdFwid2ludGVyXCIsXG5cdFwid2lyZVwiLFxuXHRcIndpc2hcIixcblx0XCJ3b21hblwiLFxuXHRcIndvbmRlclwiLFxuXHRcIndvb2RcIixcblx0XCJ3b29sXCIsXG5cdFwid29yZFwiLFxuXHRcIndvcmtcIixcblx0XCJ3b3JsZFwiLFxuXHRcIndvcm1cIixcblx0XCJ3b3JyeVwiLFxuXHRcIndvcnRoXCIsXG5cdFwid3JhcFwiLFxuXHRcIndyZWNrXCIsXG5cdFwid3JlbmNoXCIsXG5cdFwid3Jpc3RcIixcblx0XCJ3cml0ZXJcIixcblx0XCJ5YXJkXCIsXG5cdFwieWFyblwiLFxuXHRcInllYXJcIixcblx0XCJ5ZWxsXCIsXG5cdFwieWllbGRcIixcblx0XCJ5b2xrXCIsXG5cdFwiemVyb1wiLFxuXHRcInppcFwiLFxuXHRcInpvbmVcIixcblx0XCJjYW5cIixcblx0XCJtYXlcIixcblx0XCJjb3VwbGluZ1wiLFxuXHRcImRhbXBpbmdcIixcblx0XCJlbmRpbmdcIixcblx0XCJyaWdnaW5nXCIsXG5cdFwicmluZ1wiLFxuXHRcInNpemluZ1wiLFxuXHRcInNsaW5nXCIsXG5cdFwibm90aGluZ1wiLFxuXHRcImNhc3RcIixcblx0XCJjb3N0XCIsXG5cdFwiY3V0XCIsXG5cdFwiZHJ1bmtcIixcblx0XCJmZWx0XCIsXG5cdFwiZ3JvdW5kXCIsXG5cdFwiaGl0XCIsXG5cdFwibGVudFwiLFxuXHRcIm9mZnNldFwiLFxuXHRcInNldFwiLFxuXHRcInNoZWRcIixcblx0XCJzaG90XCIsXG5cdFwic2xpdFwiLFxuXHRcInRob3VnaHRcIixcblx0XCJ3b3VuZFwiLFxuXHRcIlwiXTtcblx0XG5cdFx0XHR2YXIgZDtcblx0XHRcdGQ9TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjY1NTM2KTtcblx0XHR2YXJcdGRhPWQlKHR4dF9hZGplY3RpdmVzLmxlbmd0aC0xKTtcblx0XHRcdGQ9TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjY1NTM2KTtcblx0XHR2YXJcdGRuPWQlKHR4dF9ub3Vucy5sZW5ndGgtMSk7XHRcdFxuXHRcdHZhclx0ZHM9dHh0X2FkamVjdGl2ZXNbZGFdK1wiX1wiK3R4dF9ub3Vuc1tkbl07XG5cdFx0cmV0dXJuIGRzO1xuXHR9XG5cbn07XG4iLCJcbmV4cG9ydHMuc2V0dXA9ZnVuY3Rpb24oc3Bldyl7XG5cblxudmFyIG9wdHM9ZXhwb3J0cztcblxuXG5cdHZhciBvcHRzX3NhdmU9e1wic2hvd19pY29uc1wiOnRydWUsXCJzaG93X2ltZ3NcIjp0cnVlLFwic21hbGxfZm9udFwiOnRydWUsXCJmdWxsX3NpemVcIjp0cnVlLFwiY2hhdF9vbmx5XCI6dHJ1ZSxcImJpZ190ZXh0XCI6dHJ1ZSxcInZpZGVvX2luX2NoYXRcIjp0cnVlfTtcblx0c3Bldy5vcHRzPXt9O1xuXHRzcGV3LnJlc2V0X29wdHM9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0Zm9yKGkgaW4gb3B0c19zYXZlIClcblx0XHR7XG5cdFx0XHRzcGV3Lm9wdHNbaV09dW5kZWZpbmVkO1xuXHRcdH1cblx0XHRzcGV3Lm9wdHNbXCJzaG93X2ljb25zXCJdPXRydWU7XG5cdFx0c3Bldy5vcHRzW1wic2hvd19pbWdzXCJdPXRydWU7XG5cdFx0c3Bldy5vcHRzW1wic21hbGxfZm9udFwiXT1mYWxzZTtcblx0XHRzcGV3Lm9wdHNbXCJiaWdfdGV4dFwiXT1mYWxzZTtcblx0XHRzcGV3Lm9wdHNbXCJmdWxsX3NpemVcIl09ZmFsc2U7XG5cdFx0c3Bldy5vcHRzW1wiY2hhdF9vbmx5XCJdPWZhbHNlO1xuXHRcdHNwZXcub3B0c1tcInZpZGVvX2luX2NoYXRcIl09ZmFsc2U7XG5cdFx0c3Bldy5vcHRzW1wiY21kbG9nXCJdPVtdO1xuXHRcdHNwZXcub3B0c1tcInR2XCJdPXRydWU7XG5cdH1cblx0c3Bldy5yZXNldF9vcHRzKCk7XG5cdGZvcihpIGluIG9wdHMpIHsgc3Bldy5vcHRzW2ldPW9wdHNbaV07IH0gLy8gb3ZlcnJpZGUgb3B0c1xuXHRcblx0XG5cdHNwZXcuc2F2ZV9vcHRzPWZ1bmN0aW9uKClcblx0e1xuXHRcdGlmKCFzcGV3LnN0b3JhZ2VfYXZhaWxhYmxlKSB7IHJldHVybjsgfVxuXHRcdGlmKCFzcGV3Lmpzb25fYXZhaWxhYmxlKSB7IHJldHVybjsgfVxuXHRcdFxuXHRcdHZhciBvcHRzPXt9O1xuXHRcdFxuXHRcdGZvcihpIGluIG9wdHNfc2F2ZSApXG5cdFx0e1xuXHRcdFx0b3B0c1tpXT1zcGV3Lm9wdHNbaV07XG5cdFx0fVxuXHRcdG9wdHNbXCJTXCJdPXNwZXcub3B0c1tcIlNcIl07XG5cdFx0b3B0c1tcImNtZGxvZ1wiXT1zcGV3Lm9wdHNbXCJjbWRsb2dcIl07XG5cdFx0XG5cdFx0dmFyIHM9SlNPTi5zdHJpbmdpZnkob3B0cyk7XG5cdFx0d2luZG93LmxvY2FsU3RvcmFnZVtcIndldHNwZXdfb3B0c1wiXT1zO1xuLy9jb25zb2xlLmxvZyhcInNhdmVkIFwiK3MpO1xuXHR9XG5cdFxuXHRzcGV3LmxvYWRfb3B0cz1mdW5jdGlvbigpXG5cdHtcblx0XHR2YXIgZ2V0cz17fTtcblx0XHR2YXIgc2F2ZT1mYWxzZTtcblx0XHQvLyBnZXQgc2Vzc2lvbiBmcm9tIHVybFxuXHRcdHZhciBzID0gd2luZG93LmxvY2F0aW9uLmhyZWYudG9TdHJpbmcoKS5zcGxpdCgnPycpO1xuXHRcdGlmKHNbMV0pXG5cdFx0e1xuXHRcdFx0Z2V0cz1zcGV3LnN0cl90b19tc2coc1sxXSk7XG5cdFx0fVxuXG4vLyBzZXQgaGVyZSBpbiBjYXNlIHdlIGRvIG5vdCBoYXZlIGxvY2Fsc3RvcmFnZVxuXHRcdGlmKGdldHNbXCJTXCJdKVxuXHRcdHtcblx0XHRcdHNwZXcub3B0cy5TPWdldHNbXCJTXCJdO1xuXHRcdFx0c2F2ZT10cnVlO1xuXHRcdH1cblx0XHRpZighc3Bldy5zdG9yYWdlX2F2YWlsYWJsZSkgeyByZXR1cm47IH1cblx0XHRpZighc3Bldy5qc29uX2F2YWlsYWJsZSkgeyByZXR1cm47IH1cblx0XHRcblx0XHR2YXIgcz13aW5kb3cubG9jYWxTdG9yYWdlW1wid2V0c3Bld19vcHRzXCJdO1xuXHRcdGlmKHR5cGVvZihzKT09XCJzdHJpbmdcIilcblx0XHR7XG5cdFx0XHR2YXIgb3B0cz1KU09OLnBhcnNlKHMpO1xuLy9jb25zb2xlLmxvZyhcImxvYWRlZCBcIitzKTtcblxuXHRcdFx0Zm9yKGkgaW4gb3B0cylcblx0XHRcdHtcblx0XHRcdFx0c3Bldy5vcHRzW2ldPW9wdHNbaV07XG5cdFx0XHR9XG5cdFx0fVxuLy8gbWFrZSBzdXJlIHRoYXQgdGhlIHVybCBvdmVycmlkZXNcblx0XHRpZihnZXRzW1wiU1wiXSlcblx0XHR7XG5cdFx0XHRzcGV3Lm9wdHMuUz1nZXRzW1wiU1wiXTtcblx0XHRcdHNhdmU9dHJ1ZTtcblx0XHR9XG5cdFx0XHRcblx0XHRpZihzYXZlKXtzcGV3LnNhdmVfb3B0cygpfSAvLyBuZWVkIHRvIHNhdmU/XG5cdH1cblx0XG5cdHNwZXcubWFrZV9jc3NfZnJvbV9vcHRzPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciBzPVwiXCI7XG5cdFx0XHRcdFxuXHRcdGlmKHNwZXcub3B0cy5zbWFsbF9mb250KVxuXHRcdHtcblx0XHRcdHMrPVwiIC53ZXRzcGV3IHsgZm9udC1zaXplOiAxMHB4OyB9IC53ZXRzcGV3X2xpbmUgeyBtYXJnaW4tYm90dG9tOjFweDsgfSBcIjtcblx0XHR9XG5cdFx0aWYoIXNwZXcub3B0cy5zaG93X2ljb25zKVxuXHRcdHtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X2ljb24geyBkaXNwbGF5Om5vbmU7IH0gXCI7XG5cdFx0fVxuXHRcdGlmKCFzcGV3Lm9wdHMuc2hvd19pbWdzKVxuXHRcdHtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X2F1dG9pbWcgeyBkaXNwbGF5Om5vbmU7IH0gXCI7XG5cdFx0fVxuXHRcdGlmKHNwZXcub3B0cy5mdWxsX3NpemUpXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXcgeyB3aWR0aDoxMDAlOyBoZWlnaHQ6MTAwJTsgdG9wOjBweDsgbGVmdDowcHg7IHJpZ2h0OjBweDsgYm90dG9tOjBweDsgXHRtYXJnaW46YXV0bzsgcG9zaXRpb246Zml4ZWQ7IH0gXCI7XG5cdFx0XHRzKz1cIiAud2V0c3Bld193ZXR2IHsgd2lkdGg6NjclOyBoZWlnaHQ6MTAwJTsgfSBcIjtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X3NwZXcgeyB3aWR0aDozMyU7IGhlaWdodDoxMDAlOyB9IFwiO1xuXHRcdFx0cys9XCIgaHRtbCxib2R5IHsgb3ZlcmZsb3c6aGlkZGVuOyB9IFwiO1xuXHRcdH1cblx0XHRzcGV3Lm9wdHMudHY9dHJ1ZTtcblx0XHRpZihzcGV3Lm9wdHMuY2hhdF9vbmx5KVxuXHRcdHtcblx0XHRcdHNwZXcub3B0cy50dj1mYWxzZTtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X3dldHYgeyBkaXNwbGF5Om5vbmU7IH0gXCI7XG5cdFx0XHRzKz1cIiAud2V0c3Bld19zcGV3IHsgd2lkdGg6MTAwJTsgaGVpZ2h0OjEwMCU7IH0gXCI7XG5cdFx0fVxuXHRcdGlmKCBzcGV3Lm9wdHMudmlkZW9faW5fY2hhdCApXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXdfd2V0diB7IGRpc3BsYXk6YmxvY2s7IHdpZHRoOjUwJTsgaGVpZ2h0OjUwJTsgcG9zaXRpb246YWJzb2x1dGU7IGxlZnQ6NTAlOyB0b3A6MTBweDsgfSBcIjtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X3NwZXcgeyB3aWR0aDoxMDAlOyBoZWlnaHQ6MTAwJTsgfSBcIjtcblx0XHR9XG5cdFx0aWYoc3Bldy5vcHRzLmJpZ190ZXh0KVxuXHRcdHtcblx0XHRcdHMrPVwiIC53ZXRzcGV3IHsgZm9udC1zaXplOiAzMnB4OyB9IC53ZXRzcGV3X2xpbmUgeyBtYXJnaW4tYm90dG9tOjBweDsgfSBcIjtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X2ljb24geyB3aWR0aDozMnB4OyBoZWlnaHQ6MzJweDsgfSBcIjtcblx0XHRcdGlmKHNwZXcub3B0cy5zbWFsbF9mb250KVxuXHRcdFx0e1xuXHRcdFx0XHRzKz1cIiAud2V0c3BldyB7IGZvbnQtc2l6ZTogMTZweDsgfSBcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0c3Bldy5kaXZfY3NzLmVtcHR5KCkuYXBwZW5kKCQoXCI8c3R5bGU+XCIrcytcIjwvc3R5bGU+XCIpKTtcblx0fVxuXG5cblx0c3Bldy5zaG93X29wdHM9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0c3Bldy5kaXZfb3B0cy5lbXB0eSgpO1xuXHRcdHNwZXcuZGl2X29wdHMuYXBwZW5kKFwiPGEgY2xhc3M9XFxcInNwZXdfY2xpY2tcXFwiIHRpdGxlPVxcXCJjaGF0XFxcIj5SZXR1cm4gdG8gY2hhdC48L2E+XCIpO1xuXHRcdGZvcihpIGluIG9wdHNfc2F2ZSApXG5cdFx0e1xuXHRcdFx0dmFyIG49aTtcblx0XHRcdHZhciB2PXNwZXcub3B0c1tpXT9cIk9OXCI6XCJPRkZcIlxuXHRcdFx0c3Bldy5kaXZfb3B0cy5hcHBlbmQoXCI8YSB0aXRsZT1cXFwiXCIrbitcIlxcXCI+XCIrbitcIiA6IFwiK3YrXCI8L2E+XCIpO1xuXHRcdH1cblx0XHRzcGV3LmRpdl9vcHRzLmFwcGVuZChcIjxhIHRpdGxlPVxcXCJyZXNldFxcXCI+UmVzZXQgb3B0aW9uczwvYT5cIik7XG5cblx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0c3Bldy5kaXZfbWFpbi5hcHBlbmQoc3Bldy5kaXZfb3B0cyk7XG5cdFx0XG5cdFx0JChcIi53ZXRzcGV3X29wdHMgYVwiKS5jbGljayhzcGV3LmNsaWNrX29wdHMpO1xuXHR9XG5cdFxuXHRzcGV3LmNsaWNrX29wdHM9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0dmFyIHR4dD0kKHRoaXMpLmF0dHIoXCJ0aXRsZVwiKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFxuXHRcdGlmKHR4dD09XCJyZXNldFwiKVxuXHRcdHtcblx0XHRcdHNwZXcucmVzZXRfb3B0cygpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYob3B0c19zYXZlW3R4dF0pXG5cdFx0e1xuXHRcdFx0c3Bldy5vcHRzW3R4dF09c3Bldy5vcHRzW3R4dF0/ZmFsc2U6dHJ1ZTsgLy8gdG9nZ2xlXG5cdFx0fVxuXHRcdFxuXHRcdHNwZXcubWFrZV9jc3NfZnJvbV9vcHRzKCk7XG5cdFx0c3Bldy5zaG93X3RhYihcIm9wdHNcIik7XG5cdFx0c3Bldy5zYXZlX29wdHMoKTtcbi8vY29uc29sZS5sb2coXCJvcHRzIFwiK3R4dCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblxufTtcbiIsIlxuZXhwb3J0cy5zZXR1cD1mdW5jdGlvbihzcGV3KXtcblxuXHR2YXIgbXNnPXt9OyAvLyBvdXIgYmFzZSBvZiBjb211bmljYXRpb25zLCBuZXcgbXNncyBhcmUgZGVsdGFzIG9uIHRoaXMgb2JqZWN0XG5cblxuXG4vLyBqYXZhc2NyaXB0IGlzIGEgYml0IGNyYXAgYXQgdXRmOCwgc28gd2UgdXNlIHRoZXNlIGVzY2FwZXNcblx0ZnVuY3Rpb24gZW5jKHMpXG5cdHtcblx0XHR2YXIgczI9XCJcIjtcblx0XHRpZihzKVxuXHRcdHtcblx0XHRcdHRyeVxuXHRcdFx0e1xuLy9cdFx0XHRcdHMyPXVuZXNjYXBlKCBlbmNvZGVVUklDb21wb25lbnQoIHMgKSApOyAvLyBmb3JjZSBpbnRvIHV0ZjggPz9cblx0XHRcdFx0czI9cy5zcGxpdChcIiVcIikuam9pbihcIiUyNVwiKS5zcGxpdChcIj1cIikuam9pbihcIiUzZFwiKS5zcGxpdChcIiZcIikuam9pbihcIiUyNlwiKTtcbi8vY29uc29sZS5sb2coXCJlbmMgXCIrcytcIiA6IFwiK3MyKTtcblx0XHRcdFx0cmV0dXJuIHMyO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBcIlwiO1xuXHR9O1xuXHRcbi8vdGhpcyBzaG91bGQgc2hvcnRjaXJjdWl0IGlmIDdiaXQgY2xlYW4gKHdoaWNoIHdlIG1vc3RseSB3b3VsZCBiZSlcblx0ZnVuY3Rpb24gZGVjX3V0ZjgodCkge1xuXHRcdFxuXHRcdGlmKCF0Lm1hdGNoKC9bXlxceDAxLVxceDdmXS8pKSB7IHJldHVybiB0OyB9XG5cdFx0XG4gICAgICAgIHZhciBzID0gXCJcIjsgIFxuICAgICAgICB2YXIgaSA9IDA7ICBcbiAgICAgICAgdmFyIGMgPSBjMSA9IGMyID0gMDtcbiAgXG4gICAgICAgIHdoaWxlICggaSA8IHQubGVuZ3RoICkgeyAgXG4gICAgICAgICAgICBjID0gdC5jaGFyQ29kZUF0KGkpOyAgXG4gICAgICAgICAgICBpZiAoYyA8IDEyOCkgeyAgXG4gICAgICAgICAgICAgICAgcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpOyAgXG4gICAgICAgICAgICAgICAgaSsrOyAgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIGVsc2UgaWYoKGMgPiAxOTEpICYmIChjIDwgMjI0KSkgeyAgXG4gICAgICAgICAgICAgICAgYzIgPSB0LmNoYXJDb2RlQXQoaSsxKTsgIFxuICAgICAgICAgICAgICAgIHMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpOyAgXG4gICAgICAgICAgICAgICAgaSArPSAyOyAgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIGVsc2UgeyAgXG4gICAgICAgICAgICAgICAgYzIgPSB0LmNoYXJDb2RlQXQoaSsxKTsgIFxuICAgICAgICAgICAgICAgIGMzID0gdC5jaGFyQ29kZUF0KGkrMik7ICBcbiAgICAgICAgICAgICAgICBzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpOyAgXG4gICAgICAgICAgICAgICAgaSArPSAzOyAgXG4gICAgICAgICAgICB9ICBcbiAgXG4gICAgICAgIH1cbi8vY29uc29sZS5sb2coXCJjb252ZXJ0IFwiK3QrXCIgOiBcIitzKTtcblxuICAgICAgICByZXR1cm4gczsgIFxuICAgIH0gIFxuXHRcblx0ZnVuY3Rpb24gZGVjKHMpXG5cdHtcblx0XHR2YXIgczI9XCJcIjtcblx0XHRpZihzKVxuXHRcdHtcblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHRzMj1zLnNwbGl0KFwiJTI2XCIpLmpvaW4oXCImXCIpLnNwbGl0KFwiJTNkXCIpLmpvaW4oXCI9XCIpLnNwbGl0KFwiJTI1XCIpLmpvaW4oXCIlXCIpO1xuXHRcdFx0XHRzMj0vKmRlY191dGY4Ki8oIHMyICk7IC8vIGNvbnZlcnQgZnJvbSB1dGY4ID8/P1xuLy9jb25zb2xlLmxvZyhcImRlYyBcIitzK1wiIDogXCIrczIpO1xuXHRcdFx0XHRyZXR1cm4gczI7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaChlKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH07XG5cblx0c3Bldy5zdHJfdG9fbXNnPWZ1bmN0aW9uKHMpIC8vIHNwbGl0IGEgcXVlcnkgbGlrZSBzdHJpbmdcblx0e1xuXHR2YXIgaTtcblx0XHR2YXIgbXNnPXt9O1xuXHRcdFxuXHRcdHZhciBhYT1zLnNwbGl0KFwiJlwiKTtcblx0XHRmb3IoaSBpbiBhYSlcblx0XHR7XG5cdFx0dmFyIHY9YWFbaV07XG5cdFx0XHR2YXIgdmE9di5zcGxpdChcIj1cIik7XG5cdFx0XHRtc2dbZGVjKHZhWzBdKV09ZGVjKHZhWzFdKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG1zZztcblx0fTtcblx0XG5cdHNwZXcubXNnX3RvX3N0cj1mdW5jdGlvbihtc2cpLy8gY3JlYXRlIGEgcXVlcnkgbGlrZSBzdHJpbmdcblx0e1xuXHR2YXIgaTtcblx0XHR2YXIgcz1cIiZcIjtcblx0XHRcblx0XHRmb3IoaSBpbiBtc2cpXG5cdFx0e1xuXHRcdHZhciB2PW1zZ1tpXTtcblx0XHRcdFxuXHRcdFx0cz1zK2VuYyhpKStcIj1cIitlbmModikrXCImXCI7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBzO1xuXHR9O1xuXHRcblx0c3Bldy5tc2dfdXBkYXRlPWZ1bmN0aW9uKG1zZyxuZXdtc2cpIC8vIG92ZXJyaWRlIGRhdGEgd2l0aCB0aGF0IGluIHRoZSBuZXcgbXNnXG5cdHtcblx0dmFyIGk7XG5cdFx0Zm9yKGkgaW4gbmV3bXNnKVxuXHRcdHtcblx0XHRcdG1zZ1tpXT1uZXdtc2dbaV07XG5cdFx0fVxuXHRcdHJldHVybiBtc2c7XG5cdH07XG5cblx0c3Bldy5zZW5kX2RhdGE9ZnVuY3Rpb24ocykge1xuXHQvL1x0XHRjb25zb2xlLmxvZyhcInNlbmRcIitzKTtcblx0XHRpZiAoc3Bldy53cykge1xuXHRcdCAgc3Bldy53cy5zZW5kKHMpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHR9XG5cdH07XG5cdCAgXG4gICAgICBzcGV3LnNlbmRfbXNnPWZ1bmN0aW9uKG0pIHtcblx0XHRzcGV3LnNlbmRfZGF0YShzcGV3Lm1zZ190b19zdHIobSkpO1xuXHQgIH07XG5cdCAgXG4gICAgICBzcGV3LmNtZF90b19tc2c9ZnVuY3Rpb24ocykgeyAvLyBjb252ZXJ0IGEgdHlwZWQgaW4gY29tbWFuZCBpbnRvIGEgbXNnXG5cbi8vIGFjdHVhbGx5LCBzaW5jZSBJIGhhZCB0byBhZGQgdGhlIGZ1bmN0aW9uYWxpdHkgZm9yIHRlbG5ldCBjb25uZWN0aW9ucyBhbnl3YXlcbi8vIHdlIHdpbGwgY2hlYXQgZm9yIG5vdyBhbmQganVzdCBzZW5kIGl0IGFzIGEgc3RyaW5nIGFuZCB0aGUgc2VydmVyIHdpbGwgY29udmVydCBpdCBmb3IgdXMuXG5cblx0XHR2YXIgbT17fTtcblx0XHRtLmNtZD1cImNtZFwiO1xuXHRcdG0udHh0PXM7XG5cdFx0XG5cdFx0cmV0dXJuIG07XHQgIFxuXHQgIH07XG5cdCAgXG5cdCAgc3Bldy5tc2dfdG9faHRtbD1mdW5jdGlvbihtc2cpe1xuXHRcblx0ICB2YXIgcztcblx0ICBcblx0ICB2YXIgY21kPW1zZy5jbWQ7XG5cdCAgdmFyIGZybT1tc2cuZnJtOyBpZighbXNnLmZybSl7bXNnLmZybT1cIipcIjt9XG5cdCAgdmFyIHR4dD1tc2cudHh0OyBpZighbXNnLnR4dCl7bXNnLnR4dD1cIipcIjt9XG5cdCAgXG5cdCAgdHh0PXNwZXcuZXNjYXBlSFRNTCh0eHQpOyAvLyBlc2NhcGUgYW55IHRleHQgaW5wdXQgdG8gcmVtb3ZlIGh0bWxcblx0ICBpZih3aW5kb3cuYW5zaV91cCkgLy8gYWxsb3cgYW5zaSBlc2NhcGVzP1xuXHQgIHtcblx0XHR0eHQ9IHdpbmRvdy5hbnNpX3VwLmFuc2lfdG9faHRtbCh0eHQpO1xuXHQgIH1cblx0ICBcblx0ICB2YXIgZnJtbG5rPVwiPGEgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIGhyZWY9XFxcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvcHJvZmlsZS9cIitmcm0rXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X25hbWVcXFwiID5cIitmcm0rXCI8L2E+XCJcblx0ICBcblx0XHRzd2l0Y2goY21kKVxuXHRcdHtcblx0XHRcdGNhc2UgXCJzYXlcIjpcblx0XHRcdFx0aWYoZnJtPT1cIipcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHM9XCIqXCIrdHh0K1wiKlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHM9XCI8aW1nIHNyYz1cXFwiaHR0cDovL2FwaS53ZXRnZW5lcy5jb206MTQwOC9nZW5lcy9hdmF0YXIvXCIrZnJtK1wiXFxcIiBjbGFzcz1cXFwid2V0c3Bld19pY29uXFxcIiAvPlwiK2ZybWxuaytcIjogXCIrc3Bldy5hdXRvSFRNTGxpbmtzKHR4dCk7XG5cdFx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0XHRjYXNlIFwiYWN0XCI6XG5cdFx0XHRcdHM9XCIqKlwiK2ZybWxuaytcIiBcIitzcGV3LmF1dG9IVE1MbGlua3ModHh0KStcIioqXCI7XG5cdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdFx0Y2FzZSBcIm11eFwiOlxuXHRcdFx0XHRzPXR4dDtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwibG5rXCI6XG5cdFx0XHRcdGlmKG1zZy5sbmsubWF0Y2goLyhqcGd8cG5nfGdpZnxqcGVnKSQvKSkgLy8gaXQgaXMgcHJvYmFibHkgYW4gaW1hZ2UsIGVtYmVkIGl0IHZpYSBib3VuY2VyXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzPVwiPGltZyBzcmM9XFxcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvYXZhdGFyL1wiK2ZybStcIlxcXCIgY2xhc3M9XFxcIndldHNwZXdfaWNvblxcXCIgLz5cIitmcm1sbmsrXCI6IFwiK3NwZXcuYXV0b0hUTUxpbWcobXNnLmxuaylcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzPVwiPGEgaHJlZj0nXCIrbXNnLmxuaytcIicgdGFyZ2V0PSdfYmxhbmsnPioqPHNwYW4gY2xhc3M9XFxcIndldHNwZXdfbmFtZVxcXCI+XCIrZnJtK1wiPC9zcGFuPiBcIit0eHQrXCIqKjwvYT5cIjtcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgXCJub3RlXCI6XG5cdFx0XHRcdHZhciBub3RlPW1zZy5ub3RlO1xuXHRcdFx0XHR2YXIgYTE9bXNnLmFyZzE7XG5cdFx0XHRcdHZhciBhMj1tc2cuYXJnMjtcblx0XHRcdFx0dmFyIGEzPW1zZy5hcmczO1xuXHRcdFx0XHRzd2l0Y2gobm90ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgXCJuYW1lXCI6XG5cdFx0XHRcdFx0XHRzcGV3Lm5hbWU9YTE7XG5cdFx0XHRcdFx0XHRzcGV3LnNob3dfdGFiKFwiY2hhdFwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjYXNlIFwibm90aWNlXCI6XG5cdFx0XHRcdFx0Y2FzZSBcIndlbGNvbWVcIjpcblx0XHRcdFx0XHRjYXNlIFwid2FybmluZ1wiOlxuXHRcdFx0XHRcdGNhc2UgXCJlcnJvclwiOlxuXHRcdFx0XHRcdFx0cz1cIi09IFwiK2ExK1wiID0tXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcImFjdFwiOlxuXHRcdFx0XHRcdFx0cz1cIi0qIFwiK2ExK1wiICotXCI7XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjYXNlIFwiYmFuXCI6XG5cdFx0XHRcdFx0XHRzPVwiLT0gXCIrYTIrXCIgaGFzIGJlZW4gYmFubmVkIGJ5IFwiK2ExK1wiID0tXCJcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdGNhc2UgXCJnYWdcIjpcblx0XHRcdFx0XHRcdHM9XCItPSBcIithMitcIiBoYXMgYmVlbiBnYWdnZWQgYnkgXCIrYTErXCIgPS1cIlxuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcImRpc1wiOlxuXHRcdFx0XHRcdFx0cz1cIi09IFwiK2EyK1wiIGhhcyBiZWVuIGRpc2Vtdm93ZWxlZCBieSBcIithMStcIiA9LVwiXG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHR9XG5cdFx0aWYocykgeyBzPSc8c3BhbiBzdHlsZT1cImNvbG9yOiMnK21zZy5yZ2IrJ1wiPicrcysnPC9zcGFuPic7IH1cblx0XHRyZXR1cm4gcztcblx0fTtcblxuXHRzcGV3LnNvY2tfY2xlYW49ZnVuY3Rpb24oKSAvLyBkaXNjb25uZWN0XG5cdHtcblx0XHRzcGV3LndzLmNsb3NlKCk7XG4vL1x0XHRkZWxldGUgc3Bldy53cztcblx0fVxuXG5cdHNwZXcuc29ja19zZXR1cD1mdW5jdGlvbigpIC8vIGNvbm5lY3Rcblx0e1xuXHRcdHNwZXcud3M9bmV3IFdlYlNvY2tldChzcGV3LnNlcnZlcl9hZGRyZXNzKTtcblx0XHRcblx0XHRzcGV3LndzLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdFx0c3Bldy5kaXNwbGF5X25vdGUoXCJDb25ncmF0dWxhdGlvbnMgd2Vic29ja2V0cyBhcmUgd29ya2luZyBhbmQgeW91IGhhdmUgY29ubmVjdGVkIHRvIFwiK3NwZXcuc2VydmVyX2FkZHJlc3MpO1xuXHRcdFx0c3Bldy5kaXNwbGF5X25vdGUoXCJZb3Ugd2lsbCBuZWVkIHRvIC9MT0dJTiBOQU1FIFBBU1MgKG5vIHBhc3N3b3JkIG5lZWRlZCBmb3IgZ3Vlc3QgbG9naW5zKS5cIilcblxuXHRcdFx0dmFyIGhhc2g9d2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIjXCIpWzFdOyAvLyBhdXRvIGNvbm5lY3QgdG8gdGhpcyByb29tP1xuXHRcdFx0aWYoc3Bldy5vcHRzLmhhc2gpIHsgaGFzaD1zcGV3Lm9wdHMuaGFzaDsgfSAvLyBvdmVyaWRlXG5cdFx0XHRcblx0XHRcdHNwZXcuc2VuZF9tc2coe2NtZDpcIm5vdGVcIixub3RlOlwicGxheWluZ1wiLGFyZzE6XCJ3ZXR2XCIsYXJnMjpcIlwiLGFyZzM6XCJcIixhcmc0OlwiXCIsaGFzaDpoYXNofSk7XG5cdFx0XHRcblx0XHRcdGlmKHNwZXcub3B0c1tcIlNcIl0pXG5cdFx0XHR7XG5cdFx0XHRcdHNwZXcuc2VuZF9tc2coe2NtZDpcInNlc3Npb25cIixzZXNzOnNwZXcub3B0c1tcIlNcIl19KTtcblx0XHRcdH1cblxuXG4vL1x0XHRcdGNvbnNvbGUubG9nKFwic3BldyBvcGVuXCIpO1xuXHRcdH07XG5cdFx0XG5cdFx0c3Bldy53cy5vbmNsb3NlID0gZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XG5cdFx0XHRzcGV3LmRpc3BsYXlfbm90ZShcIkRpc2Nvbm5lY3RlZCBmcm9tIFwiK3NwZXcuc2VydmVyX2FkZHJlc3MpO1xuXHRcdFx0XG5cdFx0XHRzcGV3LndzID0gbnVsbDtcblx0XHRcdFxuLy9cdFx0XHRjb25zb2xlLmxvZyhcInNwZXcgY2xvc2VcIik7XG5cdFx0fTtcblx0XHRcblx0XHRzcGV3LndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuXG4vLyBpdCBzZWVtcyB0aGF0IHNvbWUgdGhpbmdzIGNhbiBicmVhayB0aGUgZnJhbWluZyBjYXVzaW5nIGEgXCJcIiBpbnN0ZWFkIG9mIHZhbGlkIGRhdGFcbi8vIHNvIGFsbCA+N2JpdCBjaGFycyBhcmUgZ2V0dGluZyBzdHJpcHBlZCBzZXJ2ZXIgc2lkZSBmb3Igbm93XG5cdFx0XHR2YXIgZGF0ID0gZXZ0LmRhdGE7XG5cdFx0XHRcblx0XHRcdGlmKGRhdC5sZW5ndGg8MSkgeyByZXR1cm47IH0gLy8gaWdub3JlIGVtcHR5IGxpbmVzXG5cdFx0XHRcbi8vY29uc29sZS5sb2coZGF0KTtcblxuXHRcdFx0c3Bldy5tc2dfdXBkYXRlKG1zZyxzcGV3LnN0cl90b19tc2coZGF0KSk7XG5cdFx0XHRcblx0XHRcdHNwZXcucmVjZWl2ZV9tc2cobXNnKTtcblx0XHRcdFxuXHRcdFx0c3Bldy5kaXNwbGF5KHNwZXcubXNnX3RvX2h0bWwobXNnKSk7XG5cdFx0XHRcblx0XHR9O1xuXHR9O1xuXG5cdCBzcGV3LnJlbWVtYmVyX25hbWU9ZnVuY3Rpb24obmFtZSl7XG5cdFx0XHRpZighc3Bldy51c2Vyc1tuYW1lXSlcblx0XHRcdHtcblx0XHRcdFx0c3Bldy51c2Vyc1tuYW1lXT17bmFtZTpuYW1lfTtcblx0XHRcdH1cblx0fTtcblxuXHRzcGV3LnJlY2VpdmVfbXNnPWZ1bmN0aW9uKG1zZyl7XG5cdFx0XG5cdCAgdmFyIGNtZD1tc2cuY21kO1xuLy8gcmVtZW1iZXIgZXZlcnkgbmFtZSB3ZSBzZWVcblx0XHRpZihtc2cuZnJtKVxuXHRcdHtcblx0XHRcdHNwZXcucmVtZW1iZXJfbmFtZShtc2cuZnJtKTtcblx0XHR9XG5cblx0XHRzd2l0Y2goY21kKVxuXHRcdHtcblx0XHRcdGNhc2UgXCJub3RlXCI6XG5cdFx0XHRcdHZhciBub3RlPW1zZy5ub3RlO1xuXHRcdFx0XHRzd2l0Y2gobm90ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNhc2UgXCJqb2luXCI6XG5cdFx0XHRcdFx0XHRpZihtc2cuYXJnMSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3Bldy5yZW1lbWJlcl9uYW1lKG1zZy5hcmcxKTtcblx0XHRcdFx0XHRcdFx0aWYoIChtc2cuYXJnMikgJiYgKG1zZy5hcmcxIT1cIipcIikgKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0c3Bldy51c2Vyc1ttc2cuYXJnMV0ucm9vbT1tc2cuYXJnMjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJyb29tc1wiOlxuXHRcdFx0XHRcdFx0dmFyIGFhPW1zZy5saXN0LnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRcdHZhciBvcmRlcj1bXTtcblx0XHRcdFx0XHRcdGZvcihpIGluIGFhKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR2YXIgdj1hYVtpXTtcblx0XHRcdFx0XHRcdFx0dmFyIGw9XCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGE9di5zcGxpdChcIjpcIik7XG5cdFx0XHRcdFx0XHRcdHZhciBuYW1lPWFbMF07XG5cdFx0XHRcdFx0XHRcdHZhciBiYXNlbmFtZT1uYW1lLnNwbGl0KFwiLlwiKVswXTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvdW50PXBhcnNlSW50KGFbMV0pO1xuXHRcdFx0XHRcdFx0XHR2YXIgY29sb3I9XCJmZmZcIjtcblxuXHRcdFx0XHRcdFx0XHRsKz1cIjxpbWcgc3JjPVxcXCJodHRwOi8vYXBpLndldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIitiYXNlbmFtZStcIlxcXCIgY2xhc3M9XFxcIndldHNwZXdfaWNvblxcXCIgLz5cIjtcblx0XHRcdFx0XHRcdFx0bCs9XCI8c3BhbiBjbGFzcz1cXFwid2V0c3Bld19jb3VudFxcXCI+XCIrY291bnQrXCI8L3NwYW4+XCI7XG5cdFx0XHRcdFx0XHRcdGwrPVwiPGEgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIGhyZWY9XFxcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvcHJvZmlsZS9cIitiYXNlbmFtZStcIlxcXCIgY2xhc3M9XFxcIndldHNwZXdfbmFtZVxcXCI+XCIrbmFtZStcIjwvYT5cIjtcblx0XHRcdFx0XHRcdFx0bD1cIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfbGluZVxcXCIgc3R5bGU9XFxcImNvbG9yOiNcIitjb2xvcitcIlxcXCI+XCIrbCtcIjwvZGl2PlwiO1xuXHRcdFx0XHRcdFx0XHRvcmRlcltvcmRlci5sZW5ndGhdPXtsOmwsbjpjb3VudCxzOm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0b3JkZXIuc29ydChmdW5jdGlvbihhLGIpe2lmKGIubj09YS5uKSB7IHJldHVybiAoYi5zPGEucyktKGEuczxiLnMpOyB9IGVsc2UgcmV0dXJuIGIubi1hLm47IH0pO1xuXHRcdFx0XHRcdFx0c3Bldy5kaXZfcm9vbXMuZW1wdHkoKTtcblx0XHRcdFx0XHRcdHNwZXcuZGl2X3Jvb21zLmFwcGVuZChcIjxhIGNsYXNzPVxcXCJzcGV3X2NsaWNrXFxcIiB0aXRsZT1cXFwiY2hhdFxcXCI+UmV0dXJuIHRvIGNoYXQuPC9hPlwiKTtcblx0XHRcdFx0XHRcdGZvcihpIGluIG9yZGVyKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR2YXIgdj1vcmRlcltpXTtcblx0XHRcdFx0XHRcdFx0c3Bldy5kaXZfcm9vbXMuYXBwZW5kKHYubCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzcGV3LnNob3dfdGFiKFwicm9vbXNcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcInVzZXJzXCI6XG5cdFx0XHRcdFx0XHR2YXIgYWE9bXNnLmxpc3Quc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdFx0dmFyIG9yZGVyPVtdO1xuXHRcdFx0XHRcdFx0Zm9yKGkgaW4gYWEpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHZhciB2PWFhW2ldO1xuXHRcdFx0XHRcdFx0XHR2YXIgbD1cIlwiO1xuXHRcdFx0XHRcdFx0XHR2YXIgYT12LnNwbGl0KFwiOlwiKTtcblx0XHRcdFx0XHRcdFx0dmFyIG5hbWU9YVswXTtcblx0XHRcdFx0XHRcdFx0dmFyIGdhbWU9YVsxXTtcblx0XHRcdFx0XHRcdFx0dmFyIGdhbWVpZD1wYXJzZUludChhWzJdKTtcblx0XHRcdFx0XHRcdFx0dmFyIGZvcm09YVszXTtcblx0XHRcdFx0XHRcdFx0dmFyIGxldmVsPXBhcnNlSW50KGZvcm0uc3Vic3RyKDEpKTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yPWFbNF07XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRzcGV3LnJlbWVtYmVyX25hbWUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRsKz1cIjxpbWcgc3JjPVxcXCJodHRwOi8vYXBpLndldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIituYW1lK1wiXFxcIiBjbGFzcz1cXFwid2V0c3Bld19pY29uXFxcIiAvPlwiO1xuXHRcdFx0XHRcdFx0XHRsKz1cIjxzcGFuIGNsYXNzPVxcXCJ3ZXRzcGV3X2Zvcm1cXFwiPlwiK2Zvcm0rXCI8L3NwYW4+XCI7XG5cdFx0XHRcdFx0XHRcdGwrPVwiPGEgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIGhyZWY9XFxcImh0dHA6Ly9hcGkud2V0Z2VuZXMuY29tOjE0MDgvZ2VuZXMvcHJvZmlsZS9cIituYW1lK1wiXFxcIiBjbGFzcz1cXFwid2V0c3Bld19uYW1lXFxcIj5cIituYW1lK1wiPC9hPlwiO1xuXHRcdFx0XHRcdFx0XHRsKz1cIjxhIHRhcmdldD1cXFwiX2JsYW5rXFxcIiBocmVmPVxcXCJodHRwOi8vYXBpLndldGdlbmVzLmNvbToxNDA4L2dlbmVzL2dhbWUvXCIrZ2FtZWlkK1wiXFxcIiBjbGFzcz1cXFwid2V0c3Bld19nYW1lbmFtZVxcXCI+XCIrZ2FtZStcIjwvYT5cIjtcblx0XHRcdFx0XHRcdFx0bD1cIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfbGluZVxcXCIgc3R5bGU9XFxcImNvbG9yOiNcIitjb2xvcitcIlxcXCI+XCIrbCtcIjwvZGl2PlwiO1xuXHRcdFx0XHRcdFx0XHRvcmRlcltvcmRlci5sZW5ndGhdPXtsOmwsbjpsZXZlbCxzOm5hbWV9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0b3JkZXIuc29ydChmdW5jdGlvbihhLGIpe2lmKGIubj09YS5uKSB7IHJldHVybiAoYi5zPGEucyktKGEuczxiLnMpOyB9IGVsc2UgcmV0dXJuIGIubi1hLm47IH0pO1xuXHRcdFx0XHRcdFx0c3Bldy5kaXZfdXNlcnMuZW1wdHkoKTtcbi8vXHRcdFx0XHRcdFx0c3Bldy5kaXZfdXNlcnMuYXBwZW5kKFwiWW91IGFyZSBpbiByb29tLCBcIityb29tbmFtZSk7XG5cdFx0XHRcdFx0XHRzcGV3LmRpdl91c2Vycy5hcHBlbmQoXCI8YSBjbGFzcz1cXFwic3Bld19jbGlja1xcXCIgdGl0bGU9XFxcImNoYXRcXFwiPlJldHVybiB0byBjaGF0LjwvYT5cIik7XG5cdFx0XHRcdFx0XHRmb3IoaSBpbiBvcmRlcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dmFyIHY9b3JkZXJbaV07XG5cdFx0XHRcdFx0XHRcdHNwZXcuZGl2X3VzZXJzLmFwcGVuZCh2LmwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3Bldy5zaG93X3RhYihcInVzZXJzXCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJpbmZvXCI6XG5cdFx0XHRcdFx0XHRpZihtc2cuaW5mbz09XCJ1c2VyXCIpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHZhciBuYW1lPW1zZy5uYW1lOyAvLyB0aGlzIHNob3VsZCBiZSB0aGUgbmFtZVxuXHRcdFx0XHRcdFx0XHR2YXIgdT1zcGV3LnVzZXJzW25hbWVdO1xuXHRcdFx0XHRcdFx0XHRpZih1KVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGl0PXUubmFtZXNwYW47IC8vIHRoaXMgaXMgdGhlIG9uZSB3ZSB3YW50IHRvIHVwZGF0ZVxuXHRcdFx0XHRcdFx0XHRcdGlmKGl0KVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKG1zZy5zdGF0IT1cIi1cIikgLy8gZ290IGluZm9cblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIHQ9KG5ldyBEYXRlKG1zZy5qb2luZWQqMTAwMCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcz0obXNnLm5hbWUrXCIgXCIrbXNnLnN0YXQrXCIgcGxheWluZyBcIittc2cuZ2FtZW5hbWUrXCIgc2luY2UgXCIrdC5nZXRGdWxsWWVhcigpK1wiL1wiKygxK3QuZ2V0TW9udGgoKSkrXCIvXCIrdC5nZXREYXRlKCkrXCJcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0LmF0dHIoXCJ0aXRsZVwiLHMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgcz0obXNnLm5hbWUrXCIgKG9mZmxpbmUpXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpdC5hdHRyKFwidGl0bGVcIixzKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0aWYobXNnLmNtZD09XCJnYW1lXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5vbl9tc2dfZ2FtZShtc2cpO1xuXHRcdH1cblx0XHRcblx0fTtcblx0XHRcblxuXHRzcGV3Lm9uX21zZ19nYW1lPWZ1bmN0aW9uKG1zZyl7XG5cdFxuXHRcdGlmKG1zZy5nY21kPT1cIndldHZcIilcblx0XHR7XG5cdFx0XHRzcGV3Lm9uX21zZ19nYW1lX3dldHYobXNnKTtcblx0XHR9XG5cdH1cblx0XG5cdHNwZXcub25fbXNnX2dhbWVfd2V0dj1mdW5jdGlvbihtc2cpe1xuXHRcdGlmKG1zZy53ZXR2PT1cInBsYXlcIilcblx0XHR7XG5cdFx0XHR2YXIgcD1tc2cucGxheTtcblx0XHRcdHZhciBhYT1tc2cucGxheS5zcGxpdChcIixcIilcblx0XHRcdHZhciB2aWQ9YWFbMF07XG5cdFx0XHR2YXIgbnVtPXBhcnNlSW50KGFhWzFdKTtcblxuLy9cdFx0XHRpZihzcGV3Lnl0YXBpX3JlYWR5KVxuLy9cdFx0XHR7XG4vL1x0XHRcdFx0c3Bldy55dGFwaS5sb2FkVmlkZW9CeUlkKHZpZCxudW0pO1xuLy9cdFx0XHR9XG4vL1x0XHRcdGVsc2Vcbi8vXHRcdFx0e1xuXHRcdFx0XHRzcGV3Lm5leHRxdmlkPXt2aWQ6dmlkLG51bTpudW19O1xuLy9cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn07XG4iXX0=
