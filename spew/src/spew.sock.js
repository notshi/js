
	var msg={}; // our base of comunications, new msgs are deltas on this object



// javascript is a bit crap at utf8, so we use these escapes
	function enc(s)
	{
		var s2="";
		if(s)
		{
			try
			{
				s2=unescape( encodeURIComponent( s ) ); // force into utf8 ??
				s2=s2.split("%").join("%25").split("=").join("%3d").split("&").join("%26");
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
				s2=dec_utf8( s2 ); // convert from utf8 ???
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
					s="<img src=\"http://like.wetgenes.com/-/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLlinks(txt);
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
					s="<img src=\"http://like.wetgenes.com/-/avatar/"+frm+"\" class=\"wetspew_icon\" />"+frmlnk+": "+spew.autoHTMLimg(msg.lnk);
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
			if(!users[name])
			{
				users[name]={name:name};
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
								users[msg.arg1].room=msg.arg2;
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

							l+="<img src=\"http://like.wetgenes.com/-/avatar/"+basename+"\" class=\"wetspew_icon\" />";
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
							
							l+="<img src=\"http://like.wetgenes.com/-/avatar/"+name+"\" class=\"wetspew_icon\" />";
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
							var u=users[name];
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
