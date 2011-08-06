
hatebees=function(){
	
	var game={};
	
	game.opts={};
	
	game.p={};
	
	game.preloadimgs={
		paralax1:"art/levels/level_00.p10.png",
		paralax2:"art/levels/level_00.p11.png",
		paralax3:"art/levels/level_00.p12.png",
		paralax4:"art/levels/level_00.p13.png",
		tard1:"art/vtard/test.png"
	};

	game.opts.name="hatebees";
	game.opts.width=640;
	game.opts.height=480;
	game.opts.backcolor="#000000";
	
	game.setup=function(cake,opts){
			
		cake.setup();

		game.plx=gamecake.gfx.parallax({parent:game.sheet,sx:640,sy:480,hx:640*2,hy:480*2}).draw();

		game.p0=gamecake.gfx.sheet({parent:game.plx,sx:640,sy:480,url:cake.images.paralax4.url}).draw();
		game.p1=gamecake.gfx.sheet({parent:game.plx,sx:640,sy:480,url:cake.images.paralax3.url}).draw();
		game.p2=gamecake.gfx.sheet({parent:game.plx,sx:640,sy:480,url:cake.images.paralax2.url}).draw();
		game.p3=gamecake.gfx.sheet({parent:game.plx,sx:640,sy:480,url:cake.images.paralax1.url}).draw();
		game.p4=gamecake.gfx.sheet({parent:game.plx,sx:640,sy:480}).draw();
			
		for(i=0;i<40;i++)
		{
			game.p[i]=gamecake.gfx.minion({parent:game.p4,pages:{1:cake.images.tard1.url},sx:100,sy:100});
			game.p[i].display("idle",0);
			game.p[i].draw();
		}
			
		return game;
	};
	
	game.clean=function(cake){
		cake.clean();
	};
	
	game.draw=function(cake){
		cake.draw();
	};
	
	game.update=function(cake){
		game.plx.fx+=1;
		if(game.plx.fx>640) { game.plx.fx-=640; }
		game.plx.update().draw();
		for(i=0;i<40;i++)
		{
			var t=i;
			if( cake.keys.state.left ) { t=-t; }
			game.p[i].px+=1+t/5;
			if(game.p[i].px>640) { game.p[i].px-=640+100; }
			game.p[i].py=(i*10);
			game.p[i].display("idle",game.p[i].px/10);
			game.p[i].draw();
		}
		cake.update();
	};
	
	return game;
}();
