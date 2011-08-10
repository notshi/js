
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
		us.score=0;
		us.score_dist=0;
		us.score_item=0;
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:us.hx,sy:us.hy});

//		us.plx=gamecake.gfx.parallax({parent:us.sheet,sx:us.hx,sy:us.hy,hx:us.hx*2,hy:us.hy*2}).draw();

		us.p=[];

		us.p[0]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p13"}).draw();
		us.p[1]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p13",px:us.hx}).draw();
		
		us.p[2]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p12"}).draw();
		us.p[3]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p12",px:us.hx}).draw();
		
		us.p[4]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p11"}).draw();
		us.p[5]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p11",px:us.hx}).draw();
		
		us.p[6]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p10"}).draw();
		us.p[7]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"p10",px:us.hx}).draw();
		
		us.p[8]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy}).draw();

		us.p[9]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"over",px:640,py:0}).draw();

		us.p[10]=gamecake.gfx.sheet({parent:us.sheet,sx:us.hx,sy:us.hy,name:"score"}).draw();
		

		us.$score=$("<div>0</div>");
		us.$score.css({
			top:12,
			right:235,
			width:200,
			height:50,
			textAlign:"right",
			fontSize:"40px",
			fontFamily:"Arial",
			position:"absolute"});
			
//DBG			
//		us.p[10].div.append(us.$score);
				
		game.sled.setup(us,us.p[8]);
		game.tiles.setup(us,us.p[8]);
		game.items.setup(us,us.p[8]);
		
		us.tune=gamecake.sfx.audio({name:"tune",loop:true});
/*		
		us.$tune = $('<audio loop ><source src="art/mp3/tune.mp3" /><source src="art/mp3/tune.ogg" /></audio>');
		us.$tune[0].addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
		us.$tune[0].play();


		us.$bonus = $('<audio ><source src="art/mp3/bonus.wav" /></audio>');
		us.$jump = $('<audio ><source src="art/mp3/jump.wav" /></audio>');
		us.$pick = $('<audio ><source src="art/mp3/pick.wav" /></audio>');
		us.$splode = $('<audio ><source src="art/mp3/splode.wav" /></audio>');
		us.$start = $('<audio ><source src="art/mp3/start.wav" /></audio>');
*/
		gamecake.sfx.audio({name:"start"});

	};

	us.clean=function()
	{
		us.tune.stop();
		
		game.items.clean();
		game.sled.clean();
		game.tiles.clean();
		
		for(i=0;i<us.p.length;i++)
		{
			us.p[i].clean();
		}
		
		us.sheet.clean();
	};

	us.draw=function()
	{
		for(i=0;i<us.p.length-2;i++)
		{
			us.p[i].draw();
		}
		game.tiles.draw();
		game.items.draw();
		game.sled.draw();
		us.sheet.draw();

		us.p[us.p.length-2].draw();
		us.p[us.p.length-1].draw();
	};

	us.update=function()
	{
		us.sheet.update();

		var speed=game.sled.speed;
		
		if(game.sled.state!="dead")
		{
			us.score_dist=Math.floor(us.dx/10);
			
			us.score=us.score_dist+us.score_item;
			
			us.$score.text(us.score);
			
			if(speed<4)  { speed=4; }
		}
		else
		{
			if(speed<3) { us.p[9].px-=3; } //make sure we get onto the screen
			else
			{
				us.p[9].px-=speed; // scroll on the dead screen sarcasticly
			}
			if(us.p[9].px<=0) { us.p[9].px=0; us.state="dead"; }
		}
		if(speed>80) { speed=80; }

		us.dx+=speed; // position through level for score or whatever
		
		for(i=0;i<us.p.length;i++)
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
		
		game.items.update(speed);
		game.tiles.update(speed);
		game.sled.update(speed);
		
		
		if(us.state=="dead") // clicky
		{
			if(gamecake.input.down.button)
			{
				if(gamecake.input.y>300)
				{
					game.state_next="splash";
				}
				else // submit score
				{
					var t=Math.floor(((new Date()).getTime())/(1000*60*60*24)); // number of days since the epoch
					var url="http://leeds-hack.appspot.com/score/submit?game=weeeee&score="+us.score+"&dumb="+(us.score*t);
					window.location.href=url;
				}
			}
		}

	};
	

})(weeeee);
