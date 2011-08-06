
(function(game){
	
	var us={}
	game.play=us;
	
	us.setup=function()
	{
		us.hx=game.opts.width;
		us.hy=game.opts.height;
		
		us.dx=0; // howfar through the level we are
		
		us.data=[];
		us.state="none";
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:us.hx,sy:us.hy});

//		us.plx=gamecake.gfx.parallax({parent:us.sheet,sx:us.hx,sy:us.hy,hx:us.hx*2,hy:us.hy*2}).draw();

		us.p=[];

		us.p[0]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p13.url}).draw();
		us.p[1]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p13.url,px:us.hx}).draw();
		
		us.p[2]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p12.url}).draw();
		us.p[3]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p12.url,px:us.hx}).draw();
		
		us.p[4]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p11.url}).draw();
		us.p[5]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p11.url,px:us.hx}).draw();
		
		us.p[6]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p10.url}).draw();
		us.p[7]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,url:gamecake.images.p10.url,px:us.hx}).draw();
		
		us.p[8]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy}).draw();
				
		game.sled.setup(us,us.p[8]);
		game.tiles.setup(us,us.p[8]);
	};

	us.clean=function()
	{
		game.sled.clean();
		game.tiles.clean();
		
		for(i=0;i<=9;i++)
		{
			us.p[i].clean();
		}
		
		us.sheet.clean();
	};

	us.draw=function()
	{
		game.sled.draw();
		us.sheet.draw();
		for(i=0;i<=8;i++)
		{
			us.p[i].draw();
		}
		game.tiles.draw();
	};

	us.update=function()
	{
		us.sheet.update();

		var speed=19;
		
		us.dx+=speed; // position through level for score or whatever
		
		for(i=0;i<=8;i++)
		{
			var v=us.p[i];
			var dx=0;
			
			switch(i)
			{
				case 2:
					dx=(1/8)*speed;
					if(v.fx+dx >= v.hx) { dx=dx-v.hx; } // wrap
				break;
				case 4:
					dx=(1/4)*speed;
					if(v.fx+dx >= v.hx) { dx=dx-v.hx; } // wrap
				break;
				case 6:
					dx=(1/2)*speed;
					if(v.fx+dx >= v.hx) { dx=dx-v.hx; } // wrap
				break;
				case 8:
					dx=0;
				break;
			}
			
			v.fx+=dx;
			
			v.update();
		}
		
		game.tiles.update(speed);
		game.sled.update(speed);

	};
	

})(weeeee);
