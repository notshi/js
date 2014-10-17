
(function(game){
	
	var us={}
	game.splash=us;
	
	us.setup=function()
	{
		us.data=[];
		us.state="none";
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height});

		us.sheet_menu=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height,name:"splash"});
				
	};

	us.clean=function()
	{
		us.sheet.clean();
	};

	us.draw=function()
	{
		us.sheet.draw();
	};

	us.update=function()
	{
		us.sheet.update();

		if(gamecake.input.down.any)
		{
			game.state_next="play";
		}
	};
	

})(weeeee);
