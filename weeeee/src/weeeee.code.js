
//code
weeeee={}; // a global place to keep our cake


(function(game){
	
	game.opts={};
	
	game.p={};
	
	game.state=null;

	game.state_next="splash";
	game.state_prev=null;
	
	game.preloadimages={
		pp0:"art/pp0.png",
		pp1:"art/pp1.png",
		pp2:"art/pp2.png",
		pp3:"art/pp3.png",
		pp4:"art/pp4.png",
		pp5:"art/pp5.png",
		pp6:"art/pp6.png",
		pp7:"art/pp7.png",
		pp8:"art/pp8.png",
		pp9:"art/pp9.png",
		box1:"art/box1.png",
		box2:"art/box2.png",
		box3:"art/box3.png",
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
	game.preloadaudios={
		tune:"art/mp3/tune.ogg",
		bonus:"art/mp3/bonus.wav",
		jump:"art/mp3/jump.wav",
		pick:"art/mp3/pick.wav",
		splode:"art/mp3/splode.wav",
		start:"art/mp3/start.wav"
	};
	

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

