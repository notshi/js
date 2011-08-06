
(function(){
	
gamecake.gfx.sheet=function(opts){
	var self={};
			
	self.setup=function(opts){
		if(!self.div) // need a div
		{
			self.div=$("<div/>");
			self.div.css({
						position:"absolute",
						overflow:"hidden"
					});
		}
		
		self.znext=0; // the next z depth to insert a new sheet at
		
		self.kids={}; // sheets within this sheet
		self.autos={}; // auto sheets within this sheet
		
		self.drawn={px:-999999999,py:-999999999}; // the last values we where drawn at, compare on redraw to skip updates

		self.parent=null;
		self.url=null;
		
		self.auto=false;
		
		self.ox=0; // handle position of origin
		self.oy=0;
		
		self.px=0; // display position
		self.py=0;
		self.pz=0;
		self.sx=100; // display size
		self.sy=100;
		self.sz=1;
		self.rz=0; // rotation
		
		self.fx=0; // background offset
		self.fy=0;
		self.hx=0; // size of background
		self.hy=0;
		
		self.opacity=1; // the opacity
		
		if("auto" in opts) { self.auto=opts.auto; }
		if("parent" in opts) // attach to parent
		{
			opts.parent.append(self);
		}		
		if("ox" in opts) { self.ox=opts.ox; }
		if("oy" in opts) { self.oy=opts.oy; }
		if("px" in opts) { self.px=opts.px; }
		if("py" in opts) { self.py=opts.py; }
		if("pz" in opts) { self.pz=opts.pz; }
		if("sx" in opts) { self.sx=opts.sx; }
		if("sy" in opts) { self.sy=opts.sy; }
		if("sz" in opts) { self.sz=opts.sz; }
		if("rz" in opts) { self.rz=opts.rz; }
		if("fx" in opts) { self.fx=opts.fx; }
		if("fy" in opts) { self.fy=opts.fy; }
		if("hx" in opts) { self.hx=opts.hx; }
		if("hy" in opts) { self.hy=opts.hy; }
		if("opacity" in opts) { self.opacity=opts.opacity; }
		if("url" in opts) { self.url=opts.url; }
	
		return self;
	};
	
	// append the given kid into this sheets kids
	self.append=function(kid){
		kid.pz=self.znext++;
		kid.parent=self;
		self.kids[kid.pz]=kid;
		if(kid.auto) { self.autos[kid.pz]=kid; }
		self.div.append(kid.div);
		return self;
	};
	
	self.clean=function(){
		
		for(var i in self.autos) // auto clean
		{
			var v=self.autos[i];
			v.clean();
		}
		
		delete self.parent.kids[self.pz];
		delete self.parent.autos[self.pz];

//console.log(self.pz);
		
		self.div.empty().remove();
		self.div=null;
		self.drawn=null;
		self.kids=null;
		self.autos=null;		
		return self;
	};
	
	self.draw=function(){
		
		for(var i in self.autos) // auto draw
		{
			var v=self.autos[i];
			v.draw();
		}
		
		var c={}
		var changed=false;
		var drawn=self.drawn;
		
		var t="";
		
		if( ((drawn.sz)!=(self.sz)))
			{ changed=true; drawn.sz=self.sz; }
			 t="scale("+drawn.sz+") "+t;
			 
		if( ((drawn.rz)!=(self.rz)) )
			{ changed=true; drawn.rz=self.rz; t="rotate("+drawn.rz+"deg) "+t; }
			
		if( ((drawn.ox)!=(self.ox)) || ((drawn.oy)!=(self.oy)) )
			{ changed=true; drawn.ox=self.ox; drawn.oy=self.oy;
				var ot=drawn.ox+" "+drawn.oy;
// one of these will probably work				
				c.webkitTransformOrigin=ot;
				c.mozTransformOrigin=ot;
				c.oTransformOrigin=ot;
				c.msTransformOrigin=ot;
				c.transformOrigin=ot;
			 }
				

		if( ((drawn.px|0)!=((self.px-self.ox)|0)) || ((drawn.py|0)!=((self.py-self.oy)|0)) )
			{
				changed=true;
				drawn.px=(self.px-self.ox)|0;
				drawn.py=(self.py-self.oy)|0;
			}
			
//		if( (drawn.sz!=1) || (drawn.rz!=0) )
//		{
			t="translate("+drawn.px+"px, "+drawn.py+"px) " + t;
//		}

// one of these will probably work				
		c.webkitTransform=t;
		c.mozTransform=t;
		c.oTransform=t;
		c.msTransform=t;
		c.transform=t;
/*
 * 		if(t=="")
		{
			if( ((drawn.px|0)!=((self.px-self.ox)|0)) )
				{ changed=true; drawn.px=(self.px-self.ox)|0; c.left=drawn.px+"px"; }
				
			if( ((drawn.py|0)!=((self.py-self.oy)|0)) )
				{ changed=true; drawn.py=(self.py-self.oy)|0; c.top=drawn.py+"px"; }
		}
		else
*/
//		{
//		}
/*
 * 		{
			if( ((drawn.px|0)!=((self.px-self.ox)|0)) )
				{ changed=true; drawn.px=(self.px-self.ox)|0; c.left=drawn.px+"px"; }
				
			if( ((drawn.py|0)!=((self.py-self.oy)|0)) )
				{ changed=true; drawn.py=(self.py-self.oy)|0; c.top=drawn.py+"px"; }
		}
*/
		
		if( ((drawn.pz|0)!=(self.pz|0)) )
			{ changed=true; drawn.pz=self.pz|0; c.zIndex=drawn.pz; }
			
		if( ((drawn.sx|0)!=(self.sx|0)) )
			{ changed=true; drawn.sx=self.sx|0; c.width=drawn.sx+"px"; }
			
		if( ((drawn.sy|0)!=(self.sy|0)) )
			{ changed=true; drawn.sy=self.sy|0; c.height=drawn.sy+"px"; }
					
		if( (drawn.url!=self.url) )
			{ changed=true; drawn.url=self.url;	c.backgroundImage="url("+drawn.url+")";
				self.hx=gamecake.images[ drawn.url ].img.width;
				self.hy=gamecake.images[ drawn.url ].img.height;
			}

		if( (drawn.opacity!=self.opacity) )
			{ changed=true; drawn.opacity=self.opacity;	c.opacity=drawn.opacity; }

		if( ((drawn.fx|0)!=(self.fx|0)) || ((drawn.fy|0)!=(self.fy|0)) )
			{ changed=true; drawn.fx=self.fx|0; drawn.fy=self.fy|0; c.backgroundPosition=(-drawn.fx)+"px "+(-drawn.fy)+"px"; }

		if(changed)
		{
			self.div.css(c);
		}
		return self;
	};
	
	self.update=function(){return self;};
	

// auto setup
	
	self.setup(opts); // probably setup defaults
	
	return self;
};

})();
