
(function(game){
	
	var us={}
	game.dice=us;
	
	us.dice=[];
	
	us.setup=function()
	{
		us.data=[];
		us.state="none";
		
		us.grab=null;
		
		us.sheet=gamecake.gfx.sheet({parent:game.sheet,px:0,py:0,sx:game.opts.width,sy:game.opts.height});
		var graboff=function(e){
			if(us.grab)
			{
				us.grab=null;
				us.state="none";
			}
			e.preventDefault();
			return false;
		};
/*
		us.sheet.div.bind('mouseup',graboff);
		us.sheet.div.bind('mouseleave',graboff);
		us.sheet.div.bind('touchend',graboff);
*/
	};

	us.clean=function()
	{
		us.sheet.clean();
	};

	us.draw=function()
	{
		us.sheet.draw();
	};	

	us.update=function()
	{
		if(gamecake.input.down.button)
		{
			var v=us.find_dice(gamecake.input.x,gamecake.input.y);
			if(!us.grab)
			{
				if(v)
				{
					us.grab=v;
					us.state="grab";
					us.grab_menu=false;
					us.grab_x=v.px-(gamecake.input.x);
					us.grab_y=v.py-(gamecake.input.y);
				}
				else // make new
				{
					us.grab=us.add_die(20);
					us.grab_menu=true;
					us.state="grab";
					us.grab_x=0;
					us.grab_y=0;
				}
			}
		}
		if(gamecake.input.up.button)
		{
//console.log((gamecake.input.x) + " , " + (gamecake.input.y) )
			if(us.grab)
			{
				us.grab_menu=false;
				us.grab=null;
				us.state="none";
			}
		}
				
		if(us.state=="rest")
		{
		}
		else
		if(us.state=="rotate")
		{
			var maxrot=0;
			for(var i=0;i<us.dice.length;i++)
			{
				var v=us.dice[i];
				v.update();
				
				var speed=Math.sqrt(v.sheet.rz*v.sheet.rz);
				if(speed>maxrot) { maxrot=speed; }
			}
			if(maxrot<1.1)
			{
				for(var i=0;i<us.dice.length;i++)
				{
					var v=us.dice[i];
					v.sheet.rz=0;
				}
				us.state="rest";
			}
		}
		else
		{
			var maxspeed=0;
			for(var i=0;i<us.dice.length;i++)
			{
				var v=us.dice[i];
				
				var speed=Math.sqrt(v.vx*v.vx + v.vy*v.vy)
				if(speed>maxspeed) { maxspeed=speed; }
				
				for(var ii=i+1;ii<us.dice.length;ii++)
				{
					var vv=us.dice[ii];
					var dx=v.px-vv.px;
					var dy=v.py-vv.py;
					var d=Math.sqrt(dx*dx+dy*dy);
					d=(100-d)/100;
					if(d>0)
					{
						v.vx+=dx*d;
						v.vy+=dy*d;
						vv.vx-=dx*d;
						vv.vy-=dy*d;
					}
				}
				v.update();
			}
			if(maxspeed<1/60) { if(us.state!="grab") { us.state="rotate"; } } // not moving any more
		}
		us.sheet.update();
	};
	
	us.roll_dice=function()
	{
		for(var i=0;i<us.dice.length;i++)
		{
			var v=us.dice[i];
			v.roll();
		}
	}

	us.remove_die=function()
	{
		var v=us.dice.pop();
		v.sheet.clean();
	};
	
	us.remove_dice=function()
	{
		for(var i=0;i<us.dice.length;i++)
		{
			var v=us.dice[i];
			v.sheet.clean();
		}
		us.dice=[];
	};

	us.find_dice=function(px,py)
	{
		var best_v=null;
		var best_dd=1000*1000;
		for(var i=0;i<us.dice.length;i++)
		{
			var v=us.dice[i];
			var x=px-v.px;
			var y=py-v.py;
			var dd=(x*x)+(y*y);
			if(dd<best_dd)
			{
				best_v=v;
				best_dd=dd;
			}
		}
		if(best_dd<(50*50)) { return best_v; }
		return null;
	}

	us.add_die=function(numsides)
	{
		var it={};
		it.numsides=numsides;
		
//		it.px=40+50+(Math.random()*320);
//		it.py=40+50+(Math.random()*180);
		
		it.px=gamecake.input.x;
		it.py=gamecake.input.y;
		
		it.fval=0;
		it.val=1+(Math.floor(it.fval)%it.numsides);

		it.sheet=gamecake.gfx.sheet({auto:true,parent:us.sheet,px:it.px,py:it.py,ox:50,oy:50,sx:100,sy:100,sz:1.0,url:gamecake.images["d"+it.numsides].url});
		it.sheet.fx=100*(it.numsides-1);
		it.sheet.fy=0;
		
		it.roll=function(){		
			it.vx=(Math.random()*16)-8;
			it.vy=(Math.random()*16)-8;
			it.fval=Math.random()*it.numsides;
			it.sheet.rz-=360;
			us.state="roll";
		};
		it.roll();

//		it.sheet.div.click(function(e){
//			game.dice.roll_dice();
//		});
		
		var mdown=function(e){
			var x=gamecake.input.x;
			var y=gamecake.input.y;
			
			if(e.originalEvent.touches)
			{
				var tevent =  e.originalEvent.touches.item(0);  
				x=tevent.clientX;
				y=tevent.clientY;
				
				gamecake.input.x=x;
				gamecake.input.y=y;
			}
			it.sheet.rz-=360;
			us.grab=it;
			us.state="grab";
			us.grab_x=it.px-x;
			us.grab_y=it.py-y;
			e.preventDefault();
			return false;
		};
/*
		it.sheet.div.bind('mousedown',mdown);
		it.sheet.div.bind('touchstart',mdown);
*/


		us.dice.push(it);

		it.flip=function(){
			it.val++;
			if(it.val>it.numsides) { it.val=1; }			
		};
 				
		it.update=function(){
			
			if(us.state=="rest")
			{
			}
			else
			if(us.state=="rotate")
			{
				it.sheet.rz=it.sheet.rz*0.95;
			}
			else
			{
				if(us.grab==it) // move this one
				{
					var x=us.grab_x+(gamecake.input.x);
					var y=us.grab_y+(gamecake.input.y);
					
					var vx=(x-it.px)/2;
					var vy=(y-it.py)/2;
					if((vx*vx+vy*vy)>(it.vx*it.vx+it.vy*it.vy))
					{
						it.vx=vx;
						it.vy=vy;
					}
					
					it.px=x;
					it.py=y;
					
				}
			
			it.vx*=0.98;
			it.vy*=0.98;
			
			it.px+=it.vx;
			it.py+=it.vy;
			
			var hx1=50;
			var hy1=50;
			var hx2=game.opts.width-50;
			var hy2=game.opts.height-50;
			
			if(it.px<hx1) { it.px=hx1;  if(it.vx<0) { it.vx=-it.vx; } it.flip(); }
			if(it.px>hx2) { it.px=hx2; if(it.vx>0) { it.vx=-it.vx; } it.flip(); } 
			if(it.py<hy1) { it.py=hy1;  if(it.vy<0) { it.vy=-it.vy; } it.flip(); }
			if(it.py>hy2) { it.py=hy2; if(it.vy>0) { it.vy=-it.vy; } it.flip(); }
			
			if( (it.vy*it.vy) > (it.vx*it.vx) )
			{
				it.sheet.rz=it.sheet.rz-it.vy;
			}
			else
			{
				it.sheet.rz=it.sheet.rz+it.vx;
			}
			it.sheet.px=it.px;
			it.sheet.py=it.py;
			
			it.fval+=Math.sqrt(it.vx*it.vx+it.vy*it.vy)/4;
			
			it.val=1+(Math.floor(it.fval)%it.numsides);
			
			it.sheet.url=gamecake.images["d"+it.numsides].url;
			it.sheet.fx=(it.val-1)*100;
			it.sheet.fy=0;
			
			if(game.menu.cmd=="clear")
			{
				it.sheet.opacity=0.25;
			}
			else
			if(game.menu.cmd=="delete")
			{
				if(us.grab==it)
				{
					it.sheet.opacity=0.25;
				}
				else
				{
					it.sheet.opacity=1;
				}
			}
			else
			{
				it.sheet.opacity=1;
			}
			
			}
		};
		
		return it;
	};	


})(rollup);
