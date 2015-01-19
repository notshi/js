
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var pong={opts:opts};
	
	opts.width=800; // size
	opts.height=600;
	
	var $=require("./jquery.js");
	
	pong.div_base=$(opts.div); // jquery wrapper of main div
	pong.div_base.css("position","relative");
	
	pong.div=$("<div class='pong_screen' />"); // main view which we will auto scale to fit
	pong.div_base.append(pong.div); // display
	pong.div.css("position","absolute");
	pong.div.css("width",opts.width);
	pong.div.css("height",opts.height);
	pong.div.css("background-color","#000");
	

// create a ball
	pong.new_ball=function(opts){
		var ball={}
		ball.div=$("<div class='pong_ball' />");
		pong.div.append(ball.div); // display
		ball.div.css("position","absolute");
		ball.div.css("width",20);
		ball.div.css("height",20);
		ball.div.css("background-color","#0f0");
		
		ball.px=opts.px || 0;
		ball.py=opts.py || 0;
		ball.vx=opts.vx || 2;
		ball.vy=opts.vy || 2;

		ball.update=function()
		{
			
			ball.px=ball.px+ball.vx; // add velocity
			ball.py=ball.py+ball.vy;
			
			// bounce off of sides
			if(ball.px<0)      { ball.px=0;      if(ball.vx<0) { ball.vx=-ball.vx;} }
			if(ball.px>800-20) { ball.px=800-20; if(ball.vx>0) { ball.vx=-ball.vx;} }
			if(ball.py<0)      { ball.py=0;      if(ball.vy<0) { ball.vy=-ball.vy;} }
			if(ball.py>600-20) { ball.py=600-20; if(ball.vy>0) { ball.vy=-ball.vy;} }
			
			ball.div.css("left",ball.px); // display position
			ball.div.css("top",ball.py);
			
		};
		
		return ball;
	};
	
	pong.ball=pong.new_ball({px:100,py:100});

// this function is called every frame
	pong.update=function()
	{
		window.setTimeout(pong.update, 1000 / 60); // request that we get called again ( 60 times a second )

		var zoom=pong.div_base.width()/opts.width; // scale size or
		var test=pong.div_base.height()/opts.height; // scale size
		if(test<zoom) { zoom=test; } // pick smallest size so the screen fits
		
		pong.div.css("zoom",zoom); // set display zoom 
		
		pong.ball.update();
	};
	
	
	pong.update(); // start frame updates
	return pong;
};
