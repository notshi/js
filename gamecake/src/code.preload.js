
(function(){

var self={}
	
gamecake.code.preload=self;

self.check=function(game){
	if(game.preloadimages_ready && game.preloadaudios_ready) { return true; }
	
	var ready;
	
	ready=true;
	for(i in game.preloadimages)
	{
		if(!gamecake.images[i]) // create new
		{
			gamecake.images[i]=self.img(game.preloadimages[i]); // lookup by id
			gamecake.images[ gamecake.images[i].url ]=gamecake.images[i]; // or lookup by url
		}
		ready=ready && gamecake.images[i].ready();
	}
	if(ready) { game.preloadimages_ready=true; }
	
	ready=true;
	for(i in game.preloadaudios)
	{
		if(!gamecake.audios[i]) // create new
		{
			gamecake.audios[i]=self.audio(game.preloadaudios[i]); // lookup by id
			gamecake.audios[ gamecake.audios[i].url ]=gamecake.audios[i]; // or lookup by url
		}
		ready=ready && gamecake.audios[i].ready();
	}
	if(ready) { game.preloadaudios_ready=true; }

	return game.preloadaudios_ready && game.preloadimages_ready;
};

self.img=function(name){
	if( gamecake.images[name] ) { return gamecake.images[name]; }
	var self={}
	gamecake.images[name]=self;
	
	self.url=gamecake.opts.art+name+gamecake.opts.cachebreak;
	
	self.img = new Image();
	self.img.src = self.url;
	
	self.ready=function(){
		if( (self.img.width>0) && (self.img.height>0) ) { return true; } // if we have a size then it loaded ok
		return false;
	}
	
	return self;
};

self.audio=function(name){
	if( gamecake.audios[name] ) { return gamecake.audios[name]; }
	var self={}
	gamecake.audios[name]=self;
	
	self.url=gamecake.opts.art+name+gamecake.opts.cachebreak;
	
	self.audio = new Audio();
	self.audio.src = self.url;
	
	self.ready=function(){
		if( (self.audio.networkState==1) ) { return true; } // loaded ok, the network is idle
		return false;
	}
	
	return self;
};

})();
