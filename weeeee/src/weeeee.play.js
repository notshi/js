
(function(game){
	
	var us={}
	game.play=us;
	
	us.setup=function()
	{
		us.hx=game.opts.width;
		us.hy=game.opts.height;
		
		us.data=[];
		us.state="none";
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:us.hx,sy:us.hy});

		us.plx=gamecake.gfx.parallax({parent:us.sheet,sx:us.hx,sy:us.hy,hx:us.hx*2,hy:us.hy*2}).draw();

		us.p0=gamecake.gfx.sheet({parent:us.plx,sx:us.hx,sy:us.hy,url:gamecake.images.p13.url}).draw();
		us.p1=gamecake.gfx.sheet({parent:us.plx,sx:us.hx,sy:us.hy,url:gamecake.images.p12.url}).draw();
		us.p2=gamecake.gfx.sheet({parent:us.plx,sx:us.hx,sy:us.hy,url:gamecake.images.p11.url}).draw();
		us.p3=gamecake.gfx.sheet({parent:us.plx,sx:us.hx,sy:us.hy,url:gamecake.images.p10.url}).draw();
		us.p4=gamecake.gfx.sheet({parent:us.plx,sx:us.hx,sy:us.hy}).draw();
				
	};

	us.clean=function()
	{
		us.plx.clean();
		us.sheet.clean();
	};

	us.draw=function()
	{
		us.sheet.draw();
		us.plx.draw();
	};

	us.update=function()
	{
		us.sheet.update();

		us.plx.fx+=1;
		if(us.plx.fx>us.hx) { us.plx.fx-=us.hx; }
		us.plx.update();

	};
	

})(weeeee);
