
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

		
		var v=self.testdata.list[10];
		self.back.css({"backgroundImage":"url("+v.full+")"});
		
		var v=self.testdata.list[11];
		self.front.css({"backgroundImage":"url("+v.full+")"});
		
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

			var r=self.preload.check();
			
if(!r){console.log("check "+self.preload.progress_percent);}

		};
		
		for(i in self.testdata.list)
		{
			var v=self.testdata.list[i];
			self.preload.add_image(v.full);
		}
		self.update();
		
		return self;
	};
	return self;
};

Swish();

