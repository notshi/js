
(function(game){
	
	var us={}
	game.cells=us;
	
	var map_blocks=	[ // the solid blocks
	
					[  5, 1 ,  6, 1 ,  6, 2 ,  5, 2 ],
					
					[  2, 2 ,  2, 1 ,  2, 3 ,  2, 4 ],					
					[  5, 4 ,  4, 4 ,  6, 4 ,  7, 4 ],
					
					[  2, 7 ,  2, 6 ,  2, 8 ,  3, 8 ],
					[  6, 7 ,  6, 6 ,  6, 8 ,  5, 8 ],					
					[  3,11 ,  3,10 ,  2,10 ,  3,12 ],
					[  5,11 ,  5,10 ,  6,10 ,  5,12 ],
					
					[  2,14 ,  3,14 ,  1,14 ,  1,15 ],
					[  6,14 ,  5,14 ,  7,14 ,  7,15 ],
					[  2,18 ,  1,17 ,  1,18 ,  3,18 ],
					[  6,18 ,  7,17 ,  7,18 ,  5,18 ],
					
					[  2,21 ,  2,20 ,  1,21 ,  3,21 ],
					[  6,20 ,  5,20 ,  7,20 ,  6,21 ],
					[  3,24 ,  3,23 ,  2,24 ,  3,25 ],
					[  5,24 ,  5,23 ,  6,24 ,  5,25 ],
					
					[  3,28 ,  3,27 ,  2,28 ,  2,29 ],
					[  5,28 ,  5,27 ,  6,28 ,  6,29 ],
					[  2,32 ,  1,32 ,  2,31 ,  3,31 ],
					[  6,31 ,  5,31 ,  6,32 ,  7,32 ]
					
					];
					
	var map_pixels=	[]; // the solid pixels, auto build from above +1 cell border
	

	var block_groups=[ // the rotated groups of 6-7 distinct shapes
	
						[0,0,0,0],
						[1,2,1,2],
						[3,7,5,10],
						[4,9,6,8],
						[11,14,12,13],
						[17,16,18,15]
	
					];




	us.setup=function(hx,hy)
	{
		var x,y;
		
// build block image data from solid parts	
		for(var i=0;i<map_blocks.length;i++)
		{
			var minx=255;
			var maxx=0;
			var miny=255;
			var maxy=0;
			var v=map_blocks[i];
			var ox=v[0];
			var oy=v[1];
			for(var j=0;j<8;j+=2)
			{
				var x=v[j];
				var y=v[j+1];
				if(x<minx) { minx=x; }
				if(x>maxx) { maxx=x; }
				if(y<miny) { miny=y; }
				if(y>maxy) { maxy=y; }
			}
			ox=(ox-(minx-1))*16;
			oy=(oy-(miny-1))*16;
			minx=(minx-1)*16;
			miny=(miny-1)*16;
			maxx=(maxx+1)*16;
			maxy=(maxy+1)*16;
			map_pixels[i]=[minx,miny,maxx-minx,maxy-miny,ox,oy];
		}
	
		us.data=[];
		us.hx=hx;
		us.hy=hy;
		
		for(y=0;y<hy;y++)
		{
			for(x=0;x<hx;x++)
			{
				var c={};
				
				var idx=x+y*us.hx;
				us.data[idx]=c;
				c.x=x;
				c.y=y;
				c.idx=idx;
				c.state="none";
				
				if( x==0 || y==0 || x==hx-1 || y==hy-1)
				{
					c.state="wall";
				}
			}
		}
		
		for(i=0;i<32;i++)
		{
			var x=Math.floor(Math.random()*us.hx);
			var y=Math.floor(Math.random()*us.hy);
			var c=us.data[x+y*us.hx];
			c.state="wall";
		}
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:us.hx*16,sy:us.hy*16});

	};

	us.clean=function()
	{
	};

	us.draw=function()
	{
		us.sheet.draw();
		var i;
		for(i=0;i<us.hy*us.hx;i++)
		{
			var c=us.data[i];
			if(c.sheet)
			{
				c.sheet.draw();
			}
		}
	};

	us.update=function()
	{
		us.sheet.update();
		var i;
		for(i=0;i<us.hy*us.hx;i++)
		{
			var c=us.data[i];
			if(c.state=="none")
			{
				if(c.sheet)
				{
					c.sheet.clean();
					c.sheet=undefined;
				}
			}
			else
			if(c.state=="wall")
			{
				if(!c.sheet)
				{
					c.sheet=gamecake.gfx.sheet({parent:us.sheet,px:c.x*16,py:c.y*16,sx:16,sy:16,fx:16*2,fy:16*6,url:gamecake.images.blocks.url});
				}
			}
			else
			if(c.state=="block")
			{
				if(c.parent==c.idx) // master cell
				{
					if(!c.sheet)
					{
						var b=us.get_block_pixels(c.block);

						var opts={parent:us.sheet,px:c.x*16,py:c.y*16,sx:16,sy:16,fx:16*2,fy:16*6,url:gamecake.images.blocks.url};
						opts.fx=b[0];
						opts.fy=b[1];
						opts.sx=b[2];
						opts.sy=b[3];
						opts.px-=b[4];
						opts.py-=b[5];
						c.sheet=gamecake.gfx.sheet(opts);
					}
				}
			}
			
			if(c.sheet)
			{
				c.sheet.update();
			}
		}
	};

	us.test_block=function(id,cx,cy)
	{
		var blk=map_blocks[id];		
		var bx=blk[0];
		var by=blk[1];
		for(var i=0;i<8;i+=2)
		{
			var x=cx+(blk[i+0]-bx);
			var y=cy+(blk[i+1]-by);
			var c=us.get(x,y);
			
			if(c.state!="none"){ return false; }
		}
		return true;
	};
	
	us.draw_block=function(id,cx,cy) // may fail
	{
		if(cx<0) { cx=0; }
		if(cx>=us.hx) { cx=us.hx-1; }
		if(cy<0) { cy=0; }
		if(cy>=us.hy) { cy=us.hy-1; }
		var base_idx=cx+cy*us.hx;

		if(!us.test_block(id,cx,cy)) { return false; }
		var blk=map_blocks[id];
		var bx=blk[0];
		var by=blk[1];
		for(var i=0;i<8;i+=2)
		{
			var x=cx+(blk[i+0]-bx);
			var y=cy+(blk[i+1]-by);
			
			if(x<0) { x=0; }
			if(x>=us.hx) { x=us.hx-1; }
			if(y<0) { y=0; }
			if(y>=us.hy) { y=us.hy-1; }
			var idx=x+y*us.hx;
			var c=us.data[idx];
			
			c.parent=base_idx;
			c.block=id;
			c.state="block";
		}
		return true;
	};
	
	us.get=function(cx,cy)
	{
		if(cx<0) { cx=0; }
		if(cx>=us.hx) { cx=us.hx-1; }
		if(cy<0) { cy=0; }
		if(cy>=us.hy) { cy=us.hy-1; }

		var c=us.data[Math.floor(cx)+Math.floor(cy)*us.hx];
		
		return c;
	};
	
	us.get_by_idx=function(idx)
	{
		return us.data[idx];
	};

	us.get_block=function(id)
	{
		return map_blocks[id];
	};
	
	us.get_block_pixels=function(id)
	{
		return map_pixels[id];
	};

	us.get_block_rotated=function(id,rot)
	{
		return block_groups[id][rot];
	};

})(rgbtd1);
