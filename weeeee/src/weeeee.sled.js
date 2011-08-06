
(function(game){
	
	var us={}
	game.sled=us;
	
	us.t=[];
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		us.t[0]=gamecake.gfx.sheet({parent:us.sheet,sx:100,sy:100,url:gamecake.images.sled_e.url,px:200,py:200}).draw();
		us.t[1]=gamecake.gfx.sheet({parent:us.sheet,sx:100,sy:100,url:gamecake.images.sled.url  ,px:200,py:200}).draw();
	};

	us.clean=function()
	{
		for(i=0;i<us.t.length;i++)
		{
			us.t[i].clean();
		}
	};

	us.draw=function()
	{
		for(i=0;i<us.t.length;i++)
		{
			us.t[i].draw();
		}
	};

	us.update=function(speed)
	{
		for(i=0;i<us.t.length;i++)
		{
			us.t[i].update();
		}
	};
	

})(weeeee);
