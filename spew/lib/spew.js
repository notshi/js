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

		spew.div_help.html("<iframe style=\"width:100%;height:100%\" src=\"http://help.wetgenes.com/\"></iframe>");
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
	  
	  var frmlnk="<a target=\"_blank\" href=\"http://like.wetgenes.com/-/profile/"+frm+"\" class=\"wetspew_name\" >"+frm+"</a>"
	  
		switch(cmd)
		{
			case "say":
				if(frm=="*")
				{
					s="*"+txt+"*";
				}
				else
				{
					s="<img src=\"http://wetgenes.com:1408/genes/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLlinks(txt);
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
					s="<img src=\"http://wetgenes.com:1408/genes/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLimg(msg.lnk)
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

							l+="<img src=\"http://wetgenes.com:1408/genes/avatar/"+basename+"\" class=\"wetspew_icon\" />";
							l+="<span class=\"wetspew_count\">"+count+"</span>";
							l+="<a target=\"_blank\" href=\"http://like.wetgenes.com/-/profile/"+basename+"\" class=\"wetspew_name\">"+name+"</a>";
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
							
							l+="<img src=\"http://wetgenes.com:1408/genes/avatar/"+name+"\" class=\"wetspew_icon\" />";
							l+="<span class=\"wetspew_form\">"+form+"</span>";
							l+="<a target=\"_blank\" href=\"http://like.wetgenes.com/-/profile/"+name+"\" class=\"wetspew_name\">"+name+"</a>";
							l+="<a target=\"_blank\" href=\"http://like.wetgenes.com/-/game/"+gameid+"\" class=\"wetspew_gamename\">"+game+"</a>";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL3NwZXcvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL3NwZXcvanMvc3Bldy5odG1sLmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3LmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3Lm5hbWVzLmpzIiwiL2hvbWUva3Jpc3MvaGcvanMvc3Bldy9qcy9zcGV3Lm9wdHMuanMiLCIvaG9tZS9rcmlzcy9oZy9qcy9zcGV3L2pzL3NwZXcuc29jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1aUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuZXhwb3J0cy5zZXR1cD1mdW5jdGlvbihzcGV3KXtcblxuXHRzcGV3LmNsaWNrX2xvZ2luPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciB0eHQ9JCh0aGlzKS5odG1sKCkudG9Mb3dlckNhc2UoKTtcblx0XHRpZih0eHQ9PVwieWVzXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5zaG93X3RhYihcImNoYXRcIik7XG5cdFx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhcIi9sb2dpbiBcIitzcGV3Lm5hbWUpKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcbi8vXHRcdFx0c3Bldy5zaG93X3RhYihcImNoYXRcIik7XG5cdFx0XHR3aW5kb3cubG9jYXRpb249KFwiaHR0cDovL2x1YS53ZXRnZW5lcy5jb20vZHVtaWQubHVhP2NvbnRpbnVlPVwiK3dpbmRvdy5sb2NhdGlvbik7XG5cdFx0fVxuLy9jb25zb2xlLmxvZyhcInR4dCBcIit0eHQpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRcblx0c3Bldy5jbGlja19yb29tPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciByb29tPSQodGhpcykuaHRtbCgpLnRvTG93ZXJDYXNlKCk7XG5cdFx0c3Bldy5zZW5kX21zZyhzcGV3LmNtZF90b19tc2coXCIvam9pbiBcIityb29tKSk7XG5cdFx0c3Bldy5zaG93X3RhYihcImNoYXRcIik7XG4vL2NvbnNvbGUubG9nKFwicm9vbSBcIityb29tKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0XG5cdHNwZXcuY2xpY2tfdGFiPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciB0YWI9JCh0aGlzKS5odG1sKCkudG9Mb3dlckNhc2UoKTtcblxuXHRcdGlmKHRhYj09XCJmaXhcIilcblx0XHR7XG5cdFx0XHRzcGV3Lnl0YXBpPXVuZGVmaW5lZDtcblx0XHRcdHNwZXcueXRhcGlfY291bnQ9OTk5OTtcblx0XHRcdCQoXCIjd2V0c3Bld193ZXR2XCIpLnJlcGxhY2VXaXRoKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld193ZXR2XFxcIiBpZD1cXFwid2V0c3Bld193ZXR2XFxcIiA+PC9kaXY+XCIpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuLy9cdFx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhcIi91c2Vyc1wiKSk7XG5cdFx0fVxuXHRcdFxuXHRcdHNwZXcuc2hvd190YWIodGFiKTtcblx0XHRcblx0XHRpZih0YWI9PVwidXNlcnNcIilcblx0XHR7XG5cdFx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhcIi91c2Vyc1wiKSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwicm9vbXNcIilcblx0XHR7XG5cdFx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhcIi9yb29tc1wiKSk7XG5cdFx0fVxuLy9jb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XG5cblx0fVxuXHRcblx0c3Bldy5jbGljaz1mdW5jdGlvbigpXG5cdHtcblx0XHR2YXIgdHh0PSQodGhpcykuYXR0cihcInRpdGxlXCIpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XG5cdFx0aWYodHh0PT1cImNoYXRcIilcblx0XHR7XG5cdFx0XHRzcGV3LnNob3dfdGFiKFwiY2hhdFwiKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdFxuXHRzcGV3LnNob3dfdGFiPWZ1bmN0aW9uKHRhYilcblx0e1xuXHRcdGlmKHRhYj09XCJoZWxwXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5lbXB0eSgpO1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5hcHBlbmQoc3Bldy5kaXZfaGVscCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZih0YWI9PVwibmV3c1wiKVxuXHRcdHtcblx0XHRcdHNwZXcuZGl2X21haW4uZW1wdHkoKTtcblx0XHRcdHNwZXcuZGl2X21haW4uYXBwZW5kKHNwZXcuZGl2X25ld3MpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYodGFiPT1cInVzZXJzXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5lbXB0eSgpO1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5hcHBlbmQoc3Bldy5kaXZfdXNlcnMpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYodGFiPT1cInJvb21zXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5lbXB0eSgpO1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5hcHBlbmQoc3Bldy5kaXZfcm9vbXMpO1xuXHRcdFx0JChcIi53ZXRzcGV3X3Jvb21zIC53ZXRzcGV3X2xpbmUgLndldHNwZXdfbmFtZVwiKS5jbGljayhzcGV3LmNsaWNrX3Jvb20pO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYodGFiPT1cIm9wdHNcIilcblx0XHR7XG5cdFx0XHRzcGV3LnNob3dfb3B0cygpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYodGFiPT1cImxvZ2luXCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfbWFpbi5lbXB0eSgpO1xuXHRcdFx0c3Bldy5uYW1lPXNwZXcucmFuZG9tX25hbWUoKTtcblx0XHRcdHZhciBsb2dpbl9odG1sPVwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld19sb2dpblxcXCI+XCIrXG5cdFx0XHRcIkhlbGxvLCBcIitcblx0XHRcdFwiPHNwYW4gY2xhc3M9XFxcIndldHNwZXdfbG9naW5fbmFtZVxcXCI+XCIrc3Bldy5uYW1lK1wiPC9zcGFuPlwiK1xuXHRcdFx0XCIgSXMgdGhhdCB5b3VyIG5hbWU/IFwiK1xuXHRcdFx0XCI8c3BhbiBjbGFzcz1cXFwid2V0c3Bld19sb2dpbl9idXR0b25zXFxcIj5cIitcblx0XHRcdFwiIDxhIGNsYXNzPVxcXCJ3ZXRzcGV3X2xvZ2luX3llc1xcXCI+WUVTPC9hPiBcIitcblx0XHRcdFwiIDxhIGNsYXNzPVxcXCJ3ZXRzcGV3X2xvZ2luX25vXFxcIj5OTzwvYT4gXCIrXG5cdFx0XHRcIjwvc3Bhbj5cIitcblx0XHRcdFwiPC9kaXY+XCI7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZCgkKGxvZ2luX2h0bWwpKTtcblx0XHRcdCQoXCIud2V0c3Bld19sb2dpbl9idXR0b25zIGFcIikuY2xpY2soc3Bldy5jbGlja19sb2dpbik7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmVtcHR5KCk7XG5cdFx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZChzcGV3LmRpdl9jaGF0KTtcblx0XHRcdHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsVG9wID0gc3Bldy5kaXZfY2hhdFswXS5zY3JvbGxIZWlnaHQ7IC8vIHNjcm9sbCB0byBib3R0b21cblx0XHRcdHNwZXcuc3RpY2t5X2JvdHRvbT10cnVlO1x0XHRcdFxuXHRcdFx0dmFyIGxhc3RfaGVpZ2h0PTA7XG5cdFx0XHRzcGV3LmRpdl9jaGF0LnNjcm9sbChmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihsYXN0X2hlaWdodD09c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxIZWlnaHQpIC8vIGhlaWdodCBtdXN0IGJlIGNvbnN0YW50IGZvciB1cyB0byBjYXJlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgb2xkdG9wPXNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsVG9wO1xuXHRcdFx0XHRcdHZhciBvbGRoZWlnaHQ9c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxIZWlnaHQtc3Bldy5kaXZfY2hhdFswXS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRcdFx0aWYob2xkdG9wPj0ob2xkaGVpZ2h0KSkgLy8gc3RpY2t5IHdoZW4gYXQgYm90dG9tXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3Bldy5zdGlja3lfYm90dG9tPXRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcGV3LnN0aWNreV9ib3R0b209ZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgLy8gcmVtYWluIHN0dWNrXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihzcGV3LnN0aWNreV9ib3R0b20pXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3Bldy5kaXZfY2hhdFswXS5zY3JvbGxUb3AgPSBzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodDsgLy8gc2Nyb2xsIHRvIGJvdHRvbVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsYXN0X2hlaWdodD1zcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodDtcbi8vY29uc29sZS5sb2coc3Bldy5zdGlja3lfYm90dG9tKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkKFwiLnNwZXdfY2xpY2tcIikuY2xpY2soc3Bldy5jbGljayk7IC8vIG1ha2Ugc3VyZSBkZWZhdWx0IGNsaWNrcyBzdGlsbCB3b3JrXG5cdH1cblxuXHRzcGV3LmF1dG9IVE1MaW1nPWZ1bmN0aW9uKHVybCl7XG5cblx0XHR2YXIgdXJsaW5rPSc8YSBocmVmPVwiJyt1cmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrdXJsKyc8L2E+Jztcblx0XHRcblx0XHRpZiggc3Bldy5maWxlc2l6ZXNbIHVybCBdIClcblx0XHR7XG5cdFx0XHRpZiggc3Bldy5maWxlc2l6ZXNbIHVybCBdID49IHNwZXcubWF4X2ltYWdlX3NpemUpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiB1cmxpbms7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHR4aHIub3BlbignSEVBRCcsIHVybCwgdHJ1ZSk7XG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHNpemU9MDtcblx0XHRcdFx0aWYgKCB4aHIucmVhZHlTdGF0ZSA9PSA0ICkge1xuXHRcdFx0XHRcdGlmICggeGhyLnN0YXR1cyA9PSAyMDAgKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHNpemU9TWF0aC5mbG9vcih4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJykpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRzcGV3LmZpbGVzaXplc1sgdXJsIF0gPSBzaXplIDtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoIHNpemUgPj0gc3Bldy5tYXhfaW1hZ2Vfc2l6ZSkgLy8gZGlzYWJsZT9cblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0JChcIi53ZXRzcGV3X2F1dG9pbWdcIikuZWFjaChmdW5jdGlvbigpeyAvLyBmaW5kIGJpZyBpbWFnZXMgYW5kIGRpc2FibGUgdGhlbVxuXHRcdFx0XHRcdFx0XHRcdGlmKCQodGhpcykuYXR0cihcInNyY1wiKT09dXJsKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdCQodGhpcykucmVwbGFjZVdpdGgoIHVybGluayApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0eGhyLnNlbmQobnVsbCk7XHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiAnPGEgaHJlZj1cIicrdXJsKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHN0eWxlPVwibWF4LWhlaWdodDozMyU7bWF4LXdpZHRoOjEwMCU7XCIgY2xhc3M9XCJ3ZXRzcGV3X2F1dG9pbWdcIiBzcmM9XCInK3VybCsnXCIgLz48L2E+JztcblxuXHR9XG5cdFxuXHRzcGV3LmF1dG9IVE1MbGlua3M9ZnVuY3Rpb24ocyl7XG5cdFx0dmFyIHNuPVwiXCI7XG5cdFx0dmFyIGZiPWZ1bmN0aW9uKHVybCl7XG5cdFx0XHRpZih1cmwubWF0Y2goLyhqcGd8cG5nfGdpZnxqcGVnKSQvaSkpIC8vIGl0IGlzIHByb2JhYmx5IGFuIGltYWdlLCBlbWJlZCBpdCB2aWEgYm91bmNlclxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gc3Bldy5hdXRvSFRNTGltZyh1cmwpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdFx0cmV0dXJuICc8YSBocmVmPVwiJyt1cmwrJ1wiIHRhcmdldD1cIl9ibGFua1wiPicrdXJsKyc8L2E+Jztcblx0XHR9XG5cdFx0c249cy5yZXBsYWNlKC8oaHR0cHM/OlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSopL2dpbSwgZmIpO1xuLypcblx0XHRpZihzbj09cykgLy8gdHJ5IGFnYWluIGlmIG5vdGhpbmcgY2hhbmdlZFxuXHRcdHtcblx0XHRcdHNuPXMucmVwbGFjZSgvKHd3d1xcLltcXFNdKyhcXGJ8JCkpL2dpbSwgZmIpO1xuXHRcdH1cbiovXG5cdFx0cmV0dXJuIHNuO1xuXHR9XG5cdHNwZXcuZXNjYXBlSFRNTD1mdW5jdGlvbihzKSB7XG5cdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocyk7XG5cdFx0ZGl2LmFwcGVuZENoaWxkKHRleHQpO1xuXHRcdHJldHVybiBkaXYuaW5uZXJIVE1MO1xuXHR9XG5cdFxuXHRzcGV3LmRpc3BsYXk9ZnVuY3Rpb24obCkge1xuXHRcdGlmKGwpXG5cdFx0e1xuXHRcdFx0c3Bldy5kaXZfY2hhdC5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X2xpbmVcXFwiPlwiK2wrXCI8L2Rpdj5cIik7XG5cdFx0XHR3aGlsZShzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbEhlaWdodD4xNjM4NCkgLy8gbWF4IGhlaWdodCwgcmVtb3ZlIG9sZCBsaW5lc1xuXHRcdFx0e1xuXHRcdFx0XHRzcGV3LmRpdl9jaGF0LmNoaWxkcmVuKFwiZGl2OmZpcnN0LWNoaWxkXCIpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYoc3Bldy5zdGlja3lfYm90dG9tKVxuXHRcdFx0e1xuXHRcdFx0XHRzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbFRvcCA9IHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0OyAvLyBzY3JvbGwgdG8gYm90dG9tXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHNwZXcuZGlzcGxheV9ub3RlPWZ1bmN0aW9uKGwpIHtcblx0XHRpZihsKSB7IHNwZXcuZGlzcGxheSgnPHNwYW4gc3R5bGU9XCJjb2xvcjojMGYwXCI+JytsKyc8L3NwYW4+Jyk7IH1cbiAgICAgfVxuICAgICBcblx0c3Bldy5kYXJrX3JnYj1mdW5jdGlvbihyZ2Ipe1xuXHRcdHZhciByPXBhcnNlSW50KHJnYi5zdWJzdHIoMCwxKSwxNik7XG5cdFx0dmFyIGc9cGFyc2VJbnQocmdiLnN1YnN0cigxLDEpLDE2KTtcblx0XHR2YXIgYj1wYXJzZUludChyZ2Iuc3Vic3RyKDIsMSksMTYpO1x0XHRcblx0XHRcblx0XHRpZihyK2crYj4zMClcblx0XHR7XG5cdFx0XHR2YXIgbnI9cjtcblx0XHRcdHZhciBuZz1nO1xuXHRcdFx0dmFyIG5iPWI7XG5cdFx0XHRcblx0XHRcdHI9MTUtTWF0aC5mbG9vcigobmcrbmIpLzIpO1xuXHRcdFx0Zz0xNS1NYXRoLmZsb29yKChucituYikvMik7XG5cdFx0XHRiPTE1LU1hdGguZmxvb3IoKG5yK25nKS8yKTtcblx0XHR9XG5cdFx0cmV0dXJuIHIudG9TdHJpbmcoMTYpK2cudG9TdHJpbmcoMTYpK2IudG9TdHJpbmcoMTYpO1xuXHR9XG5cblx0c3Bldy5odG1sX3NldHVwPWZ1bmN0aW9uKG9wdHMpXG5cdHtcblx0XHRmb3IoaSBpbiBvcHRzKSB7IHNwZXcub3B0c1tpXT1vcHRzW2ldOyB9IC8vIG92ZXJpZGUgb3B0c1xuXHRcdHNwZXcubG9hZF9vcHRzKCk7XG5cdFx0XHRcdFxuXHRcdHNwZXcuc2VydmVyX2FkZHJlc3M9XCJ3czovL1wiK29wdHMuaG9zdCtcIjo1MjIzL1wiO1xuXHRcdHNwZXcuZGl2PSQob3B0cy5kaXYpO1xuXHRcdFx0XHRcdFx0XG5cdFx0c3Bldy5kaXZfc3Bldz0kKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld19zcGV3XFxcIj48L2Rpdj5cIik7XG5cdFx0c3Bldy5kaXZfd2V0dj0kKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld193ZXR2XFxcIiBpZD1cXFwid2V0c3Bld193ZXR2XFxcIiA+PC9kaXY+XCIpO1xuXG5cblx0XHRzcGV3LmRpdl90YWJzPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3RhYnNcXFwiPjxhPkZJWDwvYT48YT5DSEFUPC9hPjxhPlVTRVJTPC9hPjxhPlJPT01TPC9hPjxhPk9QVFM8L2E+PGE+SEVMUDwvYT48YT5ORVdTPC9hPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl9jc3M9JChcIjxkaXYgc3R5bGU9XFxcImRpc3BsYXk6bm9uZTtcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3Lm1ha2VfY3NzX2Zyb21fb3B0cygpO1x0XHRcblx0XHRzcGV3LmRpdl9tYWluPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X21haW5cXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl9oZWxwPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X2hlbHBcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl9uZXdzPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X25ld3NcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl9jaGF0PSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X2NoYXRcXFwiPjwvZGl2PlwiKTtcblx0XHRzcGV3LmRpdl91c2Vycz0kKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld191c2Vyc1xcXCI+PC9kaXY+XCIpO1xuXHRcdHNwZXcuZGl2X3Jvb21zPSQoXCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X3Jvb21zXFxcIj48L2Rpdj5cIik7XG5cdFx0c3Bldy5kaXZfb3B0cz0kKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld19vcHRzXFxcIj48L2Rpdj5cIik7XG5cdFx0c3Bldy5kaXZfdGFsaz0kKFwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld190eXBlXFxcIj48L2Rpdj5cIik7XG5cdFx0c3Bldy5kaXZfdGFsa19mb3JtPSQoXCI8Zm9ybT48L2Zvcm0+XCIpO1xuXHRcdHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dD0kKFwiPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIC8+XCIpO1xuXHRcdHNwZXcuZGl2X3RhbGsuYXBwZW5kKHNwZXcuZGl2X3RhbGtfZm9ybSk7XG5cdFx0c3Bldy5kaXZfdGFsa19mb3JtLmFwcGVuZChzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQpO1xuXG5cdFx0c3Bldy5kaXZfaGVscC5odG1sKFwiPGlmcmFtZSBzdHlsZT1cXFwid2lkdGg6MTAwJTtoZWlnaHQ6MTAwJVxcXCIgc3JjPVxcXCJodHRwOi8vaGVscC53ZXRnZW5lcy5jb20vXFxcIj48L2lmcmFtZT5cIik7XG5cdFx0c3Bldy5kaXZfbmV3cy5odG1sKFwiPGlmcmFtZSBzdHlsZT1cXFwid2lkdGg6MTAwJTtoZWlnaHQ6MTAwJVxcXCIgc3JjPVxcXCJodHRwOi8vd2V0LmFwcHNwb3QuY29tL25ld3MuZnJhbWVcXFwiPjwvaWZyYW1lPlwiKTtcblxuXHRcdHNwZXcuZGl2X3NwZXcuYXBwZW5kKHNwZXcuZGl2X2Nzcyk7XG5cdFx0c3Bldy5kaXZfc3Bldy5hcHBlbmQoc3Bldy5kaXZfdGFicyk7XG5cdFx0c3Bldy5kaXZfc3Bldy5hcHBlbmQoc3Bldy5kaXZfbWFpbik7XG5cdFx0c3Bldy5kaXZfc3Bldy5hcHBlbmQoc3Bldy5kaXZfdGFsayk7XG5cdFx0XG5cdFx0c3Bldy5kaXYuZW1wdHkoKTtcblx0XHRzcGV3LmRpdi5hcHBlbmQoc3Bldy5kaXZfc3Bldyk7XG5cdFx0c3Bldy5kaXYuYXBwZW5kKHNwZXcuZGl2X3dldHYpO1xuXHRcblx0XHR2YXIgY21kbG9nX29mZj1zcGV3Lm9wdHNbXCJjbWRsb2dcIl0ubGVuZ3RoO1xuXHRcdHZhciB0YWJfc2V0PS0xO1xuXHRcdHZhciB0YWJfcz1cIlwiO1xuXHRcdHZhciB0YWJfYmc9XCJcIjtcblx0XHR2YXIgdGFiX2VkPVwiXCI7XG5cdFx0c3Bldy5kaXZfdGFsa19mb3JtLnN1Ym1pdChmdW5jdGlvbihlKXtcblx0XHRcdHZhciBjbD1zcGV3Lm9wdHNbXCJjbWRsb2dcIl07IC8vIG1vc3QgcmVjZW50IGF0IHRoZSBib3R0b21cblx0XHRcdGNsLnB1c2goc3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LnZhbCgpKTtcblx0XHRcdHdoaWxlKGNsLmxlbmd0aD4zMilcblx0XHRcdHtcblx0XHRcdFx0Y2wuc3BsaWNlKDAsMSk7XG5cdFx0XHR9XG5cdFx0XHRzcGV3LnNhdmVfb3B0cygpO1xuXHRcdFx0Y21kbG9nX29mZj1jbC5sZW5ndGg7XG4vL2NvbnNvbGUubG9nKGNsLmxlbmd0aCk7XG5cdFx0fSk7XG5cdFx0c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LmtleWRvd24oZnVuY3Rpb24oZSl7XG5cdFx0XHRzcGV3LmRpdl9jaGF0WzBdLnNjcm9sbFRvcCA9IHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsSGVpZ2h0OyAvLyBzY3JvbGwgdG8gYm90dG9tXG5cdFx0XHRzcGV3LnN0aWNreV9ib3R0b209dHJ1ZTtcbi8vY29uc29sZS5sb2coZS53aGljaCk7XG5cdFx0XHRpZihlLndoaWNoIT05KXt0YWJfc2V0PS0xO30gLy8gZGlzYWJsZSB0YWIgaGlzdG9yeSBvbiBhbnkgb3RoZXIga2V5IHRoYW4gdGFiXG5cdFx0XHRzd2l0Y2goZS53aGljaClcblx0XHRcdHtcblx0XHRcdFx0Y2FzZSA5OiAvL3RhYlxuXHRcdFx0XHRcdGlmKHRhYl9zZXQ9PS0xKSAvLyBmaXJzdCB0YWJcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0YWJfcz1zcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQudmFsKCk7XG5cdFx0XHRcdFx0XHR0YWJfZWQ9dGFiX3MubWF0Y2goL1xcdyskLyk7XG5cdFx0XHRcdFx0XHRpZih0YWJfZWQpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRhYl9lZD10YWJfZWQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG5cdFx0XHRcdFx0XHRcdHRhYl9iZz10YWJfcy5zdWJzdHIoMCx0YWJfcy5sZW5ndGgtdGFiX2VkLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgLy8gbmV4dCB0YWJcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKCB0YWJfZWQgKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhciBudW09MDtcblx0XHRcdFx0XHRcdGZvciggbiBpbiBzcGV3LnVzZXJzIClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0aWYoIG4uc3Vic3RyKDAsdGFiX2VkLmxlbmd0aCkudG9Mb3dlckNhc2UoKT09dGFiX2VkIClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmKG51bT49dGFiX3NldClcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0YWJfc2V0PT0tMSl7dGFiX3NldCsrO30gLy8gbWFyayBhcyBhY3RpdmUgbm93XG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJfc2V0Kys7XG5cdFx0XHRcdFx0XHRcdFx0XHRzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQudmFsKHRhYl9iZytuKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0bnVtKys7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHRhYl9zZXQ+LTEpIC8vIHdlIGZvdW5kIG9uZSBiZWZvcmUsIHNvIHdyYXBcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGFiX3NldD0wO1xuXHRcdFx0XHRcdFx0XHRzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQudmFsKHRhYl9zKTtcblx0XHRcdFx0XHRcdH1cbi8vY29uc29sZS5sb2coZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM3OiAvL2xlZnRcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzg6IC8vdXBcblx0XHRcdFx0XHR2YXIgY2w9c3Bldy5vcHRzW1wiY21kbG9nXCJdOyAvLyBtb3N0IHJlY2VudCBhdCB0aGUgYm90dG9tXG5cdFx0XHRcdFx0dmFyIHM9XCJcIlxuXHRcdFx0XHRcdGNtZGxvZ19vZmYtPTE7XG5cdFx0XHRcdFx0aWYoY21kbG9nX29mZjwwKSB7IGNtZGxvZ19vZmY9MDsgfVxuXHRcdFx0XHRcdGlmKGNsW2NtZGxvZ19vZmZdKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHM9Y2xbY21kbG9nX29mZl07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dC52YWwocyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOTogLy9yaWdodFxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0MDogLy9kb3duXG5cdFx0XHRcdFx0dmFyIGNsPXNwZXcub3B0c1tcImNtZGxvZ1wiXTsgLy8gbW9zdCByZWNlbnQgYXQgdGhlIGJvdHRvbVxuXHRcdFx0XHRcdHZhciBzPVwiXCJcblx0XHRcdFx0XHRjbWRsb2dfb2ZmKz0xO1xuXHRcdFx0XHRcdGlmKGNtZGxvZ19vZmY+Y2wubGVuZ3RoKSB7IGNtZGxvZ19vZmY9Y2wubGVuZ3RoOyB9XG5cdFx0XHRcdFx0aWYoY2xbY21kbG9nX29mZl0pXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cz1jbFtjbWRsb2dfb2ZmXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3Bldy5kaXZfdGFsa19mb3JtX2lucHV0LnZhbChzKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0dGFiX3NldD0tMTsgLy8gZGlhYmxlIG11bHRpcGxlIHRhYnNcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0pOyAvLyB0eXBpbmcgc2Nyb2xscyB1cyB0byB0aGUgYm90dG9tXG5cdFxuXHRcdCQoXCIud2V0c3Bld190YWJzIGFcIikuY2xpY2soc3Bldy5jbGlja190YWIpO1xuXHRcdHNwZXcuc2hvd190YWIoXCJsb2dpblwiKTtcblx0XHRcbi8qXHRcbnNwZXcuZGl2X3dldHYuYXBwZW5kKCQoJzx2aWRlbyBzdHlsZT1cIndpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7XCIgJytcbicgc3JjPVwiaHR0cDovL3d3dy5hcmNoaXZlLm9yZy9kb3dubG9hZC9ob3Jyb3JfZXhwcmVzc19pcG9kL2hvcnJvcl9leHByZXNzXzUxMmtiLm1wNFwiICcrXG4nIGNvbnRyb2xzPVwiY29udHJvbHNcIiBhdXRvcGxheT1cImF1dG9wbGF5XCI+PC92aWRlbz4nKSk7XG4qL1xuXG5cblx0XHQkKHNwZXcuZGl2X3RhbGtfZm9ybSkuc3VibWl0KGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBsaW5lID0gJChzcGV3LmRpdl90YWxrX2Zvcm1faW5wdXQpLnZhbCgpO1xuXHRcdFx0c3Bldy5kb19saW5lKGxpbmUpO1xuXG5cdFx0ICAkKHNwZXcuZGl2X3RhbGtfZm9ybV9pbnB1dCkudmFsKCcnKTsvLy5mb2N1cygpO1xuXHRcdCAgcmV0dXJuIGZhbHNlO1xuXHRcdH0pXG5cblx0XHRzcGV3LnNvY2tfc2V0dXAoKTtcblx0XHRcbi8vXHRcdHZhciBsYXN0X2hvdmVyO1xuXG5cdFx0JChkb2N1bWVudCkub24oXCJtb3VzZWVudGVyXCIsXCIud2V0c3Bld19uYW1lXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5hbWU9JCh0aGlzKS5kYXRhKFwibmFtZVwiKTtcblx0XHRcdFx0aWYoIW5hbWUpeyBuYW1lPSQodGhpcykuaHRtbCgpOyB9IC8vIHRoaXMgc2hvdWxkIGJlIHRoZSBuYW1lXG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgdT1zcGV3LnVzZXJzW25hbWVdO1xuLy9cdFx0XHRcdGlmKHUgJiYgKHRoaXMhPWxhc3RfaG92ZXIpKVxuXHRcdFx0XHRpZih1KVxuXHRcdFx0XHR7XG4vL1x0XHRcdFx0XHRsYXN0X2hvdmVyPXRoaXM7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKFwibmFtZVwiLG5hbWUpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHUubmFtZXNwYW49JCh0aGlzKTsgLy8gdGhpcyBpcyB0aGUgb25lIHdlIHdhbnQgdG8gdXBkYXRlXG5cdFx0XHRcdFx0c3Bldy5zZW5kX21zZyh7Y21kOlwibm90ZVwiLG5vdGU6XCJpbmZvXCIsaW5mbzpcInVzZXJcIixuYW1lOm5hbWV9KTsgLy8gYXNrIHRoZSBzZXJ2ZXIgZm9yIGluZm9cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG4vKlx0XHRcdFxuXHRcdCQoZG9jdW1lbnQpLm9uKFwibW91c2VsZWF2ZVwiLFwiLndldHNwZXdfbmFtZVwiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBuYW1lPSQodGhpcykuZGF0YShcIm5hbWVcIik7XG5cdFx0XHRcdGlmKCFuYW1lKXsgbmFtZT0kKHRoaXMpLmh0bWwoKTsgfSAvLyB0aGlzIHNob3VsZCBiZSB0aGUgbmFtZVxuXHRcdFx0XHR2YXIgdT1zcGV3LnVzZXJzW25hbWVdO1xuXHRcdFx0XHRpZih1KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dS5uYW1lc3Bhbj11bmRlZmluZWQ7IC8vIGRvIG5vdCB1cGRhdGVcblx0XHRcdFx0fVxuXHRcdFx0XHQkKHRoaXMpLmh0bWwobmFtZSk7XG5cdFx0XHR9KTtcdFx0XG4qL1x0XHRcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpe3NwZXcudXBkYXRlKCk7fSwxMDAwKSAvLyBjYWxsIG9uY2UgYSBzZWNcblx0XHRyZXR1cm4gc3Bldztcblx0fTtcblx0XHRcblx0XG5cblx0c3Bldy51cGRhdGU9ZnVuY3Rpb24oKXtcblx0XHRzcGV3Lnl0YXBpX2NvdW50Kys7XG5cdFx0aWYoIHNwZXcub3B0cy50diApIC8vIHR2IG11c3QgYmUgZW5hYmxlZFxuXHRcdHtcblx0XHRcdGlmKCFzcGV3Lnl0YXBpKSAvLyByZWxvYWQgeW91dHViZSBpZiBpdCBmYWlsc1xuXHRcdFx0e1xuXHRcdFx0XHRpZiggc3Bldy55dGFwaV9jb3VudD41ICkgLy8gd2FpdCBhIHdoaWxlIGJldHdlZW4gcmV0cnlzXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzcGV3Lnl0YXBpX2NvdW50PTA7XG5cblx0XHRcdFx0XHRuZXcgWVQuUGxheWVyKCd3ZXRzcGV3X3dldHYnLCB7XG5cdFx0XHRcdFx0XHR3aWR0aDogJzY0MCcsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6ICc0ODAnLFxuXHRcdFx0XHRcdFx0dmlkZW9JZDogJzlYVmNJaS1zTGxrJyxcblx0XHRcdFx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRcdFx0J29uUmVhZHknOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdFx0XHRcdHNwZXcueXRhcGk9ZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRcdFx0XHRcdHNwZXcuc2VuZF9tc2coe2NtZDpcImdhbWVcIixnY21kOlwid2V0dlwiLHdldHY6XCJyZWFkeVwifSk7IC8vIGdldCBjdXJyZW50IHZpZFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0J29uU3RhdGVDaGFuZ2UnOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChldmVudC5kYXRhID09IFlULlBsYXllclN0YXRlLkVOREVEIClcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRzcGV3LnNlbmRfbXNnKHtjbWQ6XCJnYW1lXCIsZ2NtZDpcIndldHZcIix3ZXR2OlwiaW5mb1wifSk7IC8vIHRoaXMgdGVsbHMgdGhlIHNlcnZlciB0byBwbGF5IG5leHQgdmlkXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0aWYoc3Bldy55dGFwaS5zZXRTaXplKSAvLyAmJiAhc3Bldy55dGFwaV9yZWFkeSApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzcGV3Lnl0YXBpX3JlYWR5PXRydWU7XG5cdC8vXHRcdFx0XHRzcGV3Lnl0YXBpLnNldFNpemUoNjQwLDQ4MCk7XG5cdC8vXHRcdFx0XHRzcGV3Lnl0YXBpLmxvYWRWaWRlb0J5SWQoXCJ5bEx6eUhrNTRaMFwiKTtcblx0XHRcdFx0XHRpZihzcGV3Lm5leHRxdmlkKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNwZXcueXRhcGkubG9hZFZpZGVvQnlJZChzcGV3Lm5leHRxdmlkLnZpZCxzcGV3Lm5leHRxdmlkLm51bSk7XG5cdFx0XHRcdFx0XHRzcGV3LmZvcmNldGltZT1zcGV3Lm5leHRxdmlkLm51bTtcbi8vY29uc29sZS5sb2coXCJmb3JjZXRpbWUgc2V0IFwiK3NwZXcuZm9yY2V0aW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3Bldy5uZXh0cXZpZD11bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmKHNwZXcuZm9yY2V0aW1lKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGQ9c3Bldy55dGFwaS5nZXRDdXJyZW50VGltZSgpO1xuXHRcdFx0XHRcdGlmKCBkICYmIChkIT0wKSApIC8vIGl0IHNpdHMgb24gMCBmb3IgYSB3aGlsZSwgd2FpdCBmb3IgaXQgdG8gY2hhbmdlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZD1kLXNwZXcuZm9yY2V0aW1lO1xuLy9jb25zb2xlLmxvZyhcImZvcmNldGltZSBkaWZmIFwiK2QpO1xuXHRcdFx0XHRcdFx0aWYoTWF0aC5hYnMoZCk8MTApXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNwZXcuZm9yY2V0aW1lPXVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3Bldy55dGFwaS5zZWVrVG8oc3Bldy5mb3JjZXRpbWUsdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgLy8gdW5sb2FkIHR2XG5cdFx0e1xuXHRcdFx0c3Bldy55dGFwaT11bmRlZmluZWQ7XG5cdFx0XHRzcGV3Lnl0YXBpX2NvdW50PTk5OTk7XG5cdFx0XHQkKFwiI3dldHNwZXdfd2V0dlwiKS5yZXBsYWNlV2l0aChcIjxkaXYgY2xhc3M9XFxcIndldHNwZXdfd2V0dlxcXCIgaWQ9XFxcIndldHNwZXdfd2V0dlxcXCIgPjwvZGl2PlwiKTtcblx0XHR9XG5cdFx0XG5cdFx0aWYoc3Bldy5zdGlja3lfYm90dG9tKVxuXHRcdHtcblx0XHRcdHNwZXcuZGl2X2NoYXRbMF0uc2Nyb2xsVG9wID0gc3Bldy5kaXZfY2hhdFswXS5zY3JvbGxIZWlnaHQ7IC8vIHNjcm9sbCB0byBib3R0b21cblx0XHR9XG5cdH07XG5cbi8vIGhhbmRsZSBhIGxpbmUgaW5wdXQgZnJvbSB0aGUgdXNlclxuLy8gcHJvYmFibHkgbWVhbnMgc2VuZGluZyBhIG1zZyB0byB0aGUgc3BldyBzZXJ2ZXJcblxuXHRzcGV3LmRvX2xpbmU9ZnVuY3Rpb24obGluZSl7XG5cblx0XHRcdFxuXHRcdHZhciBhYT1saW5lLnNwbGl0KFwiIFwiKTsgLy8gdGhpcyByZXF1aXJlcyBhIHJlYWwgc3BhY2UgdG8gc2VwZXJhdGUgYXJncy4uLlxuXHRcdHZhciBjbWQ9YWFbMF07XG5cblx0XHRpZihjbWQ9PVwiL2Nvbm5lY3RcIilcblx0XHR7XG5cdFx0XHRsaW5lPW51bGw7IC8vIGRvIG5vdCBzZW5kIHRvIHNlcnZlclxuXHRcdFx0c3Bldy5zb2NrX3NldHVwKCk7IC8vIHRyeSBhbmQgc2V0dXAgdGhlIHNlcnZlcnN0dWZmcyBhZ2FpblxuXHRcdH1cblx0XHRlbHNlXG5cdFx0aWYoY21kPT1cIi9kaXNjb25uZWN0XCIpXG5cdFx0e1xuXHRcdFx0bGluZT1udWxsOyAvLyBkbyBub3Qgc2VuZCB0byBzZXJ2ZXJcblx0XHRcdHNwZXcuc29ja19jbGVhbigpOyAvLyBkcm9wIGNvbm5lY3Rpb24gdG8gc2VydmVyXG5cdFx0fVxuXG5cdFx0aWYobGluZSlcblx0XHR7XG5cdFx0XHRzcGV3LnNlbmRfbXNnKHNwZXcuY21kX3RvX21zZyhsaW5lKSk7XG5cdFx0fVxuXG5cdH07XG5cbn07XG4iLCJcbnZhciBscz1mdW5jdGlvbihhKSB7IGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdChhLHtkZXB0aDpudWxsfSkpOyB9XG5cbmV4cG9ydHMuc2V0dXA9ZnVuY3Rpb24ob3B0cyl7XG5cblxuXHR2YXIgc3Bldz17fTtcblxuXHRzcGV3LnN0b3JhZ2VfYXZhaWxhYmxlPXR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlIT09J3VuZGVmaW5lZCc7XG5cdHNwZXcuanNvbl9hdmFpbGFibGU9dHlwZW9mIHdpbmRvdy5KU09OIT09J3VuZGVmaW5lZCc7XG5cblxuXHRzcGV3LnVzZXJzPXt9O1xuXG5cdHNwZXcubWF4X2ltYWdlX3NpemU9MTAyNCoxMDI0OyAvLyAxIG1lZyBzZWVtcyByZWFzb25hYmxlPyBiaWdnZXIgZmlsZXMgYXJlIG5vdCBkaXNwbGF5ZWRcblx0c3Bldy5maWxlc2l6ZXM9e307IC8vIG1hcCB1cmxzIHRvIGZpbGUgc2l6ZXNcblx0XG5cdHNwZXcueXRhcGk9dW5kZWZpbmVkO1xuXHRzcGV3Lnl0YXBpX2NvdW50PTk5OTk7XG5cblx0cmVxdWlyZSgnLi9zcGV3Lm9wdHMuanMnKS5zZXR1cChzcGV3KTtcblx0cmVxdWlyZSgnLi9zcGV3LnNvY2suanMnKS5zZXR1cChzcGV3KTtcblx0cmVxdWlyZSgnLi9zcGV3Lm5hbWVzLmpzJykuc2V0dXAoc3Bldyk7XG5cdHJlcXVpcmUoJy4vc3Bldy5odG1sLmpzJykuc2V0dXAoc3Bldyk7XG5cdFxuXHRzcGV3Lmh0bWxfc2V0dXAob3B0cyk7XG5cdFx0XHRcblx0cmV0dXJuIHNwZXc7XG59O1xuIiwiXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKHNwZXcpe1xuXG4vLyByYW5kb20gbmFtZXNcblx0XG5zcGV3LnJhbmRvbV9uYW1lPWZ1bmN0aW9uKCl7XG52YXIgdHh0X2FkamVjdGl2ZXM9W1xuXHRcInJhdmlzaGluZ1wiLFxuXHRcIm1pbWljXCIsXG5cdFwiZmFtb3VzXCIsXG5cdFwiY2hlZXJmdWxcIixcblx0XCJsaXZpZFwiLFxuXHRcIm9ic3RpbmF0ZVwiLFxuXHRcImV4aGF1c3RlZFwiLFxuXHRcImdyYWNlZnVsXCIsXG5cdFwib3V0cmFnZW91c1wiLFxuXHRcInJhZGljYWxcIixcblx0XCJjaGlsZGlzaFwiLFxuXHRcInNub2JiaXNoXCIsXG5cdFwibWlzZXJseVwiLFxuXHRcImFtaWFibGVcIixcblx0XCJkaXNndXN0aW5nXCIsXG5cdFwiYXdmdWxcIixcblx0XCJodW1vcm91c1wiLFxuXHRcImZhbmNpZnVsXCIsXG5cdFwicGF0aGV0aWNcIixcblx0XCJ3aW5keVwiLFxuXHRcImR1c3R5XCIsXG5cdFwiYmFzaGZ1bFwiLFxuXHRcImZyZWFreVwiLFxuXHRcImNoaWxseVwiLFxuXHRcInN0b3JteVwiLFxuXHRcImh1bWlkXCIsXG5cdFwiYm91bnRpZnVsXCIsXG5cdFwianViaWxhbnRcIixcblx0XCJpcnJpdGF0ZWRcIixcblx0XCJwYXRpZW50XCIsXG5cdFwiZGl6enlcIixcblx0XCJza2VwdGljYWxcIixcblx0XCJwdXp6bGVkXCIsXG5cdFwicGVycGxleGVkXCIsXG5cdFwiam92aWFsXCIsXG5cdFwiaHlwZXJcIixcblx0XCJzcXVpcnJlbHlcIixcblx0XCJqaXR0ZXJ5XCIsXG5cdFwiZWxlZ2FudFwiLFxuXHRcImdsZWVmdWxcIixcblx0XCJkcmVhcnlcIixcblx0XCJpbXBpc2hcIixcblx0XCJzbmVha3lcIixcblx0XCJob3JyaWRcIixcblx0XCJtb25zdGVyb3VzXCIsXG5cdFwiYWJsZVwiLFxuXHRcImFibm9ybWFsXCIsXG5cdFwiYWJzZW50XCIsXG5cdFwiYWJzb2x1dGVcIixcblx0XCJhY2N1cmF0ZVwiLFxuXHRcImFjaWRpY1wiLFxuXHRcImFjb3VzdGljXCIsXG5cdFwiYWN0aXZlXCIsXG5cdFwiYWRlcXVhdGVcIixcblx0XCJhaXJib3JuZVwiLFxuXHRcImFpcnlcIixcblx0XCJhbGxcIixcblx0XCJhbG9uZVwiLFxuXHRcImFtZXJpY2FuXCIsXG5cdFwiYW1waGliaW91c1wiLFxuXHRcImFuZ3J5XCIsXG5cdFwiYW5udWFsXCIsXG5cdFwiYW5vdGhlclwiLFxuXHRcImFueVwiLFxuXHRcImFwcGFyZW50XCIsXG5cdFwiYXJ0aWZpY2lhbFwiLFxuXHRcImF0b21pY1wiLFxuXHRcImF1ZGlibGVcIixcblx0XCJhdXRvbWF0aWNcIixcblx0XCJhdXhpbGlhcnlcIixcblx0XCJhdmFpbGFibGVcIixcblx0XCJiYWRcIixcblx0XCJiYWxsaXN0aWNcIixcblx0XCJiYXJlXCIsXG5cdFwiYmFzaWNcIixcblx0XCJiZWF1dGlmdWxcIixcblx0XCJiZW5lZmljaWFsXCIsXG5cdFwiYmVzdFwiLFxuXHRcImJldHRlclwiLFxuXHRcImJpZ1wiLFxuXHRcImJpZ2dlc3RcIixcblx0XCJiaW5hcnlcIixcblx0XCJiaXBvbGFyXCIsXG5cdFwiYml0dGVyXCIsXG5cdFwiYmxhY2tcIixcblx0XCJibGluZFwiLFxuXHRcImJsdWVcIixcblx0XCJib3RoXCIsXG5cdFwiYnJpZWZcIixcblx0XCJicmlnaHRcIixcblx0XCJicm9hZFwiLFxuXHRcImJyb3duXCIsXG5cdFwiYnVzeVwiLFxuXHRcImNhcGFibGVcIixcblx0XCJjYXJlZnVsXCIsXG5cdFwiY2FyZWxlc3NcIixcblx0XCJjYXJuYWxcIixcblx0XCJjYXV0aW91c1wiLFxuXHRcImNlbGVzdGlhbFwiLFxuXHRcImNlbHNpdXNcIixcblx0XCJjZW50cmFsXCIsXG5cdFwiY2VyYW1pY1wiLFxuXHRcImNlcnRhaW5cIixcblx0XCJjaGVhcFwiLFxuXHRcImNoZWFwZXJcIixcblx0XCJjaXZpbFwiLFxuXHRcImNsZWFuXCIsXG5cdFwiY2xlYXJcIixcblx0XCJjbG9zZXJcIixcblx0XCJjb2Fyc2VcIixcblx0XCJjb2xkXCIsXG5cdFwiY29tbW9uXCIsXG5cdFwiY29tcGFjdFwiLFxuXHRcImNvbXBsZXRlXCIsXG5cdFwiY29tcGxleFwiLFxuXHRcImNvbXBvdW5kXCIsXG5cdFwiY29tcHVsc29yeVwiLFxuXHRcImNvbmNyZXRlXCIsXG5cdFwiY29uc2Npb3VzXCIsXG5cdFwiY29uc3RhbnRcIixcblx0XCJjb250aW51b3VzXCIsXG5cdFwiY29udmVuaWVudFwiLFxuXHRcImNvb2xcIixcblx0XCJjb3JyZWN0XCIsXG5cdFwiY29ycm9zaXZlXCIsXG5cdFwiY3JpdGljYWxcIixcblx0XCJjcnVlbFwiLFxuXHRcImN1YmljXCIsXG5cdFwiY3VscGFibGVcIixcblx0XCJjdXJyZW50XCIsXG5cdFwiZGFpbHlcIixcblx0XCJkYW5nZXJvdXNcIixcblx0XCJkYXJrXCIsXG5cdFwiZGFya2VyXCIsXG5cdFwiZGFya2VzdFwiLFxuXHRcImRlYWRcIixcblx0XCJkZWFmXCIsXG5cdFwiZGVhclwiLFxuXHRcImRlYXJlclwiLFxuXHRcImRlYXJlc3RcIixcblx0XCJkZWNpbWFsXCIsXG5cdFwiZGVlcFwiLFxuXHRcImRlZXBlclwiLFxuXHRcImRlZXBlc3RcIixcblx0XCJkZWZlY3RpdmVcIixcblx0XCJkZWZpbml0ZVwiLFxuXHRcImRlbGljYXRlXCIsXG5cdFwiZGVudGFsXCIsXG5cdFwiZGVwZW5kZW50XCIsXG5cdFwiZGVzdHJ1Y3RpdmVcIixcblx0XCJkaWFnb25hbFwiLFxuXHRcImRpZmZlcmVudFwiLFxuXHRcImRpZmZpY3VsdFwiLFxuXHRcImRpZ2l0YWxcIixcblx0XCJkaW1cIixcblx0XCJkaXNlYXNlZFwiLFxuXHRcImRpc3RpbmN0XCIsXG5cdFwiZGl0dHlcIixcblx0XCJkb3JtYW50XCIsXG5cdFwiZG91YmxlXCIsXG5cdFwiZHJhZnR5XCIsXG5cdFwiZHJpZXJcIixcblx0XCJkcmllc3RcIixcblx0XCJkcm93c3lcIixcblx0XCJkcnlcIixcblx0XCJkdWFsXCIsXG5cdFwiZHVlXCIsXG5cdFwiZHVsbFwiLFxuXHRcImR1bWJcIixcblx0XCJkeW5hbWljXCIsXG5cdFwiZWFjaFwiLFxuXHRcImVhc3lcIixcblx0XCJlaWdodGhcIixcblx0XCJlaXRoZXJcIixcblx0XCJlbGFzdGljXCIsXG5cdFwiZWxlY3RyaWNcIixcblx0XCJlbGlnaWJsZVwiLFxuXHRcImVsc2VcIixcblx0XCJlbXB0eVwiLFxuXHRcImVub3VnaFwiLFxuXHRcImVudGlyZVwiLFxuXHRcImVxdWFsXCIsXG5cdFwiZXJlY3RcIixcblx0XCJlcnJhdGljXCIsXG5cdFwiZXNzZW50aWFsXCIsXG5cdFwiZXZlbnR1YWxcIixcblx0XCJldmVyeVwiLFxuXHRcImV2ZXJ5ZGF5XCIsXG5cdFwiZXZpZGVudFwiLFxuXHRcImV4YWN0XCIsXG5cdFwiZXhjZWxsZW50XCIsXG5cdFwiZXhjZXNzaXZlXCIsXG5cdFwiZXhjbHVzaXZlXCIsXG5cdFwiZXhwbG9zaXZlXCIsXG5cdFwiZXh0ZW5zaXZlXCIsXG5cdFwiZXh0ZXJuYWxcIixcblx0XCJleHRyYVwiLFxuXHRcImV4dHJlbWVcIixcblx0XCJleHRyaW5zaWNcIixcblx0XCJmYWludFwiLFxuXHRcImZhaXJcIixcblx0XCJmYWxzZVwiLFxuXHRcImZhbWlsaWFyXCIsXG5cdFwiZmFzdFwiLFxuXHRcImZhdFwiLFxuXHRcImZhdGFsXCIsXG5cdFwiZmF0dGVzdFwiLFxuXHRcImZhdWx0eVwiLFxuXHRcImZlYXNpYmxlXCIsXG5cdFwiZmVkZXJhbFwiLFxuXHRcImZlZWJsZVwiLFxuXHRcImZlcnRpbGVcIixcblx0XCJmZXdcIixcblx0XCJmaWZ0aFwiLFxuXHRcImZpbmFsXCIsXG5cdFwiZmluZVwiLFxuXHRcImZpcm1cIixcblx0XCJmaXJzdFwiLFxuXHRcImZpc2NhbFwiLFxuXHRcImZpdFwiLFxuXHRcImZsYW1tYWJsZVwiLFxuXHRcImZsYXRcIixcblx0XCJmbGV4aWJsZVwiLFxuXHRcImZvZ2d5XCIsXG5cdFwiZm9vbGlzaFwiLFxuXHRcImZvcmVpZ25cIixcblx0XCJmb3JtYWxcIixcblx0XCJmb3JtZXJcIixcblx0XCJmb3VydGhcIixcblx0XCJmcmVlXCIsXG5cdFwiZnJlcXVlbnRcIixcblx0XCJmcmVzaFwiLFxuXHRcImZ1bGxcIixcblx0XCJnYW1tYVwiLFxuXHRcImdlbmVyYWxcIixcblx0XCJnZW50bGVcIixcblx0XCJnb29kXCIsXG5cdFwiZ3JhZHVhbFwiLFxuXHRcImdyYW5kXCIsXG5cdFwiZ3JhcGhpY1wiLFxuXHRcImdyYXZlXCIsXG5cdFwiZ3JheVwiLFxuXHRcImdyZWF0XCIsXG5cdFwiZ3JlZW5cIixcblx0XCJncmlldm91c1wiLFxuXHRcImdyb2NlcnlcIixcblx0XCJoYXBweVwiLFxuXHRcImhhcmRcIixcblx0XCJoYXJtZnVsXCIsXG5cdFwiaGF6YXJkb3VzXCIsXG5cdFwiaGVhbHRoeVwiLFxuXHRcImhlYXZ5XCIsXG5cdFwiaGVscGZ1bFwiLFxuXHRcImhpZ2hcIixcblx0XCJoaWxseVwiLFxuXHRcImhpbmRcIixcblx0XCJob2xsb3dcIixcblx0XCJob3RcIixcblx0XCJodWdlXCIsXG5cdFwiaWN5XCIsXG5cdFwiaWRlbnRpY2FsXCIsXG5cdFwiaWRsZVwiLFxuXHRcImlsbFwiLFxuXHRcImltbWluZW50XCIsXG5cdFwiaW1wb3J0YW50XCIsXG5cdFwiaW1wcm9wZXJcIixcblx0XCJpbmJvYXJkXCIsXG5cdFwiaW5uZXJcIixcblx0XCJpbnN0YW50XCIsXG5cdFwiaW50ZW5zZVwiLFxuXHRcImludGVybmFsXCIsXG5cdFwiaW50cmluc2ljXCIsXG5cdFwiaXRlcmF0aXZlXCIsXG5cdFwiamV0XCIsXG5cdFwianVsaWFuXCIsXG5cdFwianVuaW9yXCIsXG5cdFwia2VlblwiLFxuXHRcImtlbHZpblwiLFxuXHRcImtpbmRcIixcblx0XCJrbm9iYmVkXCIsXG5cdFwibGFyZ2VcIixcblx0XCJsYXN0XCIsXG5cdFwibGF0ZVwiLFxuXHRcImxhd2Z1bFwiLFxuXHRcImxhenlcIixcblx0XCJsZWFreVwiLFxuXHRcImxlYW5cIixcblx0XCJsZWFzdFwiLFxuXHRcImxlZ2FsXCIsXG5cdFwibGVzc1wiLFxuXHRcImxldGhhbFwiLFxuXHRcImxldmVsXCIsXG5cdFwibGlrZWx5XCIsXG5cdFwibGluZWFyXCIsXG5cdFwibGlxdWlkXCIsXG5cdFwibGl0ZXJhbFwiLFxuXHRcImxpdHRsZVwiLFxuXHRcImxpdmVseVwiLFxuXHRcImxvY2FsXCIsXG5cdFwibG9uZVwiLFxuXHRcImxvbmdcIixcblx0XCJsb29zZVwiLFxuXHRcImxvdWRcIixcblx0XCJsb3dcIixcblx0XCJtYWduZXRpY1wiLFxuXHRcIm1haW5cIixcblx0XCJtYW55XCIsXG5cdFwibWFwbGVcIixcblx0XCJtYXJpbmVcIixcblx0XCJtYXJ0aWFsXCIsXG5cdFwibWVhblwiLFxuXHRcIm1lZGljYWxcIixcblx0XCJtZW50YWxcIixcblx0XCJtZXJlXCIsXG5cdFwibWV0YWxsaWNcIixcblx0XCJtaWRkbGVcIixcblx0XCJtaW5vclwiLFxuXHRcIm1pbnVzXCIsXG5cdFwibWlzdHlcIixcblx0XCJtbmVtb25pY1wiLFxuXHRcIm1vYmlsZVwiLFxuXHRcIm1vZGVyblwiLFxuXHRcIm1vZHVsYXJcIixcblx0XCJtb2x0ZW5cIixcblx0XCJtb3JhbFwiLFxuXHRcIm1vcmVcIixcblx0XCJtb3N0XCIsXG5cdFwibW92YWJsZVwiLFxuXHRcIm11ZGR5XCIsXG5cdFwibXVsdGlwbGVcIixcblx0XCJtdXR1YWxcIixcblx0XCJuYWtlZFwiLFxuXHRcIm5hcmNvdGljXCIsXG5cdFwibmFycm93XCIsXG5cdFwibmF0aW9uYWxcIixcblx0XCJuYXR1cmFsXCIsXG5cdFwibmF1dGljYWxcIixcblx0XCJuYXZhbFwiLFxuXHRcIm5lYXRcIixcblx0XCJuZWNlc3NhcnlcIixcblx0XCJuZWdhdGl2ZVwiLFxuXHRcIm5lcnZvdXNcIixcblx0XCJuZXV0cmFsXCIsXG5cdFwibmV3XCIsXG5cdFwibmV4dFwiLFxuXHRcIm5pY2VcIixcblx0XCJub2lzeVwiLFxuXHRcIm5vbWluYWxcIixcblx0XCJub3JtYWxcIixcblx0XCJudWNsZWFyXCIsXG5cdFwibnVtZXJpY1wiLFxuXHRcIm51bWVyaWNhbFwiLFxuXHRcIm51bWVyb3VzXCIsXG5cdFwib2Jzb2xldGVcIixcblx0XCJvYnZpb3VzXCIsXG5cdFwib2RkXCIsXG5cdFwib2ZmbGluZVwiLFxuXHRcIm9rYXlcIixcblx0XCJvbGRcIixcblx0XCJvbmxpbmVcIixcblx0XCJvcGVuXCIsXG5cdFwib3B0aW11bVwiLFxuXHRcIm9wdGlvbmFsXCIsXG5cdFwib3JhbFwiLFxuXHRcIm9yZGluYXJ5XCIsXG5cdFwib3JpZ2luYWxcIixcblx0XCJvdGhlclwiLFxuXHRcIm91dGJvYXJkXCIsXG5cdFwib3V0ZXJcIixcblx0XCJvdXRzaWRlXCIsXG5cdFwib3V0d2FyZFwiLFxuXHRcIm92ZXJoZWFkXCIsXG5cdFwib3ZlcnNpemVcIixcblx0XCJvd25cIixcblx0XCJwYWxlXCIsXG5cdFwicGFsZXJcIixcblx0XCJwYWxlc3RcIixcblx0XCJwYXJhbGxlbFwiLFxuXHRcInBhcnRpYWxcIixcblx0XCJwYXNzaXZlXCIsXG5cdFwicGFzdFwiLFxuXHRcInBlY3VsaWFyXCIsXG5cdFwicGVyaW9kaWNcIixcblx0XCJwZXJtYW5lbnRcIixcblx0XCJwZXJzb25hbFwiLFxuXHRcInBldHR5XCIsXG5cdFwicGhvbmV0aWNcIixcblx0XCJwaHlzaWNhbFwiLFxuXHRcInBsYWluXCIsXG5cdFwicGxhbmFyXCIsXG5cdFwicGxlbnR5XCIsXG5cdFwicG9pc29ub3VzXCIsXG5cdFwicG9saXRlXCIsXG5cdFwicG9saXRpY2FsXCIsXG5cdFwicG9vclwiLFxuXHRcInBvcnRhYmxlXCIsXG5cdFwicG9zaXRpdmVcIixcblx0XCJwb3NzaWJsZVwiLFxuXHRcInBvdGVudGlhbFwiLFxuXHRcInBvd2VyZnVsXCIsXG5cdFwicHJhY3RpY2FsXCIsXG5cdFwicHJlY2lzZVwiLFxuXHRcInByZXR0eVwiLFxuXHRcInByZXZpb3VzXCIsXG5cdFwicHJpbWFyeVwiLFxuXHRcInByaW9yXCIsXG5cdFwicHJpdmF0ZVwiLFxuXHRcInByb2JhYmxlXCIsXG5cdFwicHJvbXB0XCIsXG5cdFwicHJvcGVyXCIsXG5cdFwicHJvdGVjdGl2ZVwiLFxuXHRcInByb3hpbWF0ZVwiLFxuXHRcInB1bml0aXZlXCIsXG5cdFwicHVyZVwiLFxuXHRcInB1cnBsZVwiLFxuXHRcInF1aWNrXCIsXG5cdFwicXVpZXRcIixcblx0XCJyYW5kb21cIixcblx0XCJyYXBpZFwiLFxuXHRcInJhd1wiLFxuXHRcInJlYWR5XCIsXG5cdFwicmVhbFwiLFxuXHRcInJlZFwiLFxuXHRcInJlZ2lvbmFsXCIsXG5cdFwicmVndWxhclwiLFxuXHRcInJlbGF0aXZlXCIsXG5cdFwicmVsaWFibGVcIixcblx0XCJyZW1vdGVcIixcblx0XCJyZW1vdmFibGVcIixcblx0XCJyZXNwb25zaWJsZVwiLFxuXHRcInJldGFpbFwiLFxuXHRcInJldXNhYmxlXCIsXG5cdFwicmljaFwiLFxuXHRcInJpY2hlclwiLFxuXHRcInJpY2hlc3RcIixcblx0XCJyaWdodFwiLFxuXHRcInJpZ2lkXCIsXG5cdFwicmlwZVwiLFxuXHRcInJvdWdoXCIsXG5cdFwic2FkXCIsXG5cdFwic2FkZGVyXCIsXG5cdFwic2FkZGVzdFwiLFxuXHRcInNhZmVcIixcblx0XCJzYWZlclwiLFxuXHRcInNhZmVzdFwiLFxuXHRcInNhbWVcIixcblx0XCJzZWNvbmRhcnlcIixcblx0XCJzZWN1cmVcIixcblx0XCJzZW5pb3JcIixcblx0XCJzZW5zaXRpdmVcIixcblx0XCJzZXBhcmF0ZVwiLFxuXHRcInNlcmlvdXNcIixcblx0XCJzZXZlbnRoXCIsXG5cdFwic2V2ZXJhbFwiLFxuXHRcInNldmVyZVwiLFxuXHRcInNoYWR5XCIsXG5cdFwic2hhbGxvd1wiLFxuXHRcInNoYXJwXCIsXG5cdFwic2h5XCIsXG5cdFwic2hpbnlcIixcblx0XCJzaG9ydFwiLFxuXHRcInNpY2tcIixcblx0XCJzaWxlbnRcIixcblx0XCJzaW1pbGFyXCIsXG5cdFwic2ltcGxlXCIsXG5cdFwic2luZ2xlXCIsXG5cdFwic2l4dGhcIixcblx0XCJzbGFja1wiLFxuXHRcInNsaWdodFwiLFxuXHRcInNsaXBwZXJ5XCIsXG5cdFwic2xvd2VyXCIsXG5cdFwic2xvd2VzdFwiLFxuXHRcInNtYWxsXCIsXG5cdFwic21hcnRcIixcblx0XCJzbW9vdGhcIixcblx0XCJzbnVnXCIsXG5cdFwic29jaWFsXCIsXG5cdFwic29mdFwiLFxuXHRcInNvbGFyXCIsXG5cdFwic29saWRcIixcblx0XCJzb21lXCIsXG5cdFwic291clwiLFxuXHRcInNwZWNpYWxcIixcblx0XCJzcGVjaWZpY1wiLFxuXHRcInN0YWJsZVwiLFxuXHRcInN0YXRpY1wiLFxuXHRcInN0ZWFkeVwiLFxuXHRcInN0ZWVwXCIsXG5cdFwic3RlcmlsZVwiLFxuXHRcInN0aWNreVwiLFxuXHRcInN0aWZmXCIsXG5cdFwic3RpbGxcIixcblx0XCJzdHJhaWdodFwiLFxuXHRcInN0cmFuZ2VcIixcblx0XCJzdHJpY3RcIixcblx0XCJzdHJvbmdcIixcblx0XCJzdWNoXCIsXG5cdFwic3VkZGVuXCIsXG5cdFwic3VpdGFibGVcIixcblx0XCJzdW5ueVwiLFxuXHRcInN1cGVyaW9yXCIsXG5cdFwic3VyZVwiLFxuXHRcInN3ZWV0XCIsXG5cdFwic3dpZnRcIixcblx0XCJzd29sbGVuXCIsXG5cdFwic3ltYm9saWNcIixcblx0XCJzeW50aGV0aWNcIixcblx0XCJ0YWN0aWNhbFwiLFxuXHRcInRhbGxcIixcblx0XCJ0YXV0XCIsXG5cdFwidGVjaG5pY2FsXCIsXG5cdFwidGVtcG9yYXJ5XCIsXG5cdFwidGVudGF0aXZlXCIsXG5cdFwidGVybWluYWxcIixcblx0XCJ0aGVybWFsXCIsXG5cdFwidGhpY2tcIixcblx0XCJ0aGluXCIsXG5cdFwidGhpcmRcIixcblx0XCJ0aGlyc3R5XCIsXG5cdFwidGlnaHRcIixcblx0XCJ0aW55XCIsXG5cdFwidG94aWNcIixcblx0XCJ0cm9waWNhbFwiLFxuXHRcInRydWVcIixcblx0XCJ0dXJidWxlbnRcIixcblx0XCJ0eXBpY2FsXCIsXG5cdFwidW5pcXVlXCIsXG5cdFwidXBwZXJcIixcblx0XCJ1cmdlbnRcIixcblx0XCJ1c2VhYmxlXCIsXG5cdFwidXNlZnVsXCIsXG5cdFwidXN1YWxcIixcblx0XCJ2YWxpZFwiLFxuXHRcInZhbHVhYmxlXCIsXG5cdFwidmFyaW91c1wiLFxuXHRcInZlcnRpY2FsXCIsXG5cdFwidmlhYmxlXCIsXG5cdFwidmlvbGVudFwiLFxuXHRcInZpcnR1YWxcIixcblx0XCJ2aXNpYmxlXCIsXG5cdFwidmlzdWFsXCIsXG5cdFwidml0YWxcIixcblx0XCJ2b2lkXCIsXG5cdFwidm9sYXRpbGVcIixcblx0XCJ3YW50b25cIixcblx0XCJ3YXJtXCIsXG5cdFwid2Vha1wiLFxuXHRcIndlYXJ5XCIsXG5cdFwid2V0XCIsXG5cdFwid2hpdGVcIixcblx0XCJ3aG9sZVwiLFxuXHRcIndpZGVcIixcblx0XCJ3aXNlXCIsXG5cdFwid29vZGVuXCIsXG5cdFwid29vbGVuXCIsXG5cdFwid29yc2VcIixcblx0XCJ3b3JzdFwiLFxuXHRcIndyb25nXCIsXG5cdFwieWVsbG93XCIsXG5cdFwieW91bmdcIixcblx0XCJoYXJtbGVzc1wiLFxuXHRcImluYWN0aXZlXCIsXG5cdFwiaW5jb3JyZWN0XCIsXG5cdFwiaW5kaXJlY3RcIixcblx0XCJpbnZhbGlkXCIsXG5cdFwidW5hYmxlXCIsXG5cdFwidW5rbm93blwiLFxuXHRcInVubWF0ZWRcIixcblx0XCJ1bnNhZmVcIixcblx0XCJ1bnNpZ25lZFwiLFxuXHRcInVudXNlZFwiLFxuXHRcInVudXN1YWxcIixcblx0XCJ1bndhbnRlZFwiLFxuXHRcInVzZWxlc3NcIixcblx0XCJhZ2VkXCIsXG5cdFwiZXRjaGVkXCIsXG5cdFwiZmluaXNoZWRcIixcblx0XCJnaXZlblwiLFxuXHRcImxlZnRcIixcblx0XCJsb3N0XCIsXG5cdFwibWlzdGFrZW5cIixcblx0XCJwcm92ZW5cIixcblx0XCJcIl07XG5cblxudmFyIHR4dF9ub3Vucz1bXG5cdFwiYWJyYXNpdmVcIixcblx0XCJhYnVzZXJcIixcblx0XCJhY2NpZGVudFwiLFxuXHRcImFjaWRcIixcblx0XCJhY3JlXCIsXG5cdFwiYWNyb255bVwiLFxuXHRcImFjdFwiLFxuXHRcImFkZHJlc3NcIixcblx0XCJhZG1pcmFsXCIsXG5cdFwiYWR2ZXJiXCIsXG5cdFwiYWR2aXNlclwiLFxuXHRcImFmZmFpclwiLFxuXHRcImFnZW50XCIsXG5cdFwiYWlkXCIsXG5cdFwiYWltXCIsXG5cdFwiYWlyXCIsXG5cdFwiYWlycGxhbmVcIixcblx0XCJhaXJwb3J0XCIsXG5cdFwiYWlyc2hpcFwiLFxuXHRcImFsYXJtXCIsXG5cdFwiYWxjb2hvbGljXCIsXG5cdFwiYWxnZWJyYVwiLFxuXHRcImFsaWFzXCIsXG5cdFwiYWxpYmlcIixcblx0XCJhbGxleVwiLFxuXHRcImFsbG95XCIsXG5cdFwiYW5hbG9nXCIsXG5cdFwiYW5hbHlzdFwiLFxuXHRcImFuY2hvclwiLFxuXHRcImFuZ2xlXCIsXG5cdFwiYW5pbWFsXCIsXG5cdFwiYW50aGVtXCIsXG5cdFwiYXBwbGVcIixcblx0XCJhcHJpbFwiLFxuXHRcImFwcm9uXCIsXG5cdFwiYXJjXCIsXG5cdFwiYXJjaFwiLFxuXHRcImFyZWFcIixcblx0XCJhcm1cIixcblx0XCJhcm15XCIsXG5cdFwiYXJyYXlcIixcblx0XCJhcnJlc3RcIixcblx0XCJhcnJvd1wiLFxuXHRcImF0b21cIixcblx0XCJhdHRhY2tcIixcblx0XCJheFwiLFxuXHRcImF4aXNcIixcblx0XCJiYWJ5XCIsXG5cdFwiYmFja1wiLFxuXHRcImJhZ1wiLFxuXHRcImJhbGxcIixcblx0XCJiYWxsb29uXCIsXG5cdFwiYmFuZFwiLFxuXHRcImJhbmdcIixcblx0XCJiYXJcIixcblx0XCJiYXJnZVwiLFxuXHRcImJhcnJlbFwiLFxuXHRcImJhc2VcIixcblx0XCJiYXNpblwiLFxuXHRcImJhc2tldFwiLFxuXHRcImJhdFwiLFxuXHRcImJhdGNoXCIsXG5cdFwiYmF0aFwiLFxuXHRcImJhdGhlclwiLFxuXHRcImJhdHRlcnlcIixcblx0XCJiYXlcIixcblx0XCJiZWFjaFwiLFxuXHRcImJlYWNvblwiLFxuXHRcImJlYWRcIixcblx0XCJiZWFtXCIsXG5cdFwiYmVhblwiLFxuXHRcImJlYXJcIixcblx0XCJiZWF0XCIsXG5cdFwiYmVkXCIsXG5cdFwiYmVpbmdcIixcblx0XCJiZW5kXCIsXG5cdFwiYmVycnlcIixcblx0XCJiaWdhbXlcIixcblx0XCJibGFkZVwiLFxuXHRcImJsYW5rXCIsXG5cdFwiYmxhbmtldFwiLFxuXHRcImJsYXN0XCIsXG5cdFwiYmxhc3RzXCIsXG5cdFwiYmxvY2tcIixcblx0XCJibG9vZFwiLFxuXHRcImJsb3RcIixcblx0XCJibG93XCIsXG5cdFwiYmxvd2VyXCIsXG5cdFwiYm9hdFwiLFxuXHRcImJvZHlcIixcblx0XCJib2lsXCIsXG5cdFwiYm9sdFwiLFxuXHRcImJvbmVcIixcblx0XCJib29rXCIsXG5cdFwiYm9vdFwiLFxuXHRcImJvcmVcIixcblx0XCJib3R0bGVcIixcblx0XCJib3R0b21cIixcblx0XCJib3hcIixcblx0XCJib3lcIixcblx0XCJicmFpblwiLFxuXHRcImJyZWFkXCIsXG5cdFwiYnJlYXN0XCIsXG5cdFwiYnJpY2tcIixcblx0XCJicm9vbVwiLFxuXHRcImJ1YmJsZVwiLFxuXHRcImJ1Y2tldFwiLFxuXHRcImJ1aWxkZXJcIixcblx0XCJidWxsZXRcIixcblx0XCJidW1wXCIsXG5cdFwiYnVzXCIsXG5cdFwiYnVzaFwiLFxuXHRcImJ1dHRcIixcblx0XCJidXR0ZXJcIixcblx0XCJidXR0b25cIixcblx0XCJieXRlXCIsXG5cdFwiY2FiXCIsXG5cdFwiY2FrZVwiLFxuXHRcImNhbXBcIixcblx0XCJjYW5ub25cIixcblx0XCJjYXBcIixcblx0XCJjYXB0YWluXCIsXG5cdFwiY2FycGV0XCIsXG5cdFwiY2F1c2VcIixcblx0XCJjYXZlXCIsXG5cdFwiY2VsbFwiLFxuXHRcImNlbGxhclwiLFxuXHRcImNoYWlyXCIsXG5cdFwiY2hhbGtcIixcblx0XCJjaGVhdFwiLFxuXHRcImNoZWVrXCIsXG5cdFwiY2hlZXNlXCIsXG5cdFwiY2hpZWZcIixcblx0XCJjaGlsZFwiLFxuXHRcImNoaW1uZXlcIixcblx0XCJjaHVyY2hcIixcblx0XCJjaXJjbGVcIixcblx0XCJjaXRpemVuXCIsXG5cdFwiY2l2aWxpYW5cIixcblx0XCJjbGFtcFwiLFxuXHRcImNsYXdcIixcblx0XCJjbGVya1wiLFxuXHRcImNsb2NrXCIsXG5cdFwiY2xvdWRcIixcblx0XCJjbHViXCIsXG5cdFwiY2x1bXBcIixcblx0XCJjb2FsXCIsXG5cdFwiY29hdFwiLFxuXHRcImNvZGVyXCIsXG5cdFwiY29sb25cIixcblx0XCJjb21iXCIsXG5cdFwiY29tbWFcIixcblx0XCJjb21wdXRlclwiLFxuXHRcImNvbmVcIixcblx0XCJjb25zb2xlXCIsXG5cdFwiY29udHJvbFwiLFxuXHRcImNvcHlcIixcblx0XCJjb3JkXCIsXG5cdFwiY29yZVwiLFxuXHRcImNvcmtcIixcblx0XCJjb3JuZXJcIixcblx0XCJjb3VnaFwiLFxuXHRcImNvdW50XCIsXG5cdFwiY3JhY2tcIixcblx0XCJjcmFkbGVcIixcblx0XCJjcmFmdFwiLFxuXHRcImNyYW1wXCIsXG5cdFwiY3Jhc2hcIixcblx0XCJjcmF3bFwiLFxuXHRcImNydXN0XCIsXG5cdFwiY3ViZVwiLFxuXHRcImN1cFwiLFxuXHRcImN1cmVcIixcblx0XCJjdXJsXCIsXG5cdFwiZGFtXCIsXG5cdFwiZGF0YVwiLFxuXHRcImRhdGVcIixcblx0XCJkZWFsZXJcIixcblx0XCJkZWF0aFwiLFxuXHRcImRlYnJpc1wiLFxuXHRcImRlYnRcIixcblx0XCJkZWNheVwiLFxuXHRcImRlY2VtYmVyXCIsXG5cdFwiZGVja1wiLFxuXHRcImRlY29kZXJcIixcblx0XCJkZWZhdWx0XCIsXG5cdFwiZGVmZWN0XCIsXG5cdFwiZGVsaWdodFwiLFxuXHRcImRlbnRcIixcblx0XCJkZXNlcnRcIixcblx0XCJkZXNpcmVcIixcblx0XCJkZXNrXCIsXG5cdFwiZGV2aWNlXCIsXG5cdFwiZGlvZGVcIixcblx0XCJkaXJ0XCIsXG5cdFwiZGlzZWFzZVwiLFxuXHRcImRpc2d1c3RcIixcblx0XCJkaXNoXCIsXG5cdFwiZGlza1wiLFxuXHRcImRpdGNoXCIsXG5cdFwiZGl0Y2hlc1wiLFxuXHRcImRpdmVyXCIsXG5cdFwiZGl2aWRlclwiLFxuXHRcImRvbGx5XCIsXG5cdFwiZG9wZVwiLFxuXHRcImRvc2VcIixcblx0XCJkcmFnXCIsXG5cdFwiZHJlc3NcIixcblx0XCJkcnVnXCIsXG5cdFwiZHVtcFwiLFxuXHRcImVhclwiLFxuXHRcImVkZ2VcIixcblx0XCJlZ2dcIixcblx0XCJlbGJvd1wiLFxuXHRcImVsZWN0cm9uXCIsXG5cdFwiZWxldmVuXCIsXG5cdFwiZW5kXCIsXG5cdFwiZW5lbXlcIixcblx0XCJlcnJvclwiLFxuXHRcImV4aXRcIixcblx0XCJleHBlcnRcIixcblx0XCJmYWNlXCIsXG5cdFwiZmFjdG9yeVwiLFxuXHRcImZha2VcIixcblx0XCJmYWxsXCIsXG5cdFwiZmFtaWx5XCIsXG5cdFwiZmFuXCIsXG5cdFwiZmFybVwiLFxuXHRcImZhdGhlclwiLFxuXHRcImZlYXJcIixcblx0XCJmZWF0aGVyXCIsXG5cdFwiZmVlZGVyXCIsXG5cdFwiZmVldFwiLFxuXHRcImZpZWxkXCIsXG5cdFwiZmlnaHRlclwiLFxuXHRcImZpbGVcIixcblx0XCJmaWx0ZXJcIixcblx0XCJmaW5nZXJcIixcblx0XCJmaXNoXCIsXG5cdFwiZmlzdFwiLFxuXHRcImZsYWtlXCIsXG5cdFwiZmxhcFwiLFxuXHRcImZsYXNoXCIsXG5cdFwiZmxvb2RcIixcblx0XCJmbG9vclwiLFxuXHRcImZsdXNoXCIsXG5cdFwiZm9hbVwiLFxuXHRcImZvZ1wiLFxuXHRcImZvbGRcIixcblx0XCJmb29kXCIsXG5cdFwiZm9vdFwiLFxuXHRcImZvcmNlXCIsXG5cdFwiZm9yZXN0XCIsXG5cdFwiZm9ya1wiLFxuXHRcImZvcm1cIixcblx0XCJmb3J0XCIsXG5cdFwiZnJpY3Rpb25cIixcblx0XCJmcmlkYXlcIixcblx0XCJmcmllbmRcIixcblx0XCJmcm9udFwiLFxuXHRcImZyb3N0XCIsXG5cdFwiZnJ1aXRcIixcblx0XCJmdXJcIixcblx0XCJnYW1lXCIsXG5cdFwiZ2FuZ1wiLFxuXHRcImdhcFwiLFxuXHRcImdhcmFnZVwiLFxuXHRcImdhcmRlblwiLFxuXHRcImdhc1wiLFxuXHRcImdhdGVcIixcblx0XCJnZWFyXCIsXG5cdFwiZ2VuZVwiLFxuXHRcImdpYW50XCIsXG5cdFwiZ2lybFwiLFxuXHRcImdsYW5kXCIsXG5cdFwiZ2xhc3NcIixcblx0XCJnbGF6ZVwiLFxuXHRcImdsZWFtXCIsXG5cdFwiZ2xpZGVcIixcblx0XCJnbG92ZVwiLFxuXHRcImdsb3dcIixcblx0XCJnbHVlXCIsXG5cdFwiZ29hbFwiLFxuXHRcImdyYWRlXCIsXG5cdFwiZ3JhcGhcIixcblx0XCJncmFzc1wiLFxuXHRcImdyZWFzZVwiLFxuXHRcImdyaWRcIixcblx0XCJncmlwXCIsXG5cdFwiZ3JvYW5cIixcblx0XCJncm9zc1wiLFxuXHRcImdyb3d0aFwiLFxuXHRcImd1YXJkXCIsXG5cdFwiZ3Vlc3RcIixcblx0XCJndWlkZVwiLFxuXHRcImd1bVwiLFxuXHRcImd1blwiLFxuXHRcImd1eVwiLFxuXHRcImhhYml0XCIsXG5cdFwiaGFpbFwiLFxuXHRcImhhaXJcIixcblx0XCJoYWxmXCIsXG5cdFwiaGFsbFwiLFxuXHRcImhhbW1lclwiLFxuXHRcImhhbmRcIixcblx0XCJoYW5kbGVcIixcblx0XCJoYW5nYXJcIixcblx0XCJoYXJib3JcIixcblx0XCJoYXJkd2FyZVwiLFxuXHRcImhhcm1cIixcblx0XCJoYXJwb29uXCIsXG5cdFwiaGFzdGVcIixcblx0XCJoYXRcIixcblx0XCJoYXRjaFwiLFxuXHRcImhhdGVcIixcblx0XCJoYXphcmRcIixcblx0XCJoZWFkXCIsXG5cdFwiaGVhcFwiLFxuXHRcImhlYXJ0XCIsXG5cdFwiaGVhdFwiLFxuXHRcImhlYXRlclwiLFxuXHRcImhlZWxcIixcblx0XCJoZWVsc1wiLFxuXHRcImhlaWdodFwiLFxuXHRcImhlbGxvXCIsXG5cdFwiaGVsbVwiLFxuXHRcImhlbG1ldFwiLFxuXHRcImhlbHBcIixcblx0XCJoZW1cIixcblx0XCJoZXJlXCIsXG5cdFwiaGVydHpcIixcblx0XCJoaWxsXCIsXG5cdFwiaGludFwiLFxuXHRcImhpcFwiLFxuXHRcImhpc3NcIixcblx0XCJob2xkXCIsXG5cdFwiaG9sZVwiLFxuXHRcImhvbWVcIixcblx0XCJob25rXCIsXG5cdFwiaG9vZFwiLFxuXHRcImhvb2ZcIixcblx0XCJob29rXCIsXG5cdFwiaG9vcFwiLFxuXHRcImhvcm5cIixcblx0XCJob3NlXCIsXG5cdFwiaG90ZWxcIixcblx0XCJob3VyXCIsXG5cdFwiaG91c2VcIixcblx0XCJob3dsXCIsXG5cdFwiaHViXCIsXG5cdFwiaHVnXCIsXG5cdFwiaHVsbFwiLFxuXHRcImh1bVwiLFxuXHRcImh1bWFuXCIsXG5cdFwiaHVtb3JcIixcblx0XCJodW1wXCIsXG5cdFwiaHVuZHJlZFwiLFxuXHRcImh1bmtcIixcblx0XCJodW50XCIsXG5cdFwiaHVzaFwiLFxuXHRcImh1dFwiLFxuXHRcImljZVwiLFxuXHRcImljaW5nXCIsXG5cdFwiaWRlYVwiLFxuXHRcImlkZWFsXCIsXG5cdFwiaW1hZ2VcIixcblx0XCJpbXBhY3RcIixcblx0XCJpbXB1bHNlXCIsXG5cdFwiaW5jaFwiLFxuXHRcImluanVyeVwiLFxuXHRcImlua1wiLFxuXHRcImlubGV0XCIsXG5cdFwiaW5sZXRzXCIsXG5cdFwiaW5wdXRcIixcblx0XCJpbnF1aXJ5XCIsXG5cdFwiaW5zYW5pdHlcIixcblx0XCJpbnNpZ25pYVwiLFxuXHRcImludGFrZVwiLFxuXHRcImludGFrZXNcIixcblx0XCJpbnRlZ2VyXCIsXG5cdFwiaW50ZWdyaXR5XCIsXG5cdFwiaW50ZW50XCIsXG5cdFwiaW50ZW50c1wiLFxuXHRcImludGVyY29tXCIsXG5cdFwiaW50ZXJlc3RcIixcblx0XCJpbnRlcmZhY2VcIixcblx0XCJpbnRlcmlvclwiLFxuXHRcImludGVydmFsXCIsXG5cdFwiaW50ZXJ2aWV3XCIsXG5cdFwiaW52ZW50aW9uXCIsXG5cdFwiaW52b2ljZVwiLFxuXHRcImlyb25cIixcblx0XCJpc2xhbmRcIixcblx0XCJpc3N1ZVwiLFxuXHRcIml0ZW1cIixcblx0XCJpdm9yeVwiLFxuXHRcImphY2tcIixcblx0XCJqYWlsXCIsXG5cdFwiamFtXCIsXG5cdFwiamFyXCIsXG5cdFwiamF3XCIsXG5cdFwiamVsbHlcIixcblx0XCJqZXdlbFwiLFxuXHRcImppZ1wiLFxuXHRcImpvYlwiLFxuXHRcImpvaW50XCIsXG5cdFwianVkZ2VcIixcblx0XCJqdWdcIixcblx0XCJqdWx5XCIsXG5cdFwianVtcFwiLFxuXHRcImp1bmVcIixcblx0XCJqdW5rXCIsXG5cdFwianVyeVwiLFxuXHRcImp1c3RpY2VcIixcblx0XCJrZWVsXCIsXG5cdFwia2V0dGxlXCIsXG5cdFwia2V5XCIsXG5cdFwia2V5Ym9hcmRcIixcblx0XCJrZXl3b3JkXCIsXG5cdFwia2lja1wiLFxuXHRcImtpbGxcIixcblx0XCJraXNzXCIsXG5cdFwia2l0XCIsXG5cdFwia2l0ZVwiLFxuXHRcImtuZWVcIixcblx0XCJrbmlmZVwiLFxuXHRcImtub2JcIixcblx0XCJrbm9ja1wiLFxuXHRcImtub3RcIixcblx0XCJsYWJlbFwiLFxuXHRcImxhYm9yXCIsXG5cdFwibGFjZVwiLFxuXHRcImxhY2tcIixcblx0XCJsYWRkZXJcIixcblx0XCJsYWtlXCIsXG5cdFwibGFtcFwiLFxuXHRcImxhbmRcIixcblx0XCJsYW5lXCIsXG5cdFwibGFudGVyblwiLFxuXHRcImxhcFwiLFxuXHRcImxhcHNlXCIsXG5cdFwibGFyZFwiLFxuXHRcImxhc2VyXCIsXG5cdFwibGFzaFwiLFxuXHRcImxhdGNoXCIsXG5cdFwibGF1Z2hcIixcblx0XCJsYXVuY2hcIixcblx0XCJsYXVuZHJ5XCIsXG5cdFwibGF3XCIsXG5cdFwibGF5ZXJcIixcblx0XCJsZWFkXCIsXG5cdFwibGVhZGVyXCIsXG5cdFwibGVhZlwiLFxuXHRcImxlYWtcIixcblx0XCJsZWFrYWdlXCIsXG5cdFwibGVhcFwiLFxuXHRcImxlYXBlclwiLFxuXHRcImxlYXRoZXJcIixcblx0XCJsZWF2ZVwiLFxuXHRcImxlZ1wiLFxuXHRcImxlZ2VuZFwiLFxuXHRcImxlbmd0aFwiLFxuXHRcImxlc3NvblwiLFxuXHRcImxldHRlclwiLFxuXHRcImxpYmVydHlcIixcblx0XCJsaWJyYXJ5XCIsXG5cdFwibGlja1wiLFxuXHRcImxpZFwiLFxuXHRcImxpZmVcIixcblx0XCJsaWZ0XCIsXG5cdFwibGlnaHRcIixcblx0XCJsaW1iXCIsXG5cdFwibGltZVwiLFxuXHRcImxpbWl0XCIsXG5cdFwibGltcFwiLFxuXHRcImxpbmVcIixcblx0XCJsaW5lblwiLFxuXHRcImxpbmtcIixcblx0XCJsaW50XCIsXG5cdFwibGlwXCIsXG5cdFwibGlxdW9yXCIsXG5cdFwibGlzdFwiLFxuXHRcImxpdGVyXCIsXG5cdFwibGl0cmVcIixcblx0XCJsaXZlclwiLFxuXHRcImxvYWRcIixcblx0XCJsb2FmXCIsXG5cdFwibG9hblwiLFxuXHRcImxvY2tcIixcblx0XCJsb2NrZXJcIixcblx0XCJsb2dcIixcblx0XCJsb2dpY1wiLFxuXHRcImxvb2tcIixcblx0XCJsb29wXCIsXG5cdFwibG9zc1wiLFxuXHRcImxvdFwiLFxuXHRcImxvdmVcIixcblx0XCJsdW1iZXJcIixcblx0XCJsdW1wXCIsXG5cdFwibHVuZ1wiLFxuXHRcIm1hY2hpbmVcIixcblx0XCJtYWduZXRcIixcblx0XCJtYWlsXCIsXG5cdFwibWFqb3JcIixcblx0XCJtYWtlXCIsXG5cdFwibWFsZVwiLFxuXHRcIm1hblwiLFxuXHRcIm1hcFwiLFxuXHRcIm1hcmJsZVwiLFxuXHRcIm1hcmNoXCIsXG5cdFwibWFyZ2luXCIsXG5cdFwibWFya1wiLFxuXHRcIm1hcmtldFwiLFxuXHRcIm1hc2tcIixcblx0XCJtYXNzXCIsXG5cdFwibWFzdFwiLFxuXHRcIm1hc3RlclwiLFxuXHRcIm1hdFwiLFxuXHRcIm1hdGNoXCIsXG5cdFwibWF0ZVwiLFxuXHRcIm1hdGVyaWFsXCIsXG5cdFwibWF0aFwiLFxuXHRcIm1lYWxcIixcblx0XCJtZWF0XCIsXG5cdFwibWVkYWxcIixcblx0XCJtZWRpdW1cIixcblx0XCJtZWV0XCIsXG5cdFwibWVtYmVyXCIsXG5cdFwibWVtb3J5XCIsXG5cdFwibWVuXCIsXG5cdFwibWVudGlvblwiLFxuXHRcIm1lbnRpb25zXCIsXG5cdFwibWVudVwiLFxuXHRcIm1lbnVzXCIsXG5cdFwibWVzc1wiLFxuXHRcIm1ldGFsXCIsXG5cdFwibWV0ZXJcIixcblx0XCJtZXRob2RcIixcblx0XCJtaWxlXCIsXG5cdFwibWlsa1wiLFxuXHRcIm1pbGxcIixcblx0XCJtaW5kXCIsXG5cdFwibWluZVwiLFxuXHRcIm1pbnRcIixcblx0XCJtaXJyb3JcIixcblx0XCJtaXNmaXRcIixcblx0XCJtaXNzXCIsXG5cdFwibWlzc2lvblwiLFxuXHRcIm1pc3RcIixcblx0XCJtaXR0XCIsXG5cdFwibWl0dGVuXCIsXG5cdFwibWl4XCIsXG5cdFwibW9kZVwiLFxuXHRcIm1vZGVsXCIsXG5cdFwibW9kZW1cIixcblx0XCJtb2R1bGVcIixcblx0XCJtb21lbnRcIixcblx0XCJtb25kYXlcIixcblx0XCJtb25leVwiLFxuXHRcIm1vbml0b3JcIixcblx0XCJtb29uXCIsXG5cdFwibW9vbmxpZ2h0XCIsXG5cdFwibW9wXCIsXG5cdFwibW9zc1wiLFxuXHRcIm1vdGVsXCIsXG5cdFwibW90aGVyXCIsXG5cdFwibW90aW9uXCIsXG5cdFwibW90b3JcIixcblx0XCJtb3VudFwiLFxuXHRcIm1vdXRoXCIsXG5cdFwibW92ZVwiLFxuXHRcIm1vdmVyXCIsXG5cdFwibXVjaFwiLFxuXHRcIm11ZFwiLFxuXHRcIm11Z1wiLFxuXHRcIm11bGVcIixcblx0XCJtdXNjbGVcIixcblx0XCJtdXNpY1wiLFxuXHRcIm11c3RhcmRcIixcblx0XCJuYWlsXCIsXG5cdFwibmFtZVwiLFxuXHRcIm5hdGlvblwiLFxuXHRcIm5hdHVyZVwiLFxuXHRcIm5hdXNlYVwiLFxuXHRcIm5hdnlcIixcblx0XCJuZWNrXCIsXG5cdFwibmVlZFwiLFxuXHRcIm5lZWRsZVwiLFxuXHRcIm5lZ2xlY3RcIixcblx0XCJuZXJ2ZVwiLFxuXHRcIm5lc3RcIixcblx0XCJuZXRcIixcblx0XCJuZXV0cm9uXCIsXG5cdFwibmlja2VsXCIsXG5cdFwibmlnaHRcIixcblx0XCJub2RcIixcblx0XCJub2lzZVwiLFxuXHRcIm5vb25cIixcblx0XCJub3J0aFwiLFxuXHRcIm5vc2VcIixcblx0XCJub3RhdGlvblwiLFxuXHRcIm5vdGVcIixcblx0XCJub3RpY2VcIixcblx0XCJub3VuXCIsXG5cdFwibm96emxlXCIsXG5cdFwibnVsbFwiLFxuXHRcIm51bWJlclwiLFxuXHRcIm51bWVyYWxcIixcblx0XCJudXJzZVwiLFxuXHRcIm51dFwiLFxuXHRcIm55bG9uXCIsXG5cdFwib2FrXCIsXG5cdFwib2FyXCIsXG5cdFwib2JqZWN0XCIsXG5cdFwib2NlYW5cIixcblx0XCJvZG9yXCIsXG5cdFwib2RvcnNcIixcblx0XCJvZmZlclwiLFxuXHRcIm9mZmljZXJcIixcblx0XCJvaG1cIixcblx0XCJvaWxcIixcblx0XCJvcGVyYW5kXCIsXG5cdFwib3BpbmlvblwiLFxuXHRcIm9wdGlvblwiLFxuXHRcIm9yYW5nZVwiLFxuXHRcIm9yZGVyXCIsXG5cdFwib3JlXCIsXG5cdFwib3JnYW5cIixcblx0XCJvcmlmaWNlXCIsXG5cdFwib3JpZ2luXCIsXG5cdFwib3JuYW1lbnRcIixcblx0XCJvdW5jZVwiLFxuXHRcIm91bmNlc1wiLFxuXHRcIm91dGZpdFwiLFxuXHRcIm91dGluZ1wiLFxuXHRcIm91dGxldFwiLFxuXHRcIm91dGxpbmVcIixcblx0XCJvdXRwdXRcIixcblx0XCJvdmVuXCIsXG5cdFwib3duZXJcIixcblx0XCJveGlkZVwiLFxuXHRcIm94eWdlblwiLFxuXHRcInBhY2VcIixcblx0XCJwYWNrXCIsXG5cdFwicGFkXCIsXG5cdFwicGFnZVwiLFxuXHRcInBhaWxcIixcblx0XCJwYWluXCIsXG5cdFwicGFpbnRcIixcblx0XCJwYWlyXCIsXG5cdFwicGFuXCIsXG5cdFwicGFuZVwiLFxuXHRcInBhbmVsXCIsXG5cdFwicGFwZXJcIixcblx0XCJwYXJjZWxcIixcblx0XCJwYXJpdHlcIixcblx0XCJwYXJrXCIsXG5cdFwicGFydFwiLFxuXHRcInBhcnRuZXJcIixcblx0XCJwYXJ0eVwiLFxuXHRcInBhc2NhbFwiLFxuXHRcInBhc3NcIixcblx0XCJwYXNzYWdlXCIsXG5cdFwicGFzdGVcIixcblx0XCJwYXRcIixcblx0XCJwYXRjaFwiLFxuXHRcInBhdGhcIixcblx0XCJwYXRpZW50XCIsXG5cdFwicGF0cm9sXCIsXG5cdFwicGF3XCIsXG5cdFwicGF3c1wiLFxuXHRcInBheVwiLFxuXHRcInBlYVwiLFxuXHRcInBlYWNlXCIsXG5cdFwicGVha1wiLFxuXHRcInBlYXJcIixcblx0XCJwZWNrXCIsXG5cdFwicGVkYWxcIixcblx0XCJwZWdcIixcblx0XCJwZW5cIixcblx0XCJwZW5jaWxcIixcblx0XCJwZW9wbGVcIixcblx0XCJwZXJjZW50XCIsXG5cdFwicGVyZmVjdFwiLFxuXHRcInBlcmlvZFwiLFxuXHRcInBlcm1pdFwiLFxuXHRcInBlcnNvblwiLFxuXHRcInBoYXNlXCIsXG5cdFwicGhvdG9cIixcblx0XCJwaWNrXCIsXG5cdFwicGljdHVyZVwiLFxuXHRcInBpZWNlXCIsXG5cdFwicGllclwiLFxuXHRcInBpbGVcIixcblx0XCJwaWxvdFwiLFxuXHRcInBpblwiLFxuXHRcInBpbmtcIixcblx0XCJwaXBlXCIsXG5cdFwicGlzdG9sXCIsXG5cdFwicGlzdG9uXCIsXG5cdFwicGl0XCIsXG5cdFwicGxhY2VcIixcblx0XCJwbGFuXCIsXG5cdFwicGxhbmVcIixcblx0XCJwbGFudFwiLFxuXHRcInBsYXN0aWNcIixcblx0XCJwbGF0ZVwiLFxuXHRcInBsYXlcIixcblx0XCJwbGVhZFwiLFxuXHRcInBsZWFzdXJlXCIsXG5cdFwicGxvdFwiLFxuXHRcInBsb3dcIixcblx0XCJwbHVnXCIsXG5cdFwicG9ja2V0XCIsXG5cdFwicG9pbnRcIixcblx0XCJwb2lzb25cIixcblx0XCJwb2tlXCIsXG5cdFwicG9sZVwiLFxuXHRcInBvbGljZVwiLFxuXHRcInBvbGlzaFwiLFxuXHRcInBvbGxcIixcblx0XCJwb25kXCIsXG5cdFwicG9vbFwiLFxuXHRcInBvcFwiLFxuXHRcInBvcnRcIixcblx0XCJwb3J0aW9uXCIsXG5cdFwicG9zdFwiLFxuXHRcInBvdFwiLFxuXHRcInBvdGF0b1wiLFxuXHRcInBvdW5kXCIsXG5cdFwicG93ZGVyXCIsXG5cdFwicG93ZXJcIixcblx0XCJwcmVmaXhcIixcblx0XCJwcmVzZW5jZVwiLFxuXHRcInByZXNlbnRcIixcblx0XCJwcmVzaWRlbnRcIixcblx0XCJwcmVzc1wiLFxuXHRcInByaWNlXCIsXG5cdFwicHJpbWVcIixcblx0XCJwcmludFwiLFxuXHRcInByaXNtXCIsXG5cdFwicHJpc29uXCIsXG5cdFwicHJvYmVcIixcblx0XCJwcm9ibGVtXCIsXG5cdFwicHJvZHVjZVwiLFxuXHRcInByb2R1Y3RcIixcblx0XCJwcm9maWxlXCIsXG5cdFwicHJvZml0XCIsXG5cdFwicHJvZ3JhbVwiLFxuXHRcInByb2dyZXNzXCIsXG5cdFwicHJvamVjdFwiLFxuXHRcInByb25vdW5cIixcblx0XCJwcm9vZlwiLFxuXHRcInByb3BcIixcblx0XCJwcm90ZXN0XCIsXG5cdFwicHVibGljXCIsXG5cdFwicHVkZGxlXCIsXG5cdFwicHVmZlwiLFxuXHRcInB1bGxcIixcblx0XCJwdWxzZVwiLFxuXHRcInB1bXBcIixcblx0XCJwdW5jaFwiLFxuXHRcInB1cGlsXCIsXG5cdFwicHVyY2hhc2VcIixcblx0XCJwdXJnZVwiLFxuXHRcInB1cnBvc2VcIixcblx0XCJwdXNoXCIsXG5cdFwicHlyYW1pZFwiLFxuXHRcInF1YXJ0XCIsXG5cdFwicXVhcnRlclwiLFxuXHRcInF1ZXN0aW9uXCIsXG5cdFwicXVpZXRcIixcblx0XCJxdW90YVwiLFxuXHRcInJhY2VcIixcblx0XCJyYWNrXCIsXG5cdFwicmFkYXJcIixcblx0XCJyYWRpYW5cIixcblx0XCJyYWRpb1wiLFxuXHRcInJhZ1wiLFxuXHRcInJhaWxcIixcblx0XCJyYWluXCIsXG5cdFwicmFpbmJvd1wiLFxuXHRcInJhaW5jb2F0XCIsXG5cdFwicmFpc2VcIixcblx0XCJyYWtlXCIsXG5cdFwicmFtXCIsXG5cdFwicmFtcFwiLFxuXHRcInJhbmdlXCIsXG5cdFwicmFua1wiLFxuXHRcInJhcFwiLFxuXHRcInJhdGVcIixcblx0XCJyYXRpb1wiLFxuXHRcInJhdGlvc1wiLFxuXHRcInJhdHRsZVwiLFxuXHRcInJheVwiLFxuXHRcInJlYWNoXCIsXG5cdFwicmVhZGVyXCIsXG5cdFwicmVhbVwiLFxuXHRcInJlYXJcIixcblx0XCJyZWFzb25cIixcblx0XCJyZWJvdW5kXCIsXG5cdFwicmVjZWlwdFwiLFxuXHRcInJlY2Vzc1wiLFxuXHRcInJlY29yZFwiLFxuXHRcInJlY292ZXJ5XCIsXG5cdFwicmVjcnVpdFwiLFxuXHRcInJlZWxcIixcblx0XCJyZWZ1bmRcIixcblx0XCJyZWZ1c2VcIixcblx0XCJyZWdpb25cIixcblx0XCJyZWdyZXRcIixcblx0XCJyZWxheVwiLFxuXHRcInJlbGVhc2VcIixcblx0XCJyZWxpZWZcIixcblx0XCJyZW1lZHlcIixcblx0XCJyZW1vdmFsXCIsXG5cdFwicmVwYWlyXCIsXG5cdFwicmVwb3J0XCIsXG5cdFwicmVxdWVzdFwiLFxuXHRcInJlc2N1ZVwiLFxuXHRcInJlc2VydmVcIixcblx0XCJyZXNpZGVudFwiLFxuXHRcInJlc2lkdWVcIixcblx0XCJyZXNvdXJjZVwiLFxuXHRcInJlc3BlY3RcIixcblx0XCJyZXN0XCIsXG5cdFwicmVzdWx0XCIsXG5cdFwicmV0dXJuXCIsXG5cdFwicmV2ZXJzZVwiLFxuXHRcInJldmlld1wiLFxuXHRcInJld2FyZFwiLFxuXHRcInJoZW9zdGF0XCIsXG5cdFwicmh5dGhtXCIsXG5cdFwicmliXCIsXG5cdFwicmliYm9uXCIsXG5cdFwicmljZVwiLFxuXHRcInJpZGRsZVwiLFxuXHRcInJpZGVcIixcblx0XCJyaWZsZVwiLFxuXHRcInJpZ1wiLFxuXHRcInJpbVwiLFxuXHRcInJpbnNlXCIsXG5cdFwicml2ZXJcIixcblx0XCJyb2FkXCIsXG5cdFwicm9hclwiLFxuXHRcInJvY2tcIixcblx0XCJyb2NrZXRcIixcblx0XCJyb2RcIixcblx0XCJyb2xsXCIsXG5cdFwicm9vZlwiLFxuXHRcInJvb21cIixcblx0XCJyb290XCIsXG5cdFwicm9wZVwiLFxuXHRcInJvc2VcIixcblx0XCJyb3VuZFwiLFxuXHRcInJvdXRlXCIsXG5cdFwicm93ZXJcIixcblx0XCJydWJiZXJcIixcblx0XCJydWRkZXJcIixcblx0XCJydWdcIixcblx0XCJydWxlXCIsXG5cdFwicnVtYmxlXCIsXG5cdFwicnVuXCIsXG5cdFwicnVubmVyXCIsXG5cdFwicnVzaFwiLFxuXHRcInJ1c3RcIixcblx0XCJzYWNrXCIsXG5cdFwic2FkZGxlXCIsXG5cdFwic2FmZXR5XCIsXG5cdFwic2FpbFwiLFxuXHRcInNhaWxvclwiLFxuXHRcInNhbGVcIixcblx0XCJzYWx0XCIsXG5cdFwic2FsdXRlXCIsXG5cdFwic2FtcGxlXCIsXG5cdFwic2FuZFwiLFxuXHRcInNhcFwiLFxuXHRcInNhc2hcIixcblx0XCJzY2FiXCIsXG5cdFwic2NhbGVcIixcblx0XCJzY2VuZVwiLFxuXHRcInNjaG9vbFwiLFxuXHRcInNjaWVuY2VcIixcblx0XCJzY29wZVwiLFxuXHRcInNjb3JlXCIsXG5cdFwic2NyYXBcIixcblx0XCJzY3JhdGNoXCIsXG5cdFwic2NyZWFtXCIsXG5cdFwic2NyZWVuXCIsXG5cdFwic2NyZXdcIixcblx0XCJzZWFcIixcblx0XCJzZWFsXCIsXG5cdFwic2VhbVwiLFxuXHRcInNlYXJjaFwiLFxuXHRcInNlYXNvblwiLFxuXHRcInNlYXRcIixcblx0XCJzZWNvbmRcIixcblx0XCJzZWNyZXRcIixcblx0XCJzZWN0b3JcIixcblx0XCJzZWVkXCIsXG5cdFwic2VsZlwiLFxuXHRcInNlbnNlXCIsXG5cdFwic2VudHJ5XCIsXG5cdFwic2VyaWFsXCIsXG5cdFwic2VyaWVzXCIsXG5cdFwic2VydmFudFwiLFxuXHRcInNlc3Npb25cIixcblx0XCJzZXR1cFwiLFxuXHRcInNld2FnZVwiLFxuXHRcInNld2VyXCIsXG5cdFwic2V4XCIsXG5cdFwic2hhZGVcIixcblx0XCJzaGFkb3dcIixcblx0XCJzaGFmdFwiLFxuXHRcInNoYW1lXCIsXG5cdFwic2hhcGVcIixcblx0XCJzaGFyZVwiLFxuXHRcInNoYXZlXCIsXG5cdFwic2hlZXRcIixcblx0XCJzaGVsZlwiLFxuXHRcInNoZWxsXCIsXG5cdFwic2hlbHRlclwiLFxuXHRcInNoaWVsZFwiLFxuXHRcInNoaWZ0XCIsXG5cdFwic2hpcFwiLFxuXHRcInNoaXJ0XCIsXG5cdFwic2hvY2tcIixcblx0XCJzaG9lXCIsXG5cdFwic2hvcFwiLFxuXHRcInNob3JlXCIsXG5cdFwic2hvdWxkZXJcIixcblx0XCJzaG91dFwiLFxuXHRcInNob3ZlbFwiLFxuXHRcInNob3dcIixcblx0XCJzaG93ZXJcIixcblx0XCJzaWRlXCIsXG5cdFwic2lnaHRcIixcblx0XCJzaWduXCIsXG5cdFwic2lsZW5jZVwiLFxuXHRcInNpbGtcIixcblx0XCJzaWxsXCIsXG5cdFwic2lsdmVyXCIsXG5cdFwic2lua1wiLFxuXHRcInNpcFwiLFxuXHRcInNpclwiLFxuXHRcInNpcmVuXCIsXG5cdFwic2lzdGVyXCIsXG5cdFwic2l0ZVwiLFxuXHRcInNpemVcIixcblx0XCJza2V3XCIsXG5cdFwic2tpbGxcIixcblx0XCJza2luXCIsXG5cdFwic2tpcFwiLFxuXHRcInNraXJ0XCIsXG5cdFwic2t5XCIsXG5cdFwic2xhcFwiLFxuXHRcInNsYXNoXCIsXG5cdFwic2xhdGVcIixcblx0XCJzbGF2ZVwiLFxuXHRcInNsZWRcIixcblx0XCJzbGVlcFwiLFxuXHRcInNsZWV2ZVwiLFxuXHRcInNsaWNlXCIsXG5cdFwic2xpZGVcIixcblx0XCJzbG9wZVwiLFxuXHRcInNsb3RcIixcblx0XCJzbWFzaFwiLFxuXHRcInNtZWxsXCIsXG5cdFwic21pbGVcIixcblx0XCJzbW9rZVwiLFxuXHRcInNuYXBcIixcblx0XCJzbmVlemVcIixcblx0XCJzbm93XCIsXG5cdFwic29hcFwiLFxuXHRcInNvY2lldHlcIixcblx0XCJzb2NrXCIsXG5cdFwic29ja2V0XCIsXG5cdFwic29kXCIsXG5cdFwic29mdHdhcmVcIixcblx0XCJzb2lsXCIsXG5cdFwic29sZGllclwiLFxuXHRcInNvbGVcIixcblx0XCJzb25cIixcblx0XCJzb25hclwiLFxuXHRcInNvbmdcIixcblx0XCJzb3J0XCIsXG5cdFwic291bmRcIixcblx0XCJzb3VwXCIsXG5cdFwic291cmNlXCIsXG5cdFwic291dGhcIixcblx0XCJzcGFjZVwiLFxuXHRcInNwYWNlclwiLFxuXHRcInNwYWRlXCIsXG5cdFwic3BhblwiLFxuXHRcInNwYXJcIixcblx0XCJzcGFyZVwiLFxuXHRcInNwYXJrXCIsXG5cdFwic3BlYWtlclwiLFxuXHRcInNwZWFyXCIsXG5cdFwic3BlZWNoXCIsXG5cdFwic3BlZWRcIixcblx0XCJzcGVlZGVyXCIsXG5cdFwic3Bpa2VcIixcblx0XCJzcGlsbFwiLFxuXHRcInNwaXJhbFwiLFxuXHRcInNwbGFzaFwiLFxuXHRcInNwbGljZVwiLFxuXHRcInNwbGludFwiLFxuXHRcInNwb2tlXCIsXG5cdFwic3BvbmdlXCIsXG5cdFwic3BvbnNvclwiLFxuXHRcInNwb25zb3JzXCIsXG5cdFwic3Bvb2xcIixcblx0XCJzcG9vblwiLFxuXHRcInNwb3J0XCIsXG5cdFwic3BvdFwiLFxuXHRcInNwcmF5XCIsXG5cdFwic3ByaW5nXCIsXG5cdFwic3F1YXJlXCIsXG5cdFwic3F1ZWFrXCIsXG5cdFwic3RhY2tcIixcblx0XCJzdGFmZlwiLFxuXHRcInN0YWdlXCIsXG5cdFwic3RhaXJcIixcblx0XCJzdGFrZVwiLFxuXHRcInN0YWxsXCIsXG5cdFwic3RhbXBcIixcblx0XCJzdGFuZFwiLFxuXHRcInN0YXBsZVwiLFxuXHRcInN0YXJcIixcblx0XCJzdGFyZVwiLFxuXHRcInN0YXJ0XCIsXG5cdFwic3RhdGVcIixcblx0XCJzdGF0dXNcIixcblx0XCJzdGVhbVwiLFxuXHRcInN0ZWFtZXJcIixcblx0XCJzdGVlbFwiLFxuXHRcInN0ZW1cIixcblx0XCJzdGVwXCIsXG5cdFwic3Rlcm5cIixcblx0XCJzdGlja1wiLFxuXHRcInN0aW5nXCIsXG5cdFwic3RpdGNoXCIsXG5cdFwic3RvY2tcIixcblx0XCJzdG9tYWNoXCIsXG5cdFwic3RvbmVcIixcblx0XCJzdG9vbFwiLFxuXHRcInN0b3BcIixcblx0XCJzdG9yZVwiLFxuXHRcInN0b3JtXCIsXG5cdFwic3RvcnlcIixcblx0XCJzdG92ZVwiLFxuXHRcInN0cmFpblwiLFxuXHRcInN0cmFuZFwiLFxuXHRcInN0cmFwXCIsXG5cdFwic3RyYXdcIixcblx0XCJzdHJlYWtcIixcblx0XCJzdHJlYW1cIixcblx0XCJzdHJlZXRcIixcblx0XCJzdHJlc3NcIixcblx0XCJzdHJpa2VcIixcblx0XCJzdHJpbmdcIixcblx0XCJzdHJpcFwiLFxuXHRcInN0cmlwZVwiLFxuXHRcInN0cm9iZVwiLFxuXHRcInN0cm9rZVwiLFxuXHRcInN0cnV0XCIsXG5cdFwic3R1YlwiLFxuXHRcInN0dWRlbnRcIixcblx0XCJzdHVkeVwiLFxuXHRcInN0dWZmXCIsXG5cdFwic3R1bXBcIixcblx0XCJzdWJtYXJpbmVcIixcblx0XCJzdWNjZXNzXCIsXG5cdFwic3VnYXJcIixcblx0XCJzdWl0XCIsXG5cdFwic3VtXCIsXG5cdFwic3VuXCIsXG5cdFwic3VuZGF5XCIsXG5cdFwic3VubGlnaHRcIixcblx0XCJzdW5yaXNlXCIsXG5cdFwic3Vuc2V0XCIsXG5cdFwic3Vuc2hpbmVcIixcblx0XCJzdXJmYWNlXCIsXG5cdFwic3VyZ2VcIixcblx0XCJzdXJwcmlzZVwiLFxuXHRcInN3YWJcIixcblx0XCJzd2FsbG93XCIsXG5cdFwic3dhbXBcIixcblx0XCJzd2FwXCIsXG5cdFwic3dlZXBcIixcblx0XCJzd2VsbFwiLFxuXHRcInN3aW1cIixcblx0XCJzd2ltbWVyXCIsXG5cdFwic3dpbmdcIixcblx0XCJzd2l0Y2hcIixcblx0XCJzd2l2ZWxcIixcblx0XCJzd29yZFwiLFxuXHRcInN5bWJvbFwiLFxuXHRcInN5c3RlbVwiLFxuXHRcInRhYlwiLFxuXHRcInRhYmxlXCIsXG5cdFwidGFibGV0XCIsXG5cdFwidGFja1wiLFxuXHRcInRhY3RpY1wiLFxuXHRcInRhZ1wiLFxuXHRcInRhaWxcIixcblx0XCJ0YWlsb3JcIixcblx0XCJ0YWxrXCIsXG5cdFwidGFuXCIsXG5cdFwidGFua1wiLFxuXHRcInRhcFwiLFxuXHRcInRhcGVcIixcblx0XCJ0YXJcIixcblx0XCJ0YXJnZXRcIixcblx0XCJ0YXNrXCIsXG5cdFwidGFzdGVcIixcblx0XCJ0YXhcIixcblx0XCJ0YXhpXCIsXG5cdFwidGVhbVwiLFxuXHRcInRlYXJcIixcblx0XCJ0ZWV0aFwiLFxuXHRcInRlbGxlclwiLFxuXHRcInRlbXBlclwiLFxuXHRcInRlbmRlclwiLFxuXHRcInRlbnNcIixcblx0XCJ0ZW5zaW9uXCIsXG5cdFwidGVudFwiLFxuXHRcInRlbnRoXCIsXG5cdFwidGVybVwiLFxuXHRcInRlcnJhaW5cIixcblx0XCJ0ZXN0XCIsXG5cdFwidGVzdHNcIixcblx0XCJ0ZXh0XCIsXG5cdFwidGhlb3J5XCIsXG5cdFwidGhpblwiLFxuXHRcInRoaW5nXCIsXG5cdFwidGhpcnR5XCIsXG5cdFwidGhyZWFkXCIsXG5cdFwidGhyZWF0XCIsXG5cdFwidGhyb2F0XCIsXG5cdFwidGh1bWJcIixcblx0XCJ0aHVuZGVyXCIsXG5cdFwidGlja1wiLFxuXHRcInRpZGVcIixcblx0XCJ0aWVcIixcblx0XCJ0aWxsXCIsXG5cdFwidGltZVwiLFxuXHRcInRpbWVyXCIsXG5cdFwidGltZXJzXCIsXG5cdFwidGltZXNcIixcblx0XCJ0aW5cIixcblx0XCJ0aXBcIixcblx0XCJ0aXBzXCIsXG5cdFwidGlyZVwiLFxuXHRcInRpc3N1ZVwiLFxuXHRcInRpdGxlXCIsXG5cdFwidG9kYXlcIixcblx0XCJ0b2VcIixcblx0XCJ0b25cIixcblx0XCJ0b25ndWVcIixcblx0XCJ0b29sXCIsXG5cdFwidG9vbHNcIixcblx0XCJ0b290aFwiLFxuXHRcInRvcFwiLFxuXHRcInRvcGljXCIsXG5cdFwidG9zc1wiLFxuXHRcInRvdGFsXCIsXG5cdFwidG91Y2hcIixcblx0XCJ0b3VyXCIsXG5cdFwidG93ZWxcIixcblx0XCJ0b3dlclwiLFxuXHRcInRvd25cIixcblx0XCJ0cmFjZVwiLFxuXHRcInRyYWNrXCIsXG5cdFwidHJhY2tlclwiLFxuXHRcInRyYWN0b3JcIixcblx0XCJ0cmFkZVwiLFxuXHRcInRyYWZmaWNcIixcblx0XCJ0cmFpbFwiLFxuXHRcInRyYWlsZXJcIixcblx0XCJ0cmFpblwiLFxuXHRcInRyYW5zZmVyXCIsXG5cdFwidHJhbnNpdFwiLFxuXHRcInRyYXBcIixcblx0XCJ0cmFzaFwiLFxuXHRcInRyYXlcIixcblx0XCJ0cmVlXCIsXG5cdFwidHJpYWxcIixcblx0XCJ0cmlja1wiLFxuXHRcInRyaWdnZXJcIixcblx0XCJ0cmltXCIsXG5cdFwidHJpcFwiLFxuXHRcInRyb29wXCIsXG5cdFwidHJvdWJsZVwiLFxuXHRcInRydWNrXCIsXG5cdFwidHJ1bmtcIixcblx0XCJ0cnV0aFwiLFxuXHRcInRyeVwiLFxuXHRcInR1YlwiLFxuXHRcInR1Z1wiLFxuXHRcInR1bmVcIixcblx0XCJ0dW5uZWxcIixcblx0XCJ0dXJuXCIsXG5cdFwidHdpZ1wiLFxuXHRcInR3aW5cIixcblx0XCJ0d2luZVwiLFxuXHRcInR3aXJsXCIsXG5cdFwidHdpc3RcIixcblx0XCJ0eXBlXCIsXG5cdFwidHlwaXN0XCIsXG5cdFwidW1icmVsbGFcIixcblx0XCJ1bmlmb3JtXCIsXG5cdFwidW5pdFwiLFxuXHRcInVwZGF0ZVwiLFxuXHRcInVwc2lkZVwiLFxuXHRcInVzYWdlXCIsXG5cdFwidXNlXCIsXG5cdFwidXNlclwiLFxuXHRcInZhY3V1bVwiLFxuXHRcInZhbHVlXCIsXG5cdFwidmFsdmVcIixcblx0XCJ2YXBvclwiLFxuXHRcInZlY3RvclwiLFxuXHRcInZlaGljbGVcIixcblx0XCJ2ZW5kb3JcIixcblx0XCJ2ZW50XCIsXG5cdFwidmVyYlwiLFxuXHRcInZlcnNpb25cIixcblx0XCJ2ZXNzZWxcIixcblx0XCJ2ZXRlcmFuXCIsXG5cdFwidmljZVwiLFxuXHRcInZpY3RpbVwiLFxuXHRcInZpZGVvXCIsXG5cdFwidmlld1wiLFxuXHRcInZpbGxhZ2VcIixcblx0XCJ2aW5lXCIsXG5cdFwidmlvbGV0XCIsXG5cdFwidmlzaXRcIixcblx0XCJ2b2ljZVwiLFxuXHRcInZvbHRcIixcblx0XCJ2b21pdFwiLFxuXHRcIndhZmVyXCIsXG5cdFwid2FnZVwiLFxuXHRcIndhZ29uXCIsXG5cdFwid2Fpc3RcIixcblx0XCJ3YWl0XCIsXG5cdFwid2FrZVwiLFxuXHRcIndhbGtcIixcblx0XCJ3YWxsXCIsXG5cdFwid2FudFwiLFxuXHRcIndhclwiLFxuXHRcIndhc2hcIixcblx0XCJ3YXN0ZVwiLFxuXHRcIndhdGNoXCIsXG5cdFwid2F0ZXJcIixcblx0XCJ3YXR0XCIsXG5cdFwid2F2ZVwiLFxuXHRcIndheFwiLFxuXHRcIndheVwiLFxuXHRcIndlYlwiLFxuXHRcIndlZWRcIixcblx0XCJ3ZWVrXCIsXG5cdFwid2VpZ2h0XCIsXG5cdFwid2VsZFwiLFxuXHRcIndlc3RcIixcblx0XCJ3aGVlbFwiLFxuXHRcIndoaXBcIixcblx0XCJ3aGlybFwiLFxuXHRcIndpZHRoXCIsXG5cdFwid2lnZ2xlXCIsXG5cdFwid2luXCIsXG5cdFwid2luY2hcIixcblx0XCJ3aW5kXCIsXG5cdFwid2luZVwiLFxuXHRcIndpbmdcIixcblx0XCJ3aW50ZXJcIixcblx0XCJ3aXJlXCIsXG5cdFwid2lzaFwiLFxuXHRcIndvbWFuXCIsXG5cdFwid29uZGVyXCIsXG5cdFwid29vZFwiLFxuXHRcIndvb2xcIixcblx0XCJ3b3JkXCIsXG5cdFwid29ya1wiLFxuXHRcIndvcmxkXCIsXG5cdFwid29ybVwiLFxuXHRcIndvcnJ5XCIsXG5cdFwid29ydGhcIixcblx0XCJ3cmFwXCIsXG5cdFwid3JlY2tcIixcblx0XCJ3cmVuY2hcIixcblx0XCJ3cmlzdFwiLFxuXHRcIndyaXRlclwiLFxuXHRcInlhcmRcIixcblx0XCJ5YXJuXCIsXG5cdFwieWVhclwiLFxuXHRcInllbGxcIixcblx0XCJ5aWVsZFwiLFxuXHRcInlvbGtcIixcblx0XCJ6ZXJvXCIsXG5cdFwiemlwXCIsXG5cdFwiem9uZVwiLFxuXHRcImNhblwiLFxuXHRcIm1heVwiLFxuXHRcImNvdXBsaW5nXCIsXG5cdFwiZGFtcGluZ1wiLFxuXHRcImVuZGluZ1wiLFxuXHRcInJpZ2dpbmdcIixcblx0XCJyaW5nXCIsXG5cdFwic2l6aW5nXCIsXG5cdFwic2xpbmdcIixcblx0XCJub3RoaW5nXCIsXG5cdFwiY2FzdFwiLFxuXHRcImNvc3RcIixcblx0XCJjdXRcIixcblx0XCJkcnVua1wiLFxuXHRcImZlbHRcIixcblx0XCJncm91bmRcIixcblx0XCJoaXRcIixcblx0XCJsZW50XCIsXG5cdFwib2Zmc2V0XCIsXG5cdFwic2V0XCIsXG5cdFwic2hlZFwiLFxuXHRcInNob3RcIixcblx0XCJzbGl0XCIsXG5cdFwidGhvdWdodFwiLFxuXHRcIndvdW5kXCIsXG5cdFwiXCJdO1xuXHRcblx0XHRcdHZhciBkO1xuXHRcdFx0ZD1NYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNjU1MzYpO1xuXHRcdHZhclx0ZGE9ZCUodHh0X2FkamVjdGl2ZXMubGVuZ3RoLTEpO1xuXHRcdFx0ZD1NYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNjU1MzYpO1xuXHRcdHZhclx0ZG49ZCUodHh0X25vdW5zLmxlbmd0aC0xKTtcdFx0XG5cdFx0dmFyXHRkcz10eHRfYWRqZWN0aXZlc1tkYV0rXCJfXCIrdHh0X25vdW5zW2RuXTtcblx0XHRyZXR1cm4gZHM7XG5cdH1cblxufTtcbiIsIlxuZXhwb3J0cy5zZXR1cD1mdW5jdGlvbihzcGV3KXtcblxuXG52YXIgb3B0cz1leHBvcnRzO1xuXG5cblx0dmFyIG9wdHNfc2F2ZT17XCJzaG93X2ljb25zXCI6dHJ1ZSxcInNob3dfaW1nc1wiOnRydWUsXCJzbWFsbF9mb250XCI6dHJ1ZSxcImZ1bGxfc2l6ZVwiOnRydWUsXCJjaGF0X29ubHlcIjp0cnVlLFwiYmlnX3RleHRcIjp0cnVlLFwidmlkZW9faW5fY2hhdFwiOnRydWV9O1xuXHRzcGV3Lm9wdHM9e307XG5cdHNwZXcucmVzZXRfb3B0cz1mdW5jdGlvbigpXG5cdHtcblx0XHRmb3IoaSBpbiBvcHRzX3NhdmUgKVxuXHRcdHtcblx0XHRcdHNwZXcub3B0c1tpXT11bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHNwZXcub3B0c1tcInNob3dfaWNvbnNcIl09dHJ1ZTtcblx0XHRzcGV3Lm9wdHNbXCJzaG93X2ltZ3NcIl09dHJ1ZTtcblx0XHRzcGV3Lm9wdHNbXCJzbWFsbF9mb250XCJdPWZhbHNlO1xuXHRcdHNwZXcub3B0c1tcImJpZ190ZXh0XCJdPWZhbHNlO1xuXHRcdHNwZXcub3B0c1tcImZ1bGxfc2l6ZVwiXT1mYWxzZTtcblx0XHRzcGV3Lm9wdHNbXCJjaGF0X29ubHlcIl09ZmFsc2U7XG5cdFx0c3Bldy5vcHRzW1widmlkZW9faW5fY2hhdFwiXT1mYWxzZTtcblx0XHRzcGV3Lm9wdHNbXCJjbWRsb2dcIl09W107XG5cdFx0c3Bldy5vcHRzW1widHZcIl09dHJ1ZTtcblx0fVxuXHRzcGV3LnJlc2V0X29wdHMoKTtcblx0Zm9yKGkgaW4gb3B0cykgeyBzcGV3Lm9wdHNbaV09b3B0c1tpXTsgfSAvLyBvdmVycmlkZSBvcHRzXG5cdFxuXHRcblx0c3Bldy5zYXZlX29wdHM9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0aWYoIXNwZXcuc3RvcmFnZV9hdmFpbGFibGUpIHsgcmV0dXJuOyB9XG5cdFx0aWYoIXNwZXcuanNvbl9hdmFpbGFibGUpIHsgcmV0dXJuOyB9XG5cdFx0XG5cdFx0dmFyIG9wdHM9e307XG5cdFx0XG5cdFx0Zm9yKGkgaW4gb3B0c19zYXZlIClcblx0XHR7XG5cdFx0XHRvcHRzW2ldPXNwZXcub3B0c1tpXTtcblx0XHR9XG5cdFx0b3B0c1tcIlNcIl09c3Bldy5vcHRzW1wiU1wiXTtcblx0XHRvcHRzW1wiY21kbG9nXCJdPXNwZXcub3B0c1tcImNtZGxvZ1wiXTtcblx0XHRcblx0XHR2YXIgcz1KU09OLnN0cmluZ2lmeShvcHRzKTtcblx0XHR3aW5kb3cubG9jYWxTdG9yYWdlW1wid2V0c3Bld19vcHRzXCJdPXM7XG4vL2NvbnNvbGUubG9nKFwic2F2ZWQgXCIrcyk7XG5cdH1cblx0XG5cdHNwZXcubG9hZF9vcHRzPWZ1bmN0aW9uKClcblx0e1xuXHRcdHZhciBnZXRzPXt9O1xuXHRcdHZhciBzYXZlPWZhbHNlO1xuXHRcdC8vIGdldCBzZXNzaW9uIGZyb20gdXJsXG5cdFx0dmFyIHMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi50b1N0cmluZygpLnNwbGl0KCc/Jyk7XG5cdFx0aWYoc1sxXSlcblx0XHR7XG5cdFx0XHRnZXRzPXNwZXcuc3RyX3RvX21zZyhzWzFdKTtcblx0XHR9XG5cbi8vIHNldCBoZXJlIGluIGNhc2Ugd2UgZG8gbm90IGhhdmUgbG9jYWxzdG9yYWdlXG5cdFx0aWYoZ2V0c1tcIlNcIl0pXG5cdFx0e1xuXHRcdFx0c3Bldy5vcHRzLlM9Z2V0c1tcIlNcIl07XG5cdFx0XHRzYXZlPXRydWU7XG5cdFx0fVxuXHRcdGlmKCFzcGV3LnN0b3JhZ2VfYXZhaWxhYmxlKSB7IHJldHVybjsgfVxuXHRcdGlmKCFzcGV3Lmpzb25fYXZhaWxhYmxlKSB7IHJldHVybjsgfVxuXHRcdFxuXHRcdHZhciBzPXdpbmRvdy5sb2NhbFN0b3JhZ2VbXCJ3ZXRzcGV3X29wdHNcIl07XG5cdFx0aWYodHlwZW9mKHMpPT1cInN0cmluZ1wiKVxuXHRcdHtcblx0XHRcdHZhciBvcHRzPUpTT04ucGFyc2Uocyk7XG4vL2NvbnNvbGUubG9nKFwibG9hZGVkIFwiK3MpO1xuXG5cdFx0XHRmb3IoaSBpbiBvcHRzKVxuXHRcdFx0e1xuXHRcdFx0XHRzcGV3Lm9wdHNbaV09b3B0c1tpXTtcblx0XHRcdH1cblx0XHR9XG4vLyBtYWtlIHN1cmUgdGhhdCB0aGUgdXJsIG92ZXJyaWRlc1xuXHRcdGlmKGdldHNbXCJTXCJdKVxuXHRcdHtcblx0XHRcdHNwZXcub3B0cy5TPWdldHNbXCJTXCJdO1xuXHRcdFx0c2F2ZT10cnVlO1xuXHRcdH1cblx0XHRcdFxuXHRcdGlmKHNhdmUpe3NwZXcuc2F2ZV9vcHRzKCl9IC8vIG5lZWQgdG8gc2F2ZT9cblx0fVxuXHRcblx0c3Bldy5tYWtlX2Nzc19mcm9tX29wdHM9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0dmFyIHM9XCJcIjtcblx0XHRcdFx0XG5cdFx0aWYoc3Bldy5vcHRzLnNtYWxsX2ZvbnQpXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXcgeyBmb250LXNpemU6IDEwcHg7IH0gLndldHNwZXdfbGluZSB7IG1hcmdpbi1ib3R0b206MXB4OyB9IFwiO1xuXHRcdH1cblx0XHRpZighc3Bldy5vcHRzLnNob3dfaWNvbnMpXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXdfaWNvbiB7IGRpc3BsYXk6bm9uZTsgfSBcIjtcblx0XHR9XG5cdFx0aWYoIXNwZXcub3B0cy5zaG93X2ltZ3MpXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXdfYXV0b2ltZyB7IGRpc3BsYXk6bm9uZTsgfSBcIjtcblx0XHR9XG5cdFx0aWYoc3Bldy5vcHRzLmZ1bGxfc2l6ZSlcblx0XHR7XG5cdFx0XHRzKz1cIiAud2V0c3BldyB7IHdpZHRoOjEwMCU7IGhlaWdodDoxMDAlOyB0b3A6MHB4OyBsZWZ0OjBweDsgcmlnaHQ6MHB4OyBib3R0b206MHB4OyBcdG1hcmdpbjphdXRvOyBwb3NpdGlvbjpmaXhlZDsgfSBcIjtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X3dldHYgeyB3aWR0aDo2NyU7IGhlaWdodDoxMDAlOyB9IFwiO1xuXHRcdFx0cys9XCIgLndldHNwZXdfc3BldyB7IHdpZHRoOjMzJTsgaGVpZ2h0OjEwMCU7IH0gXCI7XG5cdFx0XHRzKz1cIiBodG1sLGJvZHkgeyBvdmVyZmxvdzpoaWRkZW47IH0gXCI7XG5cdFx0fVxuXHRcdHNwZXcub3B0cy50dj10cnVlO1xuXHRcdGlmKHNwZXcub3B0cy5jaGF0X29ubHkpXG5cdFx0e1xuXHRcdFx0c3Bldy5vcHRzLnR2PWZhbHNlO1xuXHRcdFx0cys9XCIgLndldHNwZXdfd2V0diB7IGRpc3BsYXk6bm9uZTsgfSBcIjtcblx0XHRcdHMrPVwiIC53ZXRzcGV3X3NwZXcgeyB3aWR0aDoxMDAlOyBoZWlnaHQ6MTAwJTsgfSBcIjtcblx0XHR9XG5cdFx0aWYoIHNwZXcub3B0cy52aWRlb19pbl9jaGF0IClcblx0XHR7XG5cdFx0XHRzKz1cIiAud2V0c3Bld193ZXR2IHsgZGlzcGxheTpibG9jazsgd2lkdGg6NTAlOyBoZWlnaHQ6NTAlOyBwb3NpdGlvbjphYnNvbHV0ZTsgbGVmdDo1MCU7IHRvcDoxMHB4OyB9IFwiO1xuXHRcdFx0cys9XCIgLndldHNwZXdfc3BldyB7IHdpZHRoOjEwMCU7IGhlaWdodDoxMDAlOyB9IFwiO1xuXHRcdH1cblx0XHRpZihzcGV3Lm9wdHMuYmlnX3RleHQpXG5cdFx0e1xuXHRcdFx0cys9XCIgLndldHNwZXcgeyBmb250LXNpemU6IDMycHg7IH0gLndldHNwZXdfbGluZSB7IG1hcmdpbi1ib3R0b206MHB4OyB9IFwiO1xuXHRcdFx0cys9XCIgLndldHNwZXdfaWNvbiB7IHdpZHRoOjMycHg7IGhlaWdodDozMnB4OyB9IFwiO1xuXHRcdFx0aWYoc3Bldy5vcHRzLnNtYWxsX2ZvbnQpXG5cdFx0XHR7XG5cdFx0XHRcdHMrPVwiIC53ZXRzcGV3IHsgZm9udC1zaXplOiAxNnB4OyB9IFwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRzcGV3LmRpdl9jc3MuZW1wdHkoKS5hcHBlbmQoJChcIjxzdHlsZT5cIitzK1wiPC9zdHlsZT5cIikpO1xuXHR9XG5cblxuXHRzcGV3LnNob3dfb3B0cz1mdW5jdGlvbigpXG5cdHtcblx0XHRzcGV3LmRpdl9vcHRzLmVtcHR5KCk7XG5cdFx0c3Bldy5kaXZfb3B0cy5hcHBlbmQoXCI8YSBjbGFzcz1cXFwic3Bld19jbGlja1xcXCIgdGl0bGU9XFxcImNoYXRcXFwiPlJldHVybiB0byBjaGF0LjwvYT5cIik7XG5cdFx0Zm9yKGkgaW4gb3B0c19zYXZlIClcblx0XHR7XG5cdFx0XHR2YXIgbj1pO1xuXHRcdFx0dmFyIHY9c3Bldy5vcHRzW2ldP1wiT05cIjpcIk9GRlwiXG5cdFx0XHRzcGV3LmRpdl9vcHRzLmFwcGVuZChcIjxhIHRpdGxlPVxcXCJcIituK1wiXFxcIj5cIituK1wiIDogXCIrditcIjwvYT5cIik7XG5cdFx0fVxuXHRcdHNwZXcuZGl2X29wdHMuYXBwZW5kKFwiPGEgdGl0bGU9XFxcInJlc2V0XFxcIj5SZXNldCBvcHRpb25zPC9hPlwiKTtcblxuXHRcdHNwZXcuZGl2X21haW4uZW1wdHkoKTtcblx0XHRzcGV3LmRpdl9tYWluLmFwcGVuZChzcGV3LmRpdl9vcHRzKTtcblx0XHRcblx0XHQkKFwiLndldHNwZXdfb3B0cyBhXCIpLmNsaWNrKHNwZXcuY2xpY2tfb3B0cyk7XG5cdH1cblx0XG5cdHNwZXcuY2xpY2tfb3B0cz1mdW5jdGlvbigpXG5cdHtcblx0XHR2YXIgdHh0PSQodGhpcykuYXR0cihcInRpdGxlXCIpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XG5cdFx0aWYodHh0PT1cInJlc2V0XCIpXG5cdFx0e1xuXHRcdFx0c3Bldy5yZXNldF9vcHRzKCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRpZihvcHRzX3NhdmVbdHh0XSlcblx0XHR7XG5cdFx0XHRzcGV3Lm9wdHNbdHh0XT1zcGV3Lm9wdHNbdHh0XT9mYWxzZTp0cnVlOyAvLyB0b2dnbGVcblx0XHR9XG5cdFx0XG5cdFx0c3Bldy5tYWtlX2Nzc19mcm9tX29wdHMoKTtcblx0XHRzcGV3LnNob3dfdGFiKFwib3B0c1wiKTtcblx0XHRzcGV3LnNhdmVfb3B0cygpO1xuLy9jb25zb2xlLmxvZyhcIm9wdHMgXCIrdHh0KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXG59O1xuIiwiXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKHNwZXcpe1xuXG5cdHZhciBtc2c9e307IC8vIG91ciBiYXNlIG9mIGNvbXVuaWNhdGlvbnMsIG5ldyBtc2dzIGFyZSBkZWx0YXMgb24gdGhpcyBvYmplY3RcblxuXG5cbi8vIGphdmFzY3JpcHQgaXMgYSBiaXQgY3JhcCBhdCB1dGY4LCBzbyB3ZSB1c2UgdGhlc2UgZXNjYXBlc1xuXHRmdW5jdGlvbiBlbmMocylcblx0e1xuXHRcdHZhciBzMj1cIlwiO1xuXHRcdGlmKHMpXG5cdFx0e1xuXHRcdFx0dHJ5XG5cdFx0XHR7XG4vL1x0XHRcdFx0czI9dW5lc2NhcGUoIGVuY29kZVVSSUNvbXBvbmVudCggcyApICk7IC8vIGZvcmNlIGludG8gdXRmOCA/P1xuXHRcdFx0XHRzMj1zLnNwbGl0KFwiJVwiKS5qb2luKFwiJTI1XCIpLnNwbGl0KFwiPVwiKS5qb2luKFwiJTNkXCIpLnNwbGl0KFwiJlwiKS5qb2luKFwiJTI2XCIpO1xuLy9jb25zb2xlLmxvZyhcImVuYyBcIitzK1wiIDogXCIrczIpO1xuXHRcdFx0XHRyZXR1cm4gczI7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaChlKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH07XG5cdFxuLy90aGlzIHNob3VsZCBzaG9ydGNpcmN1aXQgaWYgN2JpdCBjbGVhbiAod2hpY2ggd2UgbW9zdGx5IHdvdWxkIGJlKVxuXHRmdW5jdGlvbiBkZWNfdXRmOCh0KSB7XG5cdFx0XG5cdFx0aWYoIXQubWF0Y2goL1teXFx4MDEtXFx4N2ZdLykpIHsgcmV0dXJuIHQ7IH1cblx0XHRcbiAgICAgICAgdmFyIHMgPSBcIlwiOyAgXG4gICAgICAgIHZhciBpID0gMDsgIFxuICAgICAgICB2YXIgYyA9IGMxID0gYzIgPSAwO1xuICBcbiAgICAgICAgd2hpbGUgKCBpIDwgdC5sZW5ndGggKSB7ICBcbiAgICAgICAgICAgIGMgPSB0LmNoYXJDb2RlQXQoaSk7ICBcbiAgICAgICAgICAgIGlmIChjIDwgMTI4KSB7ICBcbiAgICAgICAgICAgICAgICBzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7ICBcbiAgICAgICAgICAgICAgICBpKys7ICBcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgZWxzZSBpZigoYyA+IDE5MSkgJiYgKGMgPCAyMjQpKSB7ICBcbiAgICAgICAgICAgICAgICBjMiA9IHQuY2hhckNvZGVBdChpKzEpOyAgXG4gICAgICAgICAgICAgICAgcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7ICBcbiAgICAgICAgICAgICAgICBpICs9IDI7ICBcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgZWxzZSB7ICBcbiAgICAgICAgICAgICAgICBjMiA9IHQuY2hhckNvZGVBdChpKzEpOyAgXG4gICAgICAgICAgICAgICAgYzMgPSB0LmNoYXJDb2RlQXQoaSsyKTsgIFxuICAgICAgICAgICAgICAgIHMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKSk7ICBcbiAgICAgICAgICAgICAgICBpICs9IDM7ICBcbiAgICAgICAgICAgIH0gIFxuICBcbiAgICAgICAgfVxuLy9jb25zb2xlLmxvZyhcImNvbnZlcnQgXCIrdCtcIiA6IFwiK3MpO1xuXG4gICAgICAgIHJldHVybiBzOyAgXG4gICAgfSAgXG5cdFxuXHRmdW5jdGlvbiBkZWMocylcblx0e1xuXHRcdHZhciBzMj1cIlwiO1xuXHRcdGlmKHMpXG5cdFx0e1xuXHRcdFx0dHJ5XG5cdFx0XHR7XG5cdFx0XHRcdHMyPXMuc3BsaXQoXCIlMjZcIikuam9pbihcIiZcIikuc3BsaXQoXCIlM2RcIikuam9pbihcIj1cIikuc3BsaXQoXCIlMjVcIikuam9pbihcIiVcIik7XG5cdFx0XHRcdHMyPS8qZGVjX3V0ZjgqLyggczIgKTsgLy8gY29udmVydCBmcm9tIHV0ZjggPz8/XG4vL2NvbnNvbGUubG9nKFwiZGVjIFwiK3MrXCIgOiBcIitzMik7XG5cdFx0XHRcdHJldHVybiBzMjtcblx0XHRcdH1cblx0XHRcdGNhdGNoKGUpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gXCJcIjtcblx0fTtcblxuXHRzcGV3LnN0cl90b19tc2c9ZnVuY3Rpb24ocykgLy8gc3BsaXQgYSBxdWVyeSBsaWtlIHN0cmluZ1xuXHR7XG5cdHZhciBpO1xuXHRcdHZhciBtc2c9e307XG5cdFx0XG5cdFx0dmFyIGFhPXMuc3BsaXQoXCImXCIpO1xuXHRcdGZvcihpIGluIGFhKVxuXHRcdHtcblx0XHR2YXIgdj1hYVtpXTtcblx0XHRcdHZhciB2YT12LnNwbGl0KFwiPVwiKTtcblx0XHRcdG1zZ1tkZWModmFbMF0pXT1kZWModmFbMV0pO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gbXNnO1xuXHR9O1xuXHRcblx0c3Bldy5tc2dfdG9fc3RyPWZ1bmN0aW9uKG1zZykvLyBjcmVhdGUgYSBxdWVyeSBsaWtlIHN0cmluZ1xuXHR7XG5cdHZhciBpO1xuXHRcdHZhciBzPVwiJlwiO1xuXHRcdFxuXHRcdGZvcihpIGluIG1zZylcblx0XHR7XG5cdFx0dmFyIHY9bXNnW2ldO1xuXHRcdFx0XG5cdFx0XHRzPXMrZW5jKGkpK1wiPVwiK2VuYyh2KStcIiZcIjtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHM7XG5cdH07XG5cdFxuXHRzcGV3Lm1zZ191cGRhdGU9ZnVuY3Rpb24obXNnLG5ld21zZykgLy8gb3ZlcnJpZGUgZGF0YSB3aXRoIHRoYXQgaW4gdGhlIG5ldyBtc2dcblx0e1xuXHR2YXIgaTtcblx0XHRmb3IoaSBpbiBuZXdtc2cpXG5cdFx0e1xuXHRcdFx0bXNnW2ldPW5ld21zZ1tpXTtcblx0XHR9XG5cdFx0cmV0dXJuIG1zZztcblx0fTtcblxuXHRzcGV3LnNlbmRfZGF0YT1mdW5jdGlvbihzKSB7XG5cdC8vXHRcdGNvbnNvbGUubG9nKFwic2VuZFwiK3MpO1xuXHRcdGlmIChzcGV3LndzKSB7XG5cdFx0ICBzcGV3LndzLnNlbmQocyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdH1cblx0fTtcblx0ICBcbiAgICAgIHNwZXcuc2VuZF9tc2c9ZnVuY3Rpb24obSkge1xuXHRcdHNwZXcuc2VuZF9kYXRhKHNwZXcubXNnX3RvX3N0cihtKSk7XG5cdCAgfTtcblx0ICBcbiAgICAgIHNwZXcuY21kX3RvX21zZz1mdW5jdGlvbihzKSB7IC8vIGNvbnZlcnQgYSB0eXBlZCBpbiBjb21tYW5kIGludG8gYSBtc2dcblxuLy8gYWN0dWFsbHksIHNpbmNlIEkgaGFkIHRvIGFkZCB0aGUgZnVuY3Rpb25hbGl0eSBmb3IgdGVsbmV0IGNvbm5lY3Rpb25zIGFueXdheVxuLy8gd2Ugd2lsbCBjaGVhdCBmb3Igbm93IGFuZCBqdXN0IHNlbmQgaXQgYXMgYSBzdHJpbmcgYW5kIHRoZSBzZXJ2ZXIgd2lsbCBjb252ZXJ0IGl0IGZvciB1cy5cblxuXHRcdHZhciBtPXt9O1xuXHRcdG0uY21kPVwiY21kXCI7XG5cdFx0bS50eHQ9cztcblx0XHRcblx0XHRyZXR1cm4gbTtcdCAgXG5cdCAgfTtcblx0ICBcblx0ICBzcGV3Lm1zZ190b19odG1sPWZ1bmN0aW9uKG1zZyl7XG5cdFxuXHQgIHZhciBzO1xuXHQgIFxuXHQgIHZhciBjbWQ9bXNnLmNtZDtcblx0ICB2YXIgZnJtPW1zZy5mcm07IGlmKCFtc2cuZnJtKXttc2cuZnJtPVwiKlwiO31cblx0ICB2YXIgdHh0PW1zZy50eHQ7IGlmKCFtc2cudHh0KXttc2cudHh0PVwiKlwiO31cblx0ICBcblx0ICB0eHQ9c3Bldy5lc2NhcGVIVE1MKHR4dCk7IC8vIGVzY2FwZSBhbnkgdGV4dCBpbnB1dCB0byByZW1vdmUgaHRtbFxuXHQgIGlmKHdpbmRvdy5hbnNpX3VwKSAvLyBhbGxvdyBhbnNpIGVzY2FwZXM/XG5cdCAge1xuXHRcdHR4dD0gd2luZG93LmFuc2lfdXAuYW5zaV90b19odG1sKHR4dCk7XG5cdCAgfVxuXHQgIFxuXHQgIHZhciBmcm1sbms9XCI8YSB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgaHJlZj1cXFwiaHR0cDovL2xpa2Uud2V0Z2VuZXMuY29tLy0vcHJvZmlsZS9cIitmcm0rXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X25hbWVcXFwiID5cIitmcm0rXCI8L2E+XCJcblx0ICBcblx0XHRzd2l0Y2goY21kKVxuXHRcdHtcblx0XHRcdGNhc2UgXCJzYXlcIjpcblx0XHRcdFx0aWYoZnJtPT1cIipcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHM9XCIqXCIrdHh0K1wiKlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHM9XCI8aW1nIHNyYz1cXFwiaHR0cDovL3dldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIitmcm0rXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X2ljb25cXFwiIC8+XCIrZnJtbG5rK1wiOiBcIitzcGV3LmF1dG9IVE1MbGlua3ModHh0KTtcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgXCJhY3RcIjpcblx0XHRcdFx0cz1cIioqXCIrZnJtbG5rK1wiIFwiK3NwZXcuYXV0b0hUTUxsaW5rcyh0eHQpK1wiKipcIjtcblx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0XHRjYXNlIFwibXV4XCI6XG5cdFx0XHRcdHM9dHh0O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJsbmtcIjpcblx0XHRcdFx0aWYobXNnLmxuay5tYXRjaCgvKGpwZ3xwbmd8Z2lmfGpwZWcpJC8pKSAvLyBpdCBpcyBwcm9iYWJseSBhbiBpbWFnZSwgZW1iZWQgaXQgdmlhIGJvdW5jZXJcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHM9XCI8aW1nIHNyYz1cXFwiaHR0cDovL3dldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIitmcm0rXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X2ljb25cXFwiIC8+XCIrZnJtbG5rK1wiOiBcIitzcGV3LmF1dG9IVE1MaW1nKG1zZy5sbmspXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cz1cIjxhIGhyZWY9J1wiK21zZy5sbmsrXCInIHRhcmdldD0nX2JsYW5rJz4qKjxzcGFuIGNsYXNzPVxcXCJ3ZXRzcGV3X25hbWVcXFwiPlwiK2ZybStcIjwvc3Bhbj4gXCIrdHh0K1wiKio8L2E+XCI7XG5cdFx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0XHRjYXNlIFwibm90ZVwiOlxuXHRcdFx0XHR2YXIgbm90ZT1tc2cubm90ZTtcblx0XHRcdFx0dmFyIGExPW1zZy5hcmcxO1xuXHRcdFx0XHR2YXIgYTI9bXNnLmFyZzI7XG5cdFx0XHRcdHZhciBhMz1tc2cuYXJnMztcblx0XHRcdFx0c3dpdGNoKG5vdGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXNlIFwibmFtZVwiOlxuXHRcdFx0XHRcdFx0c3Bldy5uYW1lPWExO1xuXHRcdFx0XHRcdFx0c3Bldy5zaG93X3RhYihcImNoYXRcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcIm5vdGljZVwiOlxuXHRcdFx0XHRcdGNhc2UgXCJ3ZWxjb21lXCI6XG5cdFx0XHRcdFx0Y2FzZSBcIndhcm5pbmdcIjpcblx0XHRcdFx0XHRjYXNlIFwiZXJyb3JcIjpcblx0XHRcdFx0XHRcdHM9XCItPSBcIithMStcIiA9LVwiO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJhY3RcIjpcblx0XHRcdFx0XHRcdHM9XCItKiBcIithMStcIiAqLVwiO1xuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcImJhblwiOlxuXHRcdFx0XHRcdFx0cz1cIi09IFwiK2EyK1wiIGhhcyBiZWVuIGJhbm5lZCBieSBcIithMStcIiA9LVwiXG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0XHRjYXNlIFwiZ2FnXCI6XG5cdFx0XHRcdFx0XHRzPVwiLT0gXCIrYTIrXCIgaGFzIGJlZW4gZ2FnZ2VkIGJ5IFwiK2ExK1wiID0tXCJcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdGNhc2UgXCJkaXNcIjpcblx0XHRcdFx0XHRcdHM9XCItPSBcIithMitcIiBoYXMgYmVlbiBkaXNlbXZvd2VsZWQgYnkgXCIrYTErXCIgPS1cIlxuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0fVxuXHRcdGlmKHMpIHsgcz0nPHNwYW4gc3R5bGU9XCJjb2xvcjojJyttc2cucmdiKydcIj4nK3MrJzwvc3Bhbj4nOyB9XG5cdFx0cmV0dXJuIHM7XG5cdH07XG5cblx0c3Bldy5zb2NrX2NsZWFuPWZ1bmN0aW9uKCkgLy8gZGlzY29ubmVjdFxuXHR7XG5cdFx0c3Bldy53cy5jbG9zZSgpO1xuLy9cdFx0ZGVsZXRlIHNwZXcud3M7XG5cdH1cblxuXHRzcGV3LnNvY2tfc2V0dXA9ZnVuY3Rpb24oKSAvLyBjb25uZWN0XG5cdHtcblx0XHRzcGV3LndzPW5ldyBXZWJTb2NrZXQoc3Bldy5zZXJ2ZXJfYWRkcmVzcyk7XG5cdFx0XG5cdFx0c3Bldy53cy5vbm9wZW4gPSBmdW5jdGlvbigpIHtcblx0XHRcblx0XHRcdHNwZXcuZGlzcGxheV9ub3RlKFwiQ29uZ3JhdHVsYXRpb25zIHdlYnNvY2tldHMgYXJlIHdvcmtpbmcgYW5kIHlvdSBoYXZlIGNvbm5lY3RlZCB0byBcIitzcGV3LnNlcnZlcl9hZGRyZXNzKTtcblx0XHRcdHNwZXcuZGlzcGxheV9ub3RlKFwiWW91IHdpbGwgbmVlZCB0byAvTE9HSU4gTkFNRSBQQVNTIChubyBwYXNzd29yZCBuZWVkZWQgZm9yIGd1ZXN0IGxvZ2lucykuXCIpXG5cblx0XHRcdHZhciBoYXNoPXdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiI1wiKVsxXTsgLy8gYXV0byBjb25uZWN0IHRvIHRoaXMgcm9vbT9cblx0XHRcdGlmKHNwZXcub3B0cy5oYXNoKSB7IGhhc2g9c3Bldy5vcHRzLmhhc2g7IH0gLy8gb3ZlcmlkZVxuXHRcdFx0XG5cdFx0XHRzcGV3LnNlbmRfbXNnKHtjbWQ6XCJub3RlXCIsbm90ZTpcInBsYXlpbmdcIixhcmcxOlwid2V0dlwiLGFyZzI6XCJcIixhcmczOlwiXCIsYXJnNDpcIlwiLGhhc2g6aGFzaH0pO1xuXHRcdFx0XG5cdFx0XHRpZihzcGV3Lm9wdHNbXCJTXCJdKVxuXHRcdFx0e1xuXHRcdFx0XHRzcGV3LnNlbmRfbXNnKHtjbWQ6XCJzZXNzaW9uXCIsc2VzczpzcGV3Lm9wdHNbXCJTXCJdfSk7XG5cdFx0XHR9XG5cblxuLy9cdFx0XHRjb25zb2xlLmxvZyhcInNwZXcgb3BlblwiKTtcblx0XHR9O1xuXHRcdFxuXHRcdHNwZXcud3Mub25jbG9zZSA9IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFxuXHRcdFx0c3Bldy5kaXNwbGF5X25vdGUoXCJEaXNjb25uZWN0ZWQgZnJvbSBcIitzcGV3LnNlcnZlcl9hZGRyZXNzKTtcblx0XHRcdFxuXHRcdFx0c3Bldy53cyA9IG51bGw7XG5cdFx0XHRcbi8vXHRcdFx0Y29uc29sZS5sb2coXCJzcGV3IGNsb3NlXCIpO1xuXHRcdH07XG5cdFx0XG5cdFx0c3Bldy53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcblxuLy8gaXQgc2VlbXMgdGhhdCBzb21lIHRoaW5ncyBjYW4gYnJlYWsgdGhlIGZyYW1pbmcgY2F1c2luZyBhIFwiXCIgaW5zdGVhZCBvZiB2YWxpZCBkYXRhXG4vLyBzbyBhbGwgPjdiaXQgY2hhcnMgYXJlIGdldHRpbmcgc3RyaXBwZWQgc2VydmVyIHNpZGUgZm9yIG5vd1xuXHRcdFx0dmFyIGRhdCA9IGV2dC5kYXRhO1xuXHRcdFx0XG5cdFx0XHRpZihkYXQubGVuZ3RoPDEpIHsgcmV0dXJuOyB9IC8vIGlnbm9yZSBlbXB0eSBsaW5lc1xuXHRcdFx0XG4vL2NvbnNvbGUubG9nKGRhdCk7XG5cblx0XHRcdHNwZXcubXNnX3VwZGF0ZShtc2csc3Bldy5zdHJfdG9fbXNnKGRhdCkpO1xuXHRcdFx0XG5cdFx0XHRzcGV3LnJlY2VpdmVfbXNnKG1zZyk7XG5cdFx0XHRcblx0XHRcdHNwZXcuZGlzcGxheShzcGV3Lm1zZ190b19odG1sKG1zZykpO1xuXHRcdFx0XG5cdFx0fTtcblx0fTtcblxuXHQgc3Bldy5yZW1lbWJlcl9uYW1lPWZ1bmN0aW9uKG5hbWUpe1xuXHRcdFx0aWYoIXNwZXcudXNlcnNbbmFtZV0pXG5cdFx0XHR7XG5cdFx0XHRcdHNwZXcudXNlcnNbbmFtZV09e25hbWU6bmFtZX07XG5cdFx0XHR9XG5cdH07XG5cblx0c3Bldy5yZWNlaXZlX21zZz1mdW5jdGlvbihtc2cpe1xuXHRcdFxuXHQgIHZhciBjbWQ9bXNnLmNtZDtcbi8vIHJlbWVtYmVyIGV2ZXJ5IG5hbWUgd2Ugc2VlXG5cdFx0aWYobXNnLmZybSlcblx0XHR7XG5cdFx0XHRzcGV3LnJlbWVtYmVyX25hbWUobXNnLmZybSk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoKGNtZClcblx0XHR7XG5cdFx0XHRjYXNlIFwibm90ZVwiOlxuXHRcdFx0XHR2YXIgbm90ZT1tc2cubm90ZTtcblx0XHRcdFx0c3dpdGNoKG5vdGUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYXNlIFwiam9pblwiOlxuXHRcdFx0XHRcdFx0aWYobXNnLmFyZzEpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNwZXcucmVtZW1iZXJfbmFtZShtc2cuYXJnMSk7XG5cdFx0XHRcdFx0XHRcdGlmKCAobXNnLmFyZzIpICYmIChtc2cuYXJnMSE9XCIqXCIpIClcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHNwZXcudXNlcnNbbXNnLmFyZzFdLnJvb209bXNnLmFyZzI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwicm9vbXNcIjpcblx0XHRcdFx0XHRcdHZhciBhYT1tc2cubGlzdC5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0XHR2YXIgb3JkZXI9W107XG5cdFx0XHRcdFx0XHRmb3IoaSBpbiBhYSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dmFyIHY9YWFbaV07XG5cdFx0XHRcdFx0XHRcdHZhciBsPVwiXCI7XG5cdFx0XHRcdFx0XHRcdHZhciBhPXYuc3BsaXQoXCI6XCIpO1xuXHRcdFx0XHRcdFx0XHR2YXIgbmFtZT1hWzBdO1xuXHRcdFx0XHRcdFx0XHR2YXIgYmFzZW5hbWU9bmFtZS5zcGxpdChcIi5cIilbMF07XG5cdFx0XHRcdFx0XHRcdHZhciBjb3VudD1wYXJzZUludChhWzFdKTtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yPVwiZmZmXCI7XG5cblx0XHRcdFx0XHRcdFx0bCs9XCI8aW1nIHNyYz1cXFwiaHR0cDovL3dldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIitiYXNlbmFtZStcIlxcXCIgY2xhc3M9XFxcIndldHNwZXdfaWNvblxcXCIgLz5cIjtcblx0XHRcdFx0XHRcdFx0bCs9XCI8c3BhbiBjbGFzcz1cXFwid2V0c3Bld19jb3VudFxcXCI+XCIrY291bnQrXCI8L3NwYW4+XCI7XG5cdFx0XHRcdFx0XHRcdGwrPVwiPGEgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIGhyZWY9XFxcImh0dHA6Ly9saWtlLndldGdlbmVzLmNvbS8tL3Byb2ZpbGUvXCIrYmFzZW5hbWUrXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X25hbWVcXFwiPlwiK25hbWUrXCI8L2E+XCI7XG5cdFx0XHRcdFx0XHRcdGw9XCI8ZGl2IGNsYXNzPVxcXCJ3ZXRzcGV3X2xpbmVcXFwiIHN0eWxlPVxcXCJjb2xvcjojXCIrY29sb3IrXCJcXFwiPlwiK2wrXCI8L2Rpdj5cIjtcblx0XHRcdFx0XHRcdFx0b3JkZXJbb3JkZXIubGVuZ3RoXT17bDpsLG46Y291bnQsczpuYW1lfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG9yZGVyLnNvcnQoZnVuY3Rpb24oYSxiKXtpZihiLm49PWEubikgeyByZXR1cm4gKGIuczxhLnMpLShhLnM8Yi5zKTsgfSBlbHNlIHJldHVybiBiLm4tYS5uOyB9KTtcblx0XHRcdFx0XHRcdHNwZXcuZGl2X3Jvb21zLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRzcGV3LmRpdl9yb29tcy5hcHBlbmQoXCI8YSBjbGFzcz1cXFwic3Bld19jbGlja1xcXCIgdGl0bGU9XFxcImNoYXRcXFwiPlJldHVybiB0byBjaGF0LjwvYT5cIik7XG5cdFx0XHRcdFx0XHRmb3IoaSBpbiBvcmRlcilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dmFyIHY9b3JkZXJbaV07XG5cdFx0XHRcdFx0XHRcdHNwZXcuZGl2X3Jvb21zLmFwcGVuZCh2LmwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3Bldy5zaG93X3RhYihcInJvb21zXCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhc2UgXCJ1c2Vyc1wiOlxuXHRcdFx0XHRcdFx0dmFyIGFhPW1zZy5saXN0LnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRcdHZhciBvcmRlcj1bXTtcblx0XHRcdFx0XHRcdGZvcihpIGluIGFhKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR2YXIgdj1hYVtpXTtcblx0XHRcdFx0XHRcdFx0dmFyIGw9XCJcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGE9di5zcGxpdChcIjpcIik7XG5cdFx0XHRcdFx0XHRcdHZhciBuYW1lPWFbMF07XG5cdFx0XHRcdFx0XHRcdHZhciBnYW1lPWFbMV07XG5cdFx0XHRcdFx0XHRcdHZhciBnYW1laWQ9cGFyc2VJbnQoYVsyXSk7XG5cdFx0XHRcdFx0XHRcdHZhciBmb3JtPWFbM107XG5cdFx0XHRcdFx0XHRcdHZhciBsZXZlbD1wYXJzZUludChmb3JtLnN1YnN0cigxKSk7XG5cdFx0XHRcdFx0XHRcdHZhciBjb2xvcj1hWzRdO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0c3Bldy5yZW1lbWJlcl9uYW1lKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0bCs9XCI8aW1nIHNyYz1cXFwiaHR0cDovL3dldGdlbmVzLmNvbToxNDA4L2dlbmVzL2F2YXRhci9cIituYW1lK1wiXFxcIiBjbGFzcz1cXFwid2V0c3Bld19pY29uXFxcIiAvPlwiO1xuXHRcdFx0XHRcdFx0XHRsKz1cIjxzcGFuIGNsYXNzPVxcXCJ3ZXRzcGV3X2Zvcm1cXFwiPlwiK2Zvcm0rXCI8L3NwYW4+XCI7XG5cdFx0XHRcdFx0XHRcdGwrPVwiPGEgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiIGhyZWY9XFxcImh0dHA6Ly9saWtlLndldGdlbmVzLmNvbS8tL3Byb2ZpbGUvXCIrbmFtZStcIlxcXCIgY2xhc3M9XFxcIndldHNwZXdfbmFtZVxcXCI+XCIrbmFtZStcIjwvYT5cIjtcblx0XHRcdFx0XHRcdFx0bCs9XCI8YSB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgaHJlZj1cXFwiaHR0cDovL2xpa2Uud2V0Z2VuZXMuY29tLy0vZ2FtZS9cIitnYW1laWQrXCJcXFwiIGNsYXNzPVxcXCJ3ZXRzcGV3X2dhbWVuYW1lXFxcIj5cIitnYW1lK1wiPC9hPlwiO1xuXHRcdFx0XHRcdFx0XHRsPVwiPGRpdiBjbGFzcz1cXFwid2V0c3Bld19saW5lXFxcIiBzdHlsZT1cXFwiY29sb3I6I1wiK2NvbG9yK1wiXFxcIj5cIitsK1wiPC9kaXY+XCI7XG5cdFx0XHRcdFx0XHRcdG9yZGVyW29yZGVyLmxlbmd0aF09e2w6bCxuOmxldmVsLHM6bmFtZX07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvcmRlci5zb3J0KGZ1bmN0aW9uKGEsYil7aWYoYi5uPT1hLm4pIHsgcmV0dXJuIChiLnM8YS5zKS0oYS5zPGIucyk7IH0gZWxzZSByZXR1cm4gYi5uLWEubjsgfSk7XG5cdFx0XHRcdFx0XHRzcGV3LmRpdl91c2Vycy5lbXB0eSgpO1xuLy9cdFx0XHRcdFx0XHRzcGV3LmRpdl91c2Vycy5hcHBlbmQoXCJZb3UgYXJlIGluIHJvb20sIFwiK3Jvb21uYW1lKTtcblx0XHRcdFx0XHRcdHNwZXcuZGl2X3VzZXJzLmFwcGVuZChcIjxhIGNsYXNzPVxcXCJzcGV3X2NsaWNrXFxcIiB0aXRsZT1cXFwiY2hhdFxcXCI+UmV0dXJuIHRvIGNoYXQuPC9hPlwiKTtcblx0XHRcdFx0XHRcdGZvcihpIGluIG9yZGVyKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR2YXIgdj1vcmRlcltpXTtcblx0XHRcdFx0XHRcdFx0c3Bldy5kaXZfdXNlcnMuYXBwZW5kKHYubCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzcGV3LnNob3dfdGFiKFwidXNlcnNcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FzZSBcImluZm9cIjpcblx0XHRcdFx0XHRcdGlmKG1zZy5pbmZvPT1cInVzZXJcIilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dmFyIG5hbWU9bXNnLm5hbWU7IC8vIHRoaXMgc2hvdWxkIGJlIHRoZSBuYW1lXG5cdFx0XHRcdFx0XHRcdHZhciB1PXNwZXcudXNlcnNbbmFtZV07XG5cdFx0XHRcdFx0XHRcdGlmKHUpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaXQ9dS5uYW1lc3BhbjsgLy8gdGhpcyBpcyB0aGUgb25lIHdlIHdhbnQgdG8gdXBkYXRlXG5cdFx0XHRcdFx0XHRcdFx0aWYoaXQpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYobXNnLnN0YXQhPVwiLVwiKSAvLyBnb3QgaW5mb1xuXHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgdD0obmV3IERhdGUobXNnLmpvaW5lZCoxMDAwKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBzPShtc2cubmFtZStcIiBcIittc2cuc3RhdCtcIiBwbGF5aW5nIFwiK21zZy5nYW1lbmFtZStcIiBzaW5jZSBcIit0LmdldEZ1bGxZZWFyKCkrXCIvXCIrKDErdC5nZXRNb250aCgpKStcIi9cIit0LmdldERhdGUoKStcIlwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aXQuYXR0cihcInRpdGxlXCIscyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBzPShtc2cubmFtZStcIiAob2ZmbGluZSlcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGl0LmF0dHIoXCJ0aXRsZVwiLHMpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRpZihtc2cuY21kPT1cImdhbWVcIilcblx0XHR7XG5cdFx0XHRzcGV3Lm9uX21zZ19nYW1lKG1zZyk7XG5cdFx0fVxuXHRcdFxuXHR9O1xuXHRcdFxuXG5cdHNwZXcub25fbXNnX2dhbWU9ZnVuY3Rpb24obXNnKXtcblx0XG5cdFx0aWYobXNnLmdjbWQ9PVwid2V0dlwiKVxuXHRcdHtcblx0XHRcdHNwZXcub25fbXNnX2dhbWVfd2V0dihtc2cpO1xuXHRcdH1cblx0fVxuXHRcblx0c3Bldy5vbl9tc2dfZ2FtZV93ZXR2PWZ1bmN0aW9uKG1zZyl7XG5cdFx0aWYobXNnLndldHY9PVwicGxheVwiKVxuXHRcdHtcblx0XHRcdHZhciBwPW1zZy5wbGF5O1xuXHRcdFx0dmFyIGFhPW1zZy5wbGF5LnNwbGl0KFwiLFwiKVxuXHRcdFx0dmFyIHZpZD1hYVswXTtcblx0XHRcdHZhciBudW09cGFyc2VJbnQoYWFbMV0pO1xuXG4vL1x0XHRcdGlmKHNwZXcueXRhcGlfcmVhZHkpXG4vL1x0XHRcdHtcbi8vXHRcdFx0XHRzcGV3Lnl0YXBpLmxvYWRWaWRlb0J5SWQodmlkLG51bSk7XG4vL1x0XHRcdH1cbi8vXHRcdFx0ZWxzZVxuLy9cdFx0XHR7XG5cdFx0XHRcdHNwZXcubmV4dHF2aWQ9e3ZpZDp2aWQsbnVtOm51bX07XG4vL1x0XHRcdH1cblx0XHR9XG5cdH1cblxufTtcbiJdfQ==
