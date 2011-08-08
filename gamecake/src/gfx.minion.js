
(function(){
	
gamecake.gfx.minion=function(opts){
	var self=gamecake.gfx.sheet({}); // extend the sheet class
	var old={};
	
	old.setup=self.setup;
	self.setup=function(opts){
		if("pages" in opts) { self.pages=opts.pages; } else { self.pages={}; }
		old.setup(opts);
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

	self.pick=function(page,x,y)
	{
		if(page in self.pages) { page=self.pages[page]; } // possible lookup
		
		self.url=page;
		self.sx=100;
		self.sy=100;
		self.fx=100*x;
		self.fy=100*y;
	}
	var dance_frames=[ 0,4, 1,4, 1,5, 4,5, 6,4, 3,5 ];
	
	breath=function(_frame) // make the idle frames more animated
	{
	}
	
	self.display=function(_anim,_frame)
	{
		self.anim=_anim;
		self.frame=_frame;
		self.frame_fixed=Math.floor(Math.abs(_frame));
		
		switch(self.anim)
		{
			default:
			case "idle":
				self.frame_fixed=self.frame_fixed%6; if(self.frame_fixed>3) { self.frame_fixed=6-self.frame_fixed; }
				self.pick(1,self.frame_fixed,3);
			break;
			
			case "left":
				self.frame_fixed=self.frame_fixed%8;
				self.pick(1,self.frame_fixed,1);
			break;
			
			case "right":
				self.frame_fixed=self.frame_fixed%8;
				self.pick(1,self.frame_fixed,0);
			break;
			
			case "out":
				self.frame_fixed=(self.frame_fixed%4);
				self.pick(1,self.frame_fixed,2);
			break;
			case "in":
				self.frame_fixed=4+(self.frame_fixed%4);
				self.pick(1,self.frame_fixed,2);
			break;
			
			case "splat":			self.pick(1,4,3);						break;
			case "idle_right":		self.pick(1,5,3);breath(_frame);		break;
			case "idle_back":		self.pick(1,6,3);breath(_frame);		break;
			case "idle_left":		self.pick(1,7,3);breath(_frame);		break;

			case "teapot":			self.pick(1,0,4);breath(_frame);		break;
			case "angry":			self.pick(1,1,4);breath(_frame);		break;
			case "confused":		self.pick(1,2,4);breath(_frame);		break;
			case "determind":		self.pick(1,3,4);breath(_frame);		break;
			case "devious":			self.pick(1,4,4);breath(_frame);		break;
			case "embarrassed":		self.pick(1,5,4);breath(_frame);		break;
			case "energetic":		self.pick(1,6,4);breath(_frame);		break;
			case "excited":			self.pick(1,7,4);breath(_frame);		break;
			
// i seem to have replaced happy with the finger
			case "happy":			self.pick(1,7,4);breath(_frame);		break;
			
			case "bird":			self.pick(1,0,5);breath(_frame);		break;
			case "indescribable":	self.pick(1,1,5);breath(_frame);		break;
			case "nerdy":			self.pick(1,2,5);breath(_frame);		break;
			case "sad":				self.pick(1,3,5);breath(_frame);		break;
			case "scared":			self.pick(1,4,5);breath(_frame);		break;
			case "sleepy":			self.pick(1,5,5);breath(_frame);		break;
			case "thoughtful":		self.pick(1,6,5);breath(_frame);		break;
			case "working":			self.pick(1,7,5);breath(_frame);		break;
			
			case "dance":
				self.frame_fixed=self.frame_fixed%6;
				self.pick(1, dance_frames[ self.frame_fixed*2+0 ] , dance_frames[ self.frame_fixed*2+1] );
				breath(_frame);
			break;
		}
		
	}

	self.setup(opts);

	return self;
};

})();
