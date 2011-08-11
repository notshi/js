
(function(){

gamecake.gfx.fonts={};
gamecake.gfx.fonts.sans={
	fontFamily:"verdana,sans-serif",
	fontSize:"16px",
	lineHeight:"112.5%"
};

	var $span=$("<span/>");
	$span.css({display:"none"}); // must be hidden
	$span.css({whiteSpace:"pre"}); // stop auto wrapping?
	$("body").append($span); // must be in dom

// how big is this text? when printed on one line?
// this is possibly a hideously expensive question and may even get it wrong for long text
// also the same fonts in multiple browsers will all render slightly differently
gamecake.gfx.text_size=function(s,style)
{
	if(!style) { style=gamecake.gfx.fonts.sans; }
	
	var ret={w:0,h:0};
	
	$span.css(style);
	$span.text(s);

	ret.w=$span.width();
	ret.h=$span.height();
	
	return ret;
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

	self.set=function(s){
		self.div.text(s);
		return self;
	};

	self.align=function(s){
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
		
		return self;
	};

	self.size=function(n){
		self.div.css({fontSize:n+"px"});
		return self;
	};

	self.color=function(s){
		self.div.css({color:s});
		return self;
	};

	self.div.css(gamecake.gfx.fonts.sans); // default
	if(opts.style) { self.div.css(opts.style); } // override
	if(opts.color) { self.color(opts.color); } // override
	if(opts.size) { self.size(opts.size); } // override
	if(opts.align) { self.align(opts.align); } // override
		
	return self;
};

})();
