//sfx

(function(){

gamecake.sfx.audio=function(opts){
	var us={};
		
		if( gamecake.audios[opts.name] )
		{
			opts.url=gamecake.audios[opts.name].url;
		}
		
		us.audio=new Audio();
		
		if(opts.loop)
		{
			us.audio.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
		}
		
		us.audio.src=opts.url;
		us.audio.play();
		
		us.stop=function(){
			us.audio.pause();
			us.audio.currentTime = 0;
		};
		
		return us;
	};

})();
