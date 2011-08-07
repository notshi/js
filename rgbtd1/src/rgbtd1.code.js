
// our only global
rgbtd1={};


(function(game){
	
	game.opts={};
	
	game.p={};
	
	game.preloadimgs={
		back:"art/test/layout.png",
		plots:"art/plots4.png",
		blocks:"art/blocks.png"
	};

	game.opts.name="rgbtd1";
	game.opts.width=640;
	game.opts.height=480;
	game.opts.backcolor="#000000";
	
	game.setup=function(cake,opts){
			
		cake.setup();

		game.plx=gamecake.gfx.parallax({parent:game.sheet,sx:640,sy:480,url:cake.images.back.url}).draw();
		
		game.cells.setup(40,30);
		game.actors.setup();
		game.actors.add_pxl(1,1,"lft");
				
		game.menu.setup();
		return game;
	};
	
	game.clean=function(cake){
		game.menu.clean();
		game.actors.clean();
		game.cells.clean();
		cake.clean();
	};
	
	game.draw=function(cake){
		cake.draw();
		game.cells.draw();
		game.actors.draw();
		game.menu.draw();
	};
	
	game.update=function(cake){
		cake.update();
		game.cells.update();
		game.actors.update();
		game.menu.update();
	};
	
})(rgbtd1);
