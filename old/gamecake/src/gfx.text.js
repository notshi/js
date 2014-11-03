
(function(){

gamecake.gfx.fonts={};
gamecake.gfx.fonts.sans={
	fontFamily:"verdana,sans-serif",
	fontSize:"16px",
	lineHeight:"112.5%"
};

	
gamecake.gfx.text=function(opts){
	var self=gamecake.gfx.sheet(opts); // extend the sheet class
	var old={};
	
	old.setup=self.setup;
	self.setup=function(){
		old.setup();
		return self;
	};
	
	old.clean=self.clean;
	self.clean=function(){
		old.clean();
		return self;
	};
	
	old.draw=self.draw;
	self.draw=function(){
		old.draw();
		return self;
	};
	
	old.update=self.update;
	self.update=function(){
		old.update();
		return self;
	};

	self.text="";
	self.text_color="#000";
	self.text_size=16;
	
	self.draw=function(){
		old.draw();

		var gs=gamecake.scale;

		gamecake.ctx.font = Math.floor(self.text_size/gs)+"px verdana";
		gamecake.ctx.fillStyle = self.text_color;
		gamecake.ctx.textBaseline="top";
		gamecake.ctx.textAlign="left";

		var w=gamecake.ctx.measureText(self.text).width;
		
		gamecake.ctx.setTransform( 1,0  , 0,1 , Math.floor(self.px/gs),Math.floor(self.py/gs) );
		gamecake.ctx.fillText(self.text ,  Math.floor((((self.sx/gs)-w)-(self.ox/gs))) , Math.floor((-self.oy)/gs) );
//console.log(self.text);				
		
		return self;
	};

	self.set=function(s){
		self.text=s+"";
//				self.div.text(s);
		return self;
	};

	self.align=function(s){
		self.text_align=s;
/*
		if(s=="center")
		{
					self.div.css({textAlign:"center"});
		}
		else 
		if(s=="right")
		{
					self.div.css({textAlign:"right"});
		}
		else 
		{
					self.div.css({textAlign:"left"});
		}
*/		
		return self;
	};

	self.size=function(n){
		self.text_size=n;
//				self.div.css({fontSize:n+"px"});
		return self;
	};

	self.color=function(s){
		self.text_color=s;
		return self;
	};

//			self.div.css(gamecake.gfx.fonts.sans); // default
//			if(opts.style) { self.div.css(opts.style); } // override
	if(opts.color) { self.color(opts.color); } // override
	if(opts.size) { self.size(opts.size); } // override
	if(opts.align) { self.align(opts.align); } // override

		
	return self;
};

})();
