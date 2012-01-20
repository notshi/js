
var modules=modules || {};

Swish=function(){
	
// simple cached modules
// var swish=Swish();
// will always get us the global swish table

	if(modules["swish"]) { return modules["swish"]; }
	var self={};
	modules["swish"]=self;

	
	self.setup=function(opts)
	{
		self.x=0;
		self.destx=0;
		
		self.back=$("<div class=\"swish_back\"></div>");
		self.front=$("<div class=\"swish_front\"></div>");
		self.over=$("<div class=\"swish_over\"></div>");
		
		self.div=opts.div;
		
		opts.div.prepend(self.over);
		opts.div.prepend(self.front);
		opts.div.prepend(self.back);
		
		self.requestAnimationFrame = (function(){
// sadly requestAnimationFrame is useless if you actually care about real-time
// maybe one day this can be replaced...
		  var ret=function(callback,element){
					  window.setTimeout(callback, 1000 / 60);
				  };
		  return ret;
		})();
			
		self.update=function() {
			self.requestAnimationFrame(self.update); // we need to always ask to be called again

			if( self.preload.check() )
			{
				if(! self.front.is(':animated') ) // animation must finish
				{
					if(self.show_next)
					{
						
						self.back.css("backgroundImage",self.front.css("backgroundImage"));
						
						self.front.hide(0,function(){
							self.front.css("backgroundImage","url("+self.show_next+")");
							self.front.fadeIn(3000);
//							self.front.slideDown(3000);
//							self.front.show(3000);
//							self.front.animate({opacity:1}, 4000 );
						});

					


//console.log("animate in");
	  
						self.show_next=undefined;
					}
				}
			}
			
//if(!r){console.log("check "+self.preload.progress_percent);}

			var t=self.time();
			if( t >= self.next_time )
			{
				var v=self.testdata.list[self.index];
				if(!v) {self.index=0;} // try and wrap
				v=self.testdata.list[self.index];
				
				if(v)
				{
					self.show(v.full,self.index);
				}
				
				self.index++;
				self.next_time=t+10; // every 10 secs
			}		

			if(self.x!=self.destx)
			{
				self.x=self.destx;
				self.strip_icons.stop(true,true);
//console.log("animate:"+self.x)
				self.strip_icons.animate({"left":self.x},500);
			}


		};
		
/*		for(i in self.testdata.list)
		{
			var v=self.testdata.list[i];
			self.preload.add_image(v.full);
		}
*/
		
		self.start_time=self.time();
		self.next_time=self.start_time;
		self.index=0;
				
		self.setup_strip();
		
		self.update();

		return self;
	};
	
	self.show=function(url,idx){
		
		idx=Math.floor(idx); // must be number
			
//console.log("show "+url);
		self.show_next=url;
		self.preload.add_image(url);
		
		if(idx!=undefined)
		{
			self.destx=(self.back.width()/2)-75-((idx)*130);
		}
	};
	
	self.time=function(){
		return (new Date).getTime()/1000;
	};
	
	self.setup_strip=function()
	{
		self.over.empty();
		self.strip=$("<div class=\"swish_strip\"></div>");
		self.strip_icons=$("<div class=\"swish_icons\"></div>");
		self.over.append(self.strip);
		self.strip.append(self.strip_icons);
		
		self.icons=[];		
		var x=10
		for(i in self.testdata.list)
		{
			var v=self.testdata.list[i];
			if(v)
			{
				var it={};
				self.icons[i]=it;
				
				it.dat=v;
				it.div=$("<div class=\"swish_icon\"></div>");
				it.idx=i;
				
				self.strip_icons.append(it.div);
				
				it.div.css("backgroundImage","url("+it.dat.icon+")");
				
				it.div.css("left",x+"px");
				it.x=x;
				
				x+=130;
				
				it.div.click(it,function(e){
					var it=e.data;
	//console.log(it.idx);
					self.index=it.idx;
					self.next_time=self.start_time;
				});
			}
			
			self.strip_icons.css({"left":self.back.width()});

		}

		
		
	};

	return self;
};

Swish();

