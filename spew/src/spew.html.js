


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

	spew.setup=function(opts)
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
						for( n in users )
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
		$('.wetspew_name').live("mouseenter",function(){
				var name=$(this).data("name");
				if(!name){ name=$(this).html(); } // this should be the name
				
				var u=users[name];
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
		$('.wetspew_name').live("mouseleave",function(){
				var name=$(this).data("name");
				if(!name){ name=$(this).html(); } // this should be the name
				var u=users[name];
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
//console.log(spew.ytapi_count);
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
						videoId: 'ILN7jTJdn5U',
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
				if(spew.ytapi.setSize && !spew.ytapi_ready )
				{
					spew.ytapi_ready=true;
	//				spew.ytapi.setSize(640,480);
	//				spew.ytapi.loadVideoById("ylLzyHk54Z0");
					if(spew.nextqvid)
					{
						spew.ytapi.loadVideoById(spew.nextqvid.vid,spew.nextqvid.num);
					}
					spew.nextqvid=undefined;
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

