
(function(game){
	
	var us={}
	game.items=us;
	
	us.box=null;
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		us.box=gamecake.gfx.sheet({parent:us.sheet,name:"box1",sx:57,sy:35,ox:25,oy:12,px:800,py:100});//.draw();
		us.box.bonus=true;
		us.box.vy=0;
		
		us.peek_state="hide";

		us.peek=gamecake.gfx.sheet({parent:us.sheet,name:"box1",sx:136,sy:152,px:0,py:480});//.draw();
		us.pickitem();
	};
	
	us.pickitem=function()
	{
		var r=Math.floor(Math.random()*10);
		us.peek.url=gamecake.images[("pp"+r)].url;
	}

	us.clean=function()
	{
		us.peek.clean();
		us.box.clean();
	};

	us.draw=function()
	{
		if(us.box){
		us.box.draw();}
//		if(us.peek){
//		us.peek.draw();}
	};

	us.update=function(speed)
	{	
		if(us.box)
		{
			if(us.box.bonus)
			{
				var dx= us.box.px - game.sled.px;
				var dy= us.box.py - (game.sled.py-40);
				if( ( (dx*dx) + (dy*dy) )<(60*60) )
				{
					us.box.bonus=false; //die
					game.play.score_item+=100;
					
					if(us.peek_state=="hide")
					{
						us.peek_state="peek";
						gamecake.sfx.audio({name:"bonus"});
					}
				}
			}
			else // dead
			{
				us.box.vy+=1;
				us.box.py+=us.box.vy;
			}
			us.box.px-=speed;
			us.box.update();
		}
		
		if(us.peek)
		{
			switch(us.peek_state)
			{
				case "hide":
				break;
				case "peek":
					us.peek.py-=4;
					if(us.peek.py<(480-152))
					{
						us.peek.py=(480-152);
						us.peek_state="wait";
						us.peek.wait=50;
					}
				break;
				case "wait":
					us.peek.wait--;
					if(us.peek.wait<=0)
					{ us.peek_state="slide"; }
				break;
				case "slide":
					us.peek.py+=4;
					if(us.peek.py>480)
					{
						us.peek.py=480;
						us.peek_state="hide";
					}
				break;
			}
			us.peek.update();
		}
	};
	
	us.checkadd=function( ch )
	{
		if(us.box.px<-100) // could we respawn?
		{
			if( (Math.random()*10 < 1) ) // 1 in 10 chance of spawn
			{
				us.box.bonus=true;
				us.box.px=ch.px+20;
				us.box.py=50+((ch.py-50)*Math.random());
				us.box.vy=0;
			}
		}
	};

})(weeeee);
