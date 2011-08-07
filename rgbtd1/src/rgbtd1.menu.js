
(function(game){
	
	var us={}
	game.menu=us;
	
	us.menu_base=[
		{text:"..."},
		{text:"rotate shape",
			hover_on:function(it){
				var m=[];
				for(var i=0;i<4;i++)
				{
					m.push(us.build_menudata_shape(us.block_id,i))
				}
				us.show(m);
			}/*,
			update:function(it){
				var r=us.get_rotation();
				var count=4;
				r=0.5*r/Math.PI; // 0 to <1
				r=r*count; // 0 to <count
				r=r+0.5; if(r>=count){r=r-count;} // recenter
				us.block_rot=Math.floor(r);
			}*/
		},
		{text:"change shape",
			hover_on:function(it){
				var m=[];
 				for(var i=0;i<6;i++)
				{
					m.push(us.build_menudata_shape(i,us.block_rot))
				}
/*
				m.push(us.build_menudata_shape(0,0))
				m.push(us.build_menudata_shape(1,0))
				m.push(us.build_menudata_shape(1,1))
				m.push(us.build_menudata_shape(2,0))
				m.push(us.build_menudata_shape(2,1))
				m.push(us.build_menudata_shape(2,2))
				m.push(us.build_menudata_shape(2,3))
				m.push(us.build_menudata_shape(3,0))
				m.push(us.build_menudata_shape(3,1))
				m.push(us.build_menudata_shape(3,2))
				m.push(us.build_menudata_shape(3,3))
				m.push(us.build_menudata_shape(4,0))
				m.push(us.build_menudata_shape(4,1))
				m.push(us.build_menudata_shape(4,2))
				m.push(us.build_menudata_shape(4,3))
				m.push(us.build_menudata_shape(5,0))
				m.push(us.build_menudata_shape(5,1))
				m.push(us.build_menudata_shape(5,2))
				m.push(us.build_menudata_shape(5,3))
*/
				us.show(m);
			}/*,
			update:function(it){
				var r=us.get_rotation();
				var count=6;
				r=0.5*r/Math.PI; // 0 to <1
				r=r*count; // 0 to <count
				r=r+0.5; if(r>=count){r=r-count;} // recenter
				us.block_id=Math.floor(r);
			}*/
		},
		{text:"help"}
	];
	
	us.block_id=2;
	us.block_rot=0;
	
	us.active=null; // the active menu item
	
	us.setup=function()
	{
		us.data=[];
		us.state="none";
		us.menu=us.menu_base;
		//[{text:"one"},{text:"two"},{text:"three"},{text:"four"},{text:"five"}];
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:640,sy:480});
		us.block=gamecake.gfx.sheet({parent:us.sheet,px:0,py:0,fx:0,fy:0,sx:160,sy:160,url:gamecake.images.blocks.url});
	};

	us.clean=function()
	{
	};

	us.draw=function()
	{
		us.sheet.draw();
		for(var i=0;i<us.data.length;i++)
		{
			var t=us.data[i];
			if(t.sheet)
			{
				t.sheet.draw();
			}
		}
		us.block.draw();
	};

	us.update=function()
	{
		us.sheet.update();
		
//		var s=gamecake.input.x+" : "+gamecake.input.y;
//		var r=gamecake.gfx.text_size(s);
//		s=s+" : "+r.w+" : "+r.h;
//		us.sheet_text.set(s);
		if(gamecake.input.down["button"])
		{
			if(us.state=="none")
			{
				us.state="wait";
				us.start_ticks=gamecake.ticks;
				us.start_x=gamecake.input.x;
				us.start_y=gamecake.input.y;
			}
		}
		
		if(gamecake.input.up["button"])
		{
			if(us.state=="wait")
			{
				us.state="none";
// add block				
				var bi=game.cells.get_block_rotated(game.menu.block_id,game.menu.block_rot);
				var c=game.cells.get(gamecake.input.x/16,gamecake.input.y/16)
				game.cells.draw_block(bi,c.x,c.y);
			}
			else
			if(us.state=="menu")
			{
				if(us.active)
				{
					if(us.active.click)
					{
						us.active.click(us.active);
					}
					us.active=null;
				}
				us.hide();
			}
			else
			if(us.state=="drag")
			{
				us.state="none";
			}
			else
			{
				if(us.active)
				{
					if(us.active.hover_off)
					{
						us.active.hover_off(us.active);
					}
					us.active=null;
				}
			}
		}
		
		if(us.state=="wait")
		{
			var t=gamecake.ticks-us.start_ticks;
			if(t>10)
			{
				us.show(us.menu_base);
			}
			else
			{
				var rx=gamecake.input.x-us.start_x;
				var ry=-(gamecake.input.y-us.start_y);
				if( (rx*rx)+(ry*ry) > 4*4 )
				{
					us.state="drag";
				}
			}
		}

		if(us.state=="menu")
		{
			var r=us.get_rotation();
			
			var choose=null;
			
			for(var i=0;i<us.data.length;i++)
			{
				var t=us.data[i];

				if(!choose) // find first one only
				{
					if(r<t.rmax) // must be less than max
					{
						choose=t;
					}
				}
				
				if(t.sheet)
				{
					t.sheet.px=us.start_x+(t.rx*100);
					t.sheet.py=us.start_y+(t.ry*50);
					t.sheet.opacity=0.5;
					t.sheet.update();
				}
			}
			if(choose==null) { choose=us.data[0]; }
			if(choose.sheet)
			{
				choose.sheet.px=us.start_x;
				choose.sheet.py=us.start_y;
				choose.sheet.opacity=1;
				choose.sheet.update();
			}

			if(us.active!=choose)
			{
				if(us.active)
				{
					if(us.active.hover_off)
					{
						us.active.hover_off(us.active);
					}
				}
				us.active=choose;
				if(us.active.hover_on)
				{
					us.active.hover_on(us.active);
				}
			}

			us.block.opacity=0;
			us.block.update();
		}
		else
		{
			for(var i=0;i<gamecake.input.ascii.length;i++)
			{
				switch(gamecake.input.ascii[i])
				{
					case 49: // 1
						us.block_id=0;
					break;
					case 50: // 2
						us.block_id=1;
					break;
					case 51: // 3
						us.block_id=2;
					break;
					case 52: // 4
						us.block_id=3;
					break;
					case 53: // 5
						us.block_id=4;
					break;
					case 54: // 6
						us.block_id=5;
					break;
					case 55: // 7
					break;
					case 56: // 8
					break;
					case 57: // 9
						us.block_rot=(us.block_rot+3)%4;
					break;
					case 48: // 0
						us.block_rot=(us.block_rot+1)%4;
					break;
				}
			}
			
			var id=game.cells.get_block_rotated(us.block_id,us.block_rot);
			var d=game.cells.get_block_pixels(id);
			us.block.fx=d[0];
			us.block.fy=d[1];
			us.block.sx=d[2];
			us.block.sy=d[3];
			
			var x,y;
			if(us.active)
			{
				x=us.start_x;
				y=us.start_y;
			}
			else
			{
				x=gamecake.input.x;
				y=gamecake.input.y;
			}
			x=x-d[4];//(d[2]/2);
			y=y-d[5];//(d[3]/2);
			us.block.px=Math.floor(x/16)*16;
			us.block.py=Math.floor(y/16)*16;
			us.block.opacity=0.75;
			us.block.update();
		}
		
		if(us.active)
		{
			if(us.active.update)
			{
				us.active.update(us.active);
			}
		}
	};
	
	us.show=function(menu)
	{
		if(us.state=="menu"){us.hide();} // auto hide any old menu first
		
		us.state="menu";
		if(menu) { us.menu=menu; }
		
		for(var i=0;i<us.menu.length;i++)
		{
			var v=us.menu[i]
			us.show_item(v);
		}
//		us.show_item_shape(0,0);
		var r=360/us.data.length;
		var rr=0;
		
			for(var i=0;i<us.data.length;i++)
			{
				var t=us.data[i];
				t.r=rr*Math.PI/180;
				t.rmin=t.r-(r/2)*(Math.PI/180);
				t.rmax=t.r+(r/2)*(Math.PI/180);
				
				t.rx= Math.sin(t.r);
				t.ry=-Math.cos(t.r);
				
				rr+=r;
				
				if(t.sheet)
				{
					t.sheet.px=us.start_x+(t.rx*100);
					t.sheet.py=us.start_y+(t.ry*50);
				}
			}
		};
	
	us.show_item=function(menudata)
	{
		var it={}
		if(menudata.text) // text display
		{
			var r=gamecake.gfx.text_size(menudata.text);
			it.sheet=gamecake.gfx.text({parent:us.sheet,ox:(r.w/2)+4,oy:(r.h/2)+4,px:0,py:0,sx:r.w,sy:r.h,style:{color:"#fff",background:"#000",border:"8px solid #000",borderRadius:"8px"},opacity:0.5});
			it.sheet.set(menudata.text);
			it.sheet.update();
		}
		else
		if(menudata.sheet) // sheet display
		{
			var v=menudata.sheet;
			it.sheet=gamecake.gfx.sheet({parent:us.sheet,ox:v.ox,oy:v.oy,fx:v.fx,fy:v.fy,px:0,py:0,sx:v.sx,sy:v.sy,url:v.url,style:v.style,opacity:0.5});
			it.sheet.update();
		}
		us.data.push(it);
// copy callbacks		
		it.update=menudata.update;
		it.click=menudata.click;
		it.hover_on=menudata.hover_on;
		it.hover_off=menudata.hover_off;
		return it
	};

	us.build_menudata_shape=function(id,rot)
	{
		var md={};
		var ms={};
		
		md.sheet=ms;
		
		var bi=game.cells.get_block_rotated(id,rot);
		var bd=game.cells.get_block_pixels(bi);
		
		ms.url=gamecake.images.blocks.url;
		ms.fx=bd[0];
		ms.fy=bd[1];
		ms.sx=bd[2];
		ms.sy=bd[3];
		ms.ox=ms.sx/2;
		ms.oy=ms.sy/2;
//		ms.style={color:"#fff",background:"#000",border:"8px solid #000",borderRadius:"8px"};

		md.click=function(it)
		{
			us.block_id=id;
			us.block_rot=rot;
		};
			
		return md;
	};

	us.hide=function()
	{
		if(us.active)
		{
			if(us.active.hover_off)
			{
				us.active.hover_off(us.active);
			}
			us.active=null;
		}
		us.state="none";
		for(var i=0;i<us.data.length;i++)
		{
			var v=us.data[i];
			if(v.sheet)
			{
				v.sheet.clean();
			}
		}
		us.data=[];
	};

// get the current rotation (radians) around the last click point, 0 is up and it goes clockwise
	us.get_rotation=function()
	{
			var rx=gamecake.input.x-us.start_x;
			var ry=-(gamecake.input.y-us.start_y);
			var r=Math.atan2(rx,ry);
			if(r<0) { r+=Math.PI*2; }
			if( (rx*rx)+(ry*ry) < 4*4 )
			{
				r=0;
			}
			return r;
	};

})(rgbtd1);
