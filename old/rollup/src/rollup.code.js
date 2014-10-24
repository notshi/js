
//code
rollup={}; // a global place to keep our cake


(function(game){
	
	game.ds=[2,4,6,8,10,12,20];

	game.opts={};
	
	game.p={};
	
	game.preloadimages={
		readme:"art/readme.png",
		menu:"art/menu.png"
	};
	
	for(var t in game.ds )
	{
		var d=game.ds[t];
		game.preloadimages["d"+d]="art/die/d"+d+".png";
	}


	game.opts.name="rollup";
	game.opts.width=480;
	game.opts.height=320;
	game.opts.backcolor="#ffffff";
	
	game.setup=function(cake,opts){
			
		cake.setup();
		game.dice.setup();
		game.menu.setup();

    var bubble = new google.bookmarkbubble.Bubble();
    bubble.hasHashParameter = function() { return false; }; // we will nag until we are fullscreen
    bubble.setHashParameter = function() {};
    bubble.showIfAllowed();


		return game;
	};
	
	game.clean=function(cake){
		game.dice.clean();
		game.menu.clean();
		cake.clean();		
	};
	
	game.draw=function(cake){
		cake.draw();
		game.menu.draw();
		game.dice.draw();
	};
	
	game.update=function(cake){
		cake.update();
		game.menu.update();
		game.dice.update();
	};
	
})(rollup);

/*
(function(game){
	
	game.div=null;
	

	game.setup=function(opts){
		
		game.div=opts.div;

		game.div_test=$("<div style=\"margin:auto;width:350px;\"></div>");
		
		for(var i in game.ds )
		{
			var v=game.ds[i];
			game.div_test.append( $("<img style=\"width:50px;\" src=\"art/die/d"+v+"."+v+".png\"></img>") );
		}
		
		game.div.append(game.div_test);

		return game;
	};


})(rollup);
*/
