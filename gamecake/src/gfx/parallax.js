
(function(){
	
gamecake.gfx.parallax=function(opts){
	var self=gamecake.gfx.sheet(opts); // extend the sheet class
	var old={};
	
	old.setup=self.setup;
	self.setup=function(){
		old.setup();
		return self;
	};
	
	old.clean=self.clean;
	self.clean=function(){
		for(i in self.kids)
		{
			var sheet=self.kids[i];
			sheet.clean();
		}
		old.clean();
		return self;
	};
	
	old.draw=self.draw;
	self.draw=function(){
		for(i in self.kids)
		{
			var sheet=self.kids[i];
			sheet.draw();
		}
		old.draw();
		return self;
	};
	
	old.update=self.update;
	self.update=function(){
	
		var mx=self.fx/(self.hx-self.sx);
		var my=self.fy/(self.hy-self.sy);
		
		for(i in self.kids)
		{
			var sheet=self.kids[i];
			
			sheet.fx=(sheet.hx-sheet.sx)*mx;
			sheet.fy=(sheet.hy-sheet.sy)*my;
			
			sheet.update();
		}
		old.update();
		return self;
	};

	return self;
};

})();
