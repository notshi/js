
//code
weeeee={}; // a global place to keep our cake


(function(game){
	
	game.opts={};
	
	game.p={};
	
	game.preloadimgs={
		test:"art/by.png"
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
//		game.dice.clean();
//		game.menu.clean();
		cake.clean();		
	};
	
	game.draw=function(cake){
		cake.draw();
//		game.menu.draw();
//		game.dice.draw();
	};
	
	game.update=function(cake){
		cake.update();
//		game.menu.update();
//		game.dice.update();
	};
	
})(weeeee);

