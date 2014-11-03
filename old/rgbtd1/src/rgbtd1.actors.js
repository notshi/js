
(function(game){
	
	var us={}
	game.actors=us;
	
	var p_lft=function(p)
	{
		var r=[];
		if(p[0]>0) { r[0]= 0; r[1]= 1; } else
		if(p[0]<0) { r[0]= 0; r[1]=-1; } else
		if(p[1]>0) { r[0]=-1; r[1]= 0; } else
		if(p[1]<0) { r[0]= 1; r[1]= 0; }
		return r;
	}
	var p_rgt=function(p)
	{
		var r=[];
		if(p[0]>0) { r[0]= 0; r[1]=-1; } else
		if(p[0]<0) { r[0]= 0; r[1]= 1; } else
		if(p[1]>0) { r[0]= 1; r[1]= 0; } else
		if(p[1]<0) { r[0]=-1; r[1]= 0; }
		return r;
	}
	
	us.setup=function()
	{
		var x,y;
		
		us.data=[];
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:640,sy:480});
	};

	us.clean=function()
	{
		var i;
		for(i=0;i<us.data.length;i++)
		{
			var c=us.data[i];
			c.clean(c);
		}
	};

	us.draw=function()
	{
		us.sheet.draw();
		var i;
		for(i=0;i<us.data.length;i++)
		{
			var c=us.data[i];
			c.draw(c);
		}
	};

	us.update=function()
	{
		us.sheet.update();
		var i;
		for(i=0;i<us.data.length;i++)
		{
			var c=us.data[i];
			c.update(c);
			if(c.deleteme)
			{
				us.data.splice(i,1);
				c.clean();
				i--;
			}
		}
	};
	
	var pxl_clean=function(c)
	{
	};
	var pxl_draw=function(c)
	{
		if(c.sheet)
		{
			c.sheet.draw();
		}
	};
	var pxl_update=function(c)
	{
		if(!c.sheet)
		{
			c.sheet=gamecake.gfx.sheet({parent:us.sheet,px:c.px,py:c.py,sx:16,sy:16,fx:16*2,fy:16*1,url:gamecake.images.blocks.url});
		}
		var cx=c.vx;
		var cy=c.vy;
		if(cx>0) {cx=16;}
		if(cy>0) {cy=16;}
		cx=Math.floor((cx+c.px)/16);
		cy=Math.floor((cy+c.py)/16);
		var cell=game.cells.get(cx,cy);
		if( cell.state!="none")
		{
			var r;
			var c1;
			
			if(c.type=="lft")
			{
				r=p_lft([c.vx,c.vy]);
				c1=game.cells.get( (c.px/16)+r[0] , (c.py/16)+r[1] );
				if(c1.state!="none")
				{
					r=p_rgt([c.vx,c.vy]);
					c1=game.cells.get( (c.px/16)+r[0] , (c.py/16)+r[1] );
					if(c1.state!="none")
					{
						r[0]=-c.vx; // backwards
						r[1]=-c.vy;
					}
				}
				else
				{
					c.type="rgt";
				}
			}
			else
			{
				r=p_rgt([c.vx,c.vy]);
				c1=game.cells.get( (c.px/16)+r[0] , (c.py/16)+r[1] );
				if(c1.state!="none")
				{
					r=p_lft([c.vx,c.vy]);
					c1=game.cells.get( (c.px/16)+r[0] , (c.py/16)+r[1] );
					if(c1.state!="none")
					{
						r[0]=-c.vx; // backwards
						r[1]=-c.vy;
					}
				}
				else
				{
					c.type="lft";
				}
			}
			c.vx=r[0];
			c.vy=r[1];
		}
		else
		{
			c.px+=c.vx;
			c.py+=c.vy;
			c.cell=cell;
		}
		if(c.sheet)
		{
			c.sheet.px=c.px;
			c.sheet.py=c.py;
			c.sheet.update();
		}
	};
	
	var pxl_setup=function(cx,cy,type)
	{
		var c={}
		c.type=type;
		c.vx=1;
		c.vy=0;
		c.cx=cx;
		c.cy=cy;
		c.px=(cx*16);
		c.py=(cy*16);
		c.clean=pxl_clean;
		c.draw=pxl_draw;
		c.update=pxl_update;
		return c;
	};

	us.add_pxl=function(cx,cy,type)
	{
		var c=pxl_setup(cx,cy,type);
		us.data[us.data.length]=c;
	};


})(rgbtd1);
