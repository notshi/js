
(function(game){
	
	var us={}
	game.tiles=us;
	
	us.t=[];
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		for(i=0;i<8;i++)
		{
			us.t[i]=gamecake.gfx.sheet({parent:us.sheet,sx:100,sy:480,url:gamecake.images.tmid.url,px:i*100,py:200+(i*10)}).draw();
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
			}
			us.t[i].update();
		}
	};
	

})(weeeee);
