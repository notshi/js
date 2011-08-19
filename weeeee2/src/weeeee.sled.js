
(function(game){
	
	var us={}
	game.sled=us;
	
	us.t=[];
	
	us.by=0;
	us.vby=0;
	
	us.lx=0
	us.ly=0
	us.px=0
	us.py=0
	
	us.setup=function(play,sheet)
	{
		us.play=play;
		us.sheet=sheet;
		
		us.px=100;
		us.py=100;
		us.lx=us.px;
		us.ly=us.py;
		
		us.state="floor";
		us.leap=0;
		us.jump=0;
		
		us.speed=2;
		us.speed_base=2;
		
		us.t[0]=gamecake.gfx.sheet({parent:us.sheet,sx:50,sy:50,name:"sled_e",px:us.px,py:us.py,ox:25,oy:50});//.draw();
		us.t[1]=gamecake.gfx.sheet({parent:us.sheet,sx:50,sy:50,name:"sled"  ,px:us.px,py:us.py,ox:25,oy:50});//.draw();
	};

	us.clean=function()
	{
		for(i=0;i<us.t.length;i++)
		{
			us.t[i].clean();
		}
	};

	us.draw=function()
	{
		for(i=0;i<us.t.length;i++)
		{
			us.t[i].draw();
		}
	};

	us.update=function(speed)
	{
		us.speed_base+=1/512;
		if(us.speed_base>20) { us.speed_base=20; }
		
		var speed_dest=us.speed_base;
		
		var t=game.tiles.find_tile(us.t[0].px)
		
//		if(!t) { console.log("missing tile"); return; }
		
		if(us.state=="dead")
		{
			speed_dest=0;
		}
		else
		{
			
			if(us.last_tile)
			{
				var tl=us.last_tile.tile;
				if(tl.s.side<0) // this is an end of floor tile
				{
					if(us.state=="floor")
					{
						us.vy=0;
						us.state="jump"; // actually this is just falling
					}
				}
				if(t.tile.s.side>0) // this is a start tile, check for death on entry
				{
					if(tl.s.side<=0) // we are enterinjg it
					{
						if((us.py-10)>t.tile.y) // check for death, give us an extrta 10px of safety
						{
							us.state="dead";
							us.vy=0;
							gamecake.sfx.audio({name:"splode",channel:0,disable:gamecake.sniff.idiot_device});
						}
					}
				}
			}
			
			
			if(gamecake.input.state.any)
			{
				us.by=8;
				us.leap+=1/10;
				if(us.state=="floor") { speed_dest*=2; }
				else { speed_dest*=1.5; }
			}
			else
			{
				us.jump=us.leap+2;
				if(us.jump>8) { us.jump=8; }
				us.leap=0;
				us.by=0;			
			}
		}
		
		if(speed_dest>us.speed)
		{
			us.speed+=1/32;
		}
		else
		{
			us.speed-=1/32;
		}
		if(us.speed<0) { us.speed=0; }


		if(gamecake.input.up.any)
		{
			if(us.state=="floor")
			{
				us.state="jump";
				us.vy=-us.jump;
				gamecake.sfx.audio({name:"jump",channel:2,disable:gamecake.sniff.idiot_device});
			}
		}

		if(us.state=="floor")
		{
			us.px=us.px;
			us.py=t.tile.y;
		}
		else
		if(us.state=="jump")
		{
			us.vy+=1/4;
			if(gamecake.input.state.any) // doublegravy
			{
				us.vy+=1/4;
			}
			us.py+=us.vy;
				
			if(us.py>t.tile.y)
			{
				us.state="floor";
				us.py=t.tile.y
				us.vy=0;
				gamecake.sfx.audio({name:"pick",channel:3,disable:gamecake.sniff.idiot_device});
			}
		}
		else
		if(us.state=="dead")
		{
			us.vy+=1/4;
			us.py+=us.vy;
			us.px-=us.speed;
		}
		
		us.t[0].py=us.py + us.by;
		us.t[1].py=us.py;
		
		us.t[0].px=us.px;
		us.t[1].px=us.px;

		for(i=0;i<us.t.length;i++)
		{
			us.t[i].update();
		}
		
		us.last_tile=t;
	};
	

})(weeeee);
