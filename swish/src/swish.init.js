
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
		
		self.back=$("<div class=\"swish_back\"></div>");
		self.front=$("<div class=\"swish_front\"></div>");
		
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
//						self.front.css("opacity",0);
						self.front.hide();

						self.front.css("backgroundImage","url("+self.show_next+")");
					
//						self.front.show("slow");
//						self.front.slideDown("slow");
						self.front.fadeIn("slow");
//						self.front.animate({opacity:1}, 4000 );


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
					self.show(v.full);
				}
				
				self.index++;
				self.next_time=t+10; // every 10 secs
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
		
		self.update();

		return self;
	};
	
	self.show=function(url){
//console.log("show "+url);
		self.show_next=url;
		self.preload.add_image(url);
	};
	
	self.time=function(){
		return (new Date).getTime()/1000;
	};
	
	return self;
};

Swish();

