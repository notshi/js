
(function(){

var self={}
	
gamecake.code.preload=self;

self.check=function(game){
	if(game.preloadimgs_ready) { return true; }
	
	var ready=true;
	
	for(i in game.preloadimgs)
	{
		if(!gamecake.images[i]) // create new
		{
			gamecake.images[i]=self.img(game.preloadimgs[i]); // lookup by id
			gamecake.images[ gamecake.images[i].url ]=gamecake.images[i]; // or lookup by url
		}
		ready=ready && gamecake.images[i].ready();
	}
	if(ready) { game.preloadimgs_ready=true; }
	
	return ready;
};

self.img=function(name){
	if( gamecake.images[name] ) { return gamecake.images[name]; }
	var self={}
	gamecake.images[name]=self;
	
	self.url=gamecake.opts.art+name+gamecake.opts.cachebreak;
	
	self.img = new Image();
	self.img.src = self.url;
	
	self.ready=function(){
		if( (self.img.width>0) && (self.img.height>0) ) { return true; } // loaded ok
		return false;
	}
	
	return self;
};

})();
