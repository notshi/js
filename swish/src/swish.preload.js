
var modules=modules || {};

(function(){

	if(modules["swish.preload"]) { return modules["swish.preload"]; }
	var self={};
	modules["swish.preload"]=self;	
	Swish().preload=self;
	
self.preloadimages=[];
self.images=[];

self.progress_ready=0;
self.progress_total=0;
self.progress_percent=100;

self.preloadimages_ready=false;

self.add_image=function(url){
	if( self.preloadimages[url] != url )
	{
		self.preloadimages_ready=false; // full load check again
		self.preloadimages[url]=url;
	}
};

self.check=function(){
	if(self.preloadimages_ready) { return true; }

	self.progress_ready=0;
	self.progress_total=0;
		
	self.preloadimages_ready=true;
	for(i in self.preloadimages)
	{
		self.progress_total++;
		
		if(!self.images[i]) // create new
		{
			self.images[i]=self.img(self.preloadimages[i]); // lookup by id
		}
		
		if( self.images[i].ready() )
		{
			self.progress_ready++;
		}
		else
		{
			self.preloadimages_ready=false;
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

	return self.preloadimages_ready;
};

self.img=function(name){
	if( self.images[name] ) { return self.images[name]; }
	var item={}
	self.images[name]=item;
	
	item.url=name;
	
	item.img = new Image();
	item.img.src = item.url;
	item.scale=-1;
	item.time=0;
	item.already=false;

	item.ready=function(){
		if(item.already) { return true; } // fast short circuit
		
		if( (item.img.width>0) && (item.img.height>0) ) // if we have a size then it loaded ok
		{
			var now=(new Date()).getTime();
			if(item.time==0) { item.time=now; }
			if(item.time+500<(now))  // the browser lies, so wait awhile
			{

//if(!item.said) { item.said=true; console.log("Loaded: "+item.url); }

				item.already=true;
				return true;
			}
			return false;
		}
		return false;
	}

	return item;
};

})();
