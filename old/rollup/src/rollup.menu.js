
(function(game){
	
	var us={}
	game.menu=us;
	
	us.setup=function()
	{
		us.data=[];
		us.state="none";
		
		us.sheet_readme=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height,name:"readme"});
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height});
		
		for(var t in game.ds )
		{
			var d=game.ds[t];
			var py=(game.opts.height-40)/2;
			var w=(game.opts.width/game.ds.length);
			var px=t*w;
			px=px+((w-40)/2);
			var it=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:px,py:py,sx:100,sy:100,sz:0.40,opacity:1,name:"d"+d});
			it.fx=100*(d-1);
			us["sheet_but"+d]=it;
		}
		
		us.sheet_menu=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height,name:"menu"});
				
	};

	us.clean=function()
	{
		us.sheet.clean();
	};

	us.draw=function()
	{
		us.sheet_readme.draw();
		us.sheet.draw();
//		us.sheet_but.draw();
	};

	var idx=1;
	us.update=function()
	{
		idx=idx+1;
		if(idx>65536) { idx=1; }

		if(game.dice.grab_menu)
		{
			us.cmd=null;
				
			var d=game.dice.grab;
			
			
			if(gamecake.input.y>(game.opts.height-50))
			{
				us.cmd="clear";
			}
			else
			if(gamecake.input.y<(50))
			{
				us.cmd="delete";
			}
			
			var x=Math.floor(gamecake.input.x/(game.opts.width/7));
			
			if(x<0) { x=0; }
			if(x>6) { x=6; }
			
			d.numsides=game.ds[x]; // change die
			
			us.sheet.opacity=1;
			
			for(var t in game.ds )
			{
				var d=game.ds[t];
				var it=us["sheet_but"+d];

				if(d==game.dice.grab.numsides)
				{
					it.opacity=1;
				}
				else
				{
					it.opacity=0.5;
				}
			}
			
		}
		else
		{
			us.sheet.opacity=0;
			if(us.cmd=="clear")
			{
				us.cmd=null;
				game.dice.remove_dice();
			}
			if(us.cmd=="delete")
			{
				us.cmd=null;
				game.dice.remove_die();
			}
		}
			
		if(game.dice.dice.length==0)
		{
			us.sheet_readme.opacity=1;
		}
		else
		{
			us.sheet_readme.opacity=0;
		}
		
		us.sheet_readme.update();
		
		us.sheet.update();
//		us.sheet_but.update();
	};
	

})(rollup);
