
//code
weeeee={}; // a global place to keep our cake


(function(game){
	
	game.opts={};
	
	game.p={};
	
	game.state=null;

	game.state_next="splash";
	game.state_prev=null;
	
	game.preloadimgs={
		p10:"art/plax/p10.png",
		p11:"art/plax/p11.png",
		p12:"art/plax/p12.png",
		p13:"art/plax/p13.png",
		tmid:"art/tiles/mid.png",
		tlft:"art/tiles/lft.png",
		trgt:"art/tiles/rgt.png",
		sled:"art/sled.png",
		sled_e:"art/e.png",
		score:"art/score.png",
		over:"art/over.png",
		splash:"art/splash.png"
	};
	
/*
 * 	for(var t in game.ds )
	{
		var d=game.ds[t];
		game.preloadimgs["d"+d]="art/die/d"+d+".png";
	}
*/

	game.opts.name="rollup";
	game.opts.width=640;
	game.opts.height=480;
	game.opts.backcolor="#ffffff";
	
	game.setup=function(cake,opts){
			
		cake.setup();
//		game.dice.setup();
//		game.menu.setup();

    var bubble = new google.bookmarkbubble.Bubble();
    bubble.hasHashParameter = function() { return false; }; // we will nag until we are fullscreen
    bubble.setHashParameter = function() {};
    bubble.showIfAllowed();


		return game;
	};
	
	game.clean=function(cake){
		
		if(game.state) { game[game.state].clean(); }
		cake.clean();
		
	};
	
	game.draw=function(cake){
		cake.draw();
		
		if(game.state) { game[game.state].draw(); }
	};
	
	game.update=function(cake){
		cake.update();

		if(game.state_next)
		{
			if(game.state) { game[game.state].clean(); }
			game.state_prev=game.state;
			game.state=game.state_next;
			game.state_next=null;
			if(game.state) { game[game.state].setup(); }	
		}
		
		if(game.state) { game[game.state].update(); }
		
	};
	
})(weeeee);

