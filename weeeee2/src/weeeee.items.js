
(function(game){
	
	var us={}
	game.items=us;
	
	us.box=null;
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		us.box=gamecake.gfx.sheet({parent:us.sheet,name:"box1",sx:32,sy:32,ox:16,oy:16,px:400,py:50});//.draw();
		us.box.bonus=true;
		us.box.vy=0;
		
		us.peek_state="hide";

		us.peek=gamecake.gfx.sheet({parent:us.sheet,name:"box1",sx:64,sy:72,px:0,py:240});//.draw();
		us.pickitem();
	};
	
	us.pickitem=function()
	{
		var r=Math.floor(Math.random()*10);
		us.peek.name="pp"+r;
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
		if(us.peek){
		us.peek.draw();}
	};

	us.update=function(speed)
	{	
		if(us.box)
		{
			if(us.box.bonus)
			{
				var dx= us.box.px - game.sled.px;
				var dy= us.box.py - (game.sled.py-20);
				if( ( (dx*dx) + (dy*dy) )<(30*30) )
				{
					us.box.bonus=false; //die
					game.play.score_item+=100+Math.floor(Math.random()*400);
					
					if(us.peek_state=="hide")
					{
						us.peek_state="peek";
						gamecake.sfx.audio({name:"bonus",channel:4,disable:gamecake.sniff.idiot_device});
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
					us.peek.py-=2;
					if(us.peek.py<(240-72))
					{
						us.peek.py=(240-72);
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
					us.peek.py+=2;
					if(us.peek.py>240)
					{
						us.peek.py=240;
						us.peek_state="hide";
					}
				break;
			}
			us.peek.update();
		}
	};
	
	us.checkadd=function( ch )
	{
		if(us.box.px<-50) // could we respawn?
		{
			if( (Math.random()*10 < 1) ) // 1 in 10 chance of spawn
			{
				us.box.bonus=true;
				us.box.px=ch.px+20;
				us.box.py=25+((ch.py-25)*Math.random());
				us.box.vy=0;
			}
		}
	};

})(weeeee);
