
(function(){

var self={}
	
gamecake.code.preload=self;

self.progress_ready=0;
self.progress_total=0;
self.progress_percent=100;

self.check=function(game){
	if(game.preloadimages_ready && game.preloadaudios_ready) { return true; }

	self.progress_ready=0;
	self.progress_total=0;
		
	game.preloadimages_ready=true;
	for(i in game.preloadimages)
	{
		self.progress_total++;
		
		if(!gamecake.images[i]) // create new
		{
			gamecake.images[i]=self.img(game.preloadimages[i]); // lookup by id
			gamecake.images[ gamecake.images[i].url ]=gamecake.images[i]; // or lookup by url
		}
		
		if( gamecake.images[i].ready() )
		{
			self.progress_ready++;
		}
		else
		{
			game.preloadimages_ready=false;
		}
	}
	
	game.preloadaudios_ready=true;
	for(i in game.preloadaudios)
	{
		self.progress_total++;
		
		if(!gamecake.audios[i]) // create new
		{
			gamecake.audios[i]=self.audio(game.preloadaudios[i]); // lookup by id
			gamecake.audios[ gamecake.audios[i].url ]=gamecake.audios[i]; // or lookup by url
		}
		
		if( gamecake.audios[i].ready() )
		{
			self.progress_ready++;
		}
		else
		{
			game.preloadaudios_ready=false;
		}
	}

	if( self.progress_total > 0)
	{
		self.progress_percent=Math.floor(100*self.progress_ready/self.progress_total);
	}
	else
	{
		self.progress_percent=100;
	}

	return game.preloadaudios_ready && game.preloadimages_ready && gamecake.sfx.sound_ready; // and wait for sound lib to load
};

self.img=function(name){
	if( gamecake.images[name] ) { return gamecake.images[name]; }
	var self={}
	gamecake.images[name]=self;
	
	self.url=gamecake.opts.art+name+gamecake.opts.cachebreak;
	
	self.img = new Image();
	self.img.src = self.url;
	self.scale=-1;
	self.time=0;

	self.ready=function(){
		if( (self.img.width>0) && (self.img.height>0) ) // if we have a size then it loaded ok
		{
			var now=(new Date()).getTime();
			if(self.time==0) { self.time=now; }
			if(self.time+500<(now))  // the browser lies, so wait awhile
			{
				return true;
			}
//			if(!self.said) { self.said=true; console.log("Loaded: "+self.url); }
			return false;
		}
		return false;
	}
	
	self.get=function(scale){
//console.log("scaled "+name+" "+scale);
		if(scale==1) { return self.img; }
		if(scale==self.scale) { return self.$canvas.get(0); }
		
		var gs=gamecake.scale;
		var hx=self.img.width;
		var hy=self.img.height;

		if(!self.$canvas) {
			self.$canvas=$("<canvas></canvas>");
		}
		
		
		self.$canvas.attr("width",hx/gs);
		self.$canvas.attr("height",hy/gs);
		
		self.ctx=self.$canvas.get(0).getContext("2d");
		self.ctx.setTransform( 1/gs,0  , 0,1/gs , 0,0 );
		self.ctx.drawImage(self.img , 0,0 , hx,hy , 0,0 , hx,hy);
		
		self.scale=scale;
//console.log("scaled "+name+" "+scale);
		return self.$canvas.get(0);
	}

	return self;
};

self.audio=function(name){
	if( gamecake.audios[name] ) { return gamecake.audios[name]; }
	var self={}
	gamecake.audios[name]=self;
	
	self.url=gamecake.opts.art+name+gamecake.opts.cachebreak;
	
	if(window.Audio)
	{
		self.audio = new Audio();
	}
	else
	{
		self.audio = {};
	}
	self.audio.preload = "auto";
	self.audio.src = self.url;
	
	self.ready=function(){ // this shit is so fucked we just always return true...
		return true;
	}
	
	return self;
};

})();
