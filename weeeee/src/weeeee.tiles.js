
(function(game){
	
	var us={}
	game.tiles=us;
	
	us.t=[];
	
	us.tile=null;
	us.block=null;
	
	us.get_next_tile=function()
	{
		var ts={
			flat_lft:{
				floor:100,
				side:50,
				url:gamecake.images.tlft.url
			},
			flat_mid:{
				floor:100,
				side:0,
				url:gamecake.images.tmid.url
			},
			flat_rgt:{
				floor:100,
				side:-50,
				url:gamecake.images.trgt.url
			},
			space:{
				url:null
			}
		};
		
		var b=us.block;		
		if( (!b) || (b.idx>=b.wide) )
		{
			b=us.get_next_block();
		}
		
		var t={};
		
		switch(b.state)
		{
			case "flat":
				if(b.idx==0) // first
				{
					t.s=ts.flat_lft;
					t.y=b.top;
				}
				else
				if(b.idx==b.wide-1) // last
				{
					t.s=ts.flat_rgt;
					t.y=b.top;
				}
				else // middle
				{
					t.s=ts.flat_mid;
					t.y=b.top;
				}
			break;
		}
		b.idx++;
		us.tile=t;
		return t;
	}
	
	us.get_next_block=function()
	{
		var b={};
			
		if(us.block)
		{
			b.idx=0;
			b.top=200+(Math.random()*200);
			b.wide=10;
			b.state="flat";
		}
		else
		{
			b.idx=0;
			b.top=200;
			b.wide=10;
			b.state="flat";
		}
		us.block=b;
		return b;
	}
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		us.tile=null;
		us.block=null;
	
		for(i=0;i<8;i++)
		{
			us.get_next_tile();
			
			us.t[i]=gamecake.gfx.sheet({parent:us.sheet,sx:100,sy:480,url:us.tile.s.url,px:i*100,py:us.tile.y-us.tile.s.floor}).draw();
			us.t[i].tile=us.tile;
		}
	};

	us.clean=function()
	{
		for(i=0;i<8;i++)
		{
			us.t[i].clean();
		}
	};

	us.draw=function()
	{
		for(i=0;i<8;i++)
		{
			us.t[i].draw();
		}
	};

	us.update=function(speed)
	{		
		for(i=0;i<8;i++)
		{
			us.t[i].px-=speed;
			if(us.t[i].px<-100)
			{
				us.t[i].px+=800;
				
// we expect speed to be < 100 so only one tile a frame ever jumps like this
			
				us.get_next_tile();
				
				us.t[i].tile=us.tile;
				us.t[i].url=us.tile.s.url;
				us.t[i].py=us.tile.y-us.tile.s.floor;

			}
			us.t[i].update();
		}
	};

// given a y, find a tile
	us.find_tile=function(x)
	{
		for(i=0;i<8;i++)
		{
			var v=us.t[i];
			if( (v.px<=x) && (v.px+100>=x) )
			{
				return v;
			}
		}
		return null;
	}

})(weeeee);
