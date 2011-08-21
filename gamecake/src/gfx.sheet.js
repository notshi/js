
(function(){
	
gamecake.gfx.sheet=function(opts){
	var self={};
			
	self.setup=function(opts){
		
		self.znext=0; // the next z depth to insert a new sheet at
		
		self.kids={}; // sheets within this sheet
		self.autos={}; // auto sheets within this sheet
		
		self.drawn={px:-999999999,py:-999999999}; // the last values we where drawn at, compare on redraw to skip updates

		self.parent=null;
		self.url=null;
		
		self.auto=false;
		
		self.ox=0; // handle position of origin (this is added to px,py before drawing and is center of rotation)
		self.oy=0;
		
		self.px=0; // display position (where to draw)
		self.py=0;
		self.pz=0;
		self.sx=0; // display size (this will default to the size of your image)
		self.sy=0;
		self.sz=1;
		self.rz=0; // rotation
		
		self.fx=0; // background offset (this is the part ofyour image to draw, for sprite sheets)
		self.fy=0;
		self.hx=0; // size of background (this will be the size of your image)
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
	
		if("name" in opts) {
			self.name=opts.name;  // simple url
			if(self.sx<=0) { self.sx=gamecake.images[ self.name ].img.width; }
			if(self.sy<=0) { self.sy=gamecake.images[ self.name ].img.height; }
			if(self.hx<=0) { self.hx=gamecake.images[ self.name ].img.width; }
			if(self.hy<=0) { self.hy=gamecake.images[ self.name ].img.height; }
		}
		
		return self;
	};
	
	// append the given kid into this sheets kids
	self.append=function(kid){
		kid.pz=self.znext++;
		kid.parent=self;
		self.kids[kid.pz]=kid;
		if(kid.auto) { self.autos[kid.pz]=kid; }
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
		
		if(self.name)
		{
			var gs=gamecake.scale;
			var img=gamecake.images[ self.name ].get(gs);
			if(img)
			{
				var w=gamecake.game.opts.width;
				var h=gamecake.game.opts.height;
				
				var px=self.px;
				var py=self.py;
				
				var dx=0;
				var dy=0;
				
				var fx=self.fx;
				var fy=self.fy;
				
				var sx=self.sx;
				var sy=self.sy;
				
				var ox=self.ox;						
				var oy=self.oy;
				
//						if(px+sx-ox<0) { dx=-(px+sx-ox); px=px+dx; fx=fx+dx; sx=sx-dx; } 
//						if(py+sy-oy<0) { dy=-(py+sy-oy); py=py+dy; fy=fy+dy; sy=sy-dy; } 

//						if(px+sx-ox>w) { sx=sx+(w-(px+sx-ox)); } 
//						if(py+sy-oy>h) { sy=sy+(h-(py+sy-oy)); } 
				
//						if( (sx-fx>0) && (sy-fy>0) )
				{
//console.log(px+","+py+" : "+fx+","+fy+" : "+sx+","+sy);
					
					px=Math.floor(px/gs);
					py=Math.floor(py/gs);
					
					fx=Math.floor(fx/gs);
					fy=Math.floor(fy/gs);
					sx=Math.floor(sx/gs);
					sy=Math.floor(sy/gs);
					ox=Math.floor(ox/gs);
					oy=Math.floor(oy/gs);
//console.log(px+","+py+" : "+fx+","+fy+" : "+sx+","+sy);

					var sn=Math.sin(Math.PI*self.rz/180);
					var cs=Math.cos(Math.PI*self.rz/180);
					gamecake.ctx.setTransform( cs,sn  , -sn,cs , px,py );
					gamecake.ctx.drawImage(img , fx,fy , sx,sy , -ox,-oy , sx,sy);
				}
			}
		}
		return self;
	};
	
	self.update=function(){return self;};
	

// auto setup
	
	self.setup(opts); // probably setup defaults
	
	return self;
};

})();
