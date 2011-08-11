//sfx

(function(){

gamecake.sfx.channels=[];

gamecake.sfx.audio=function(opts){
	
	var channel=opts.channel || 0;
	var us=gamecake.sfx.channels[channel] || {};
		gamecake.sfx.channels[channel]=us;
		
		us.channel=channel;
		
		if(!us.stop)
		{
			us.stop=function(){
				us.audio.pause();
				us.audio.currentTime = 0;
			};
		}

		if( gamecake.audios[opts.name] )
		{
			opts.url=gamecake.audios[opts.name].url;
		}
		
		if(!us.audio)
		{
			
//console.log("new channel "+channel);

			us.audio=new Audio(opts.url);
		}
		else
		{
			if(!us.audio.ended) // force end
			{
				try{
				us.stop();
				}catch(err){
					//ignore
				}
			}
			us.audio.src=opts.url;
		}
		
		if(opts.loop)
		{
			if(!us.func_loop)
			{
				us.func_ended=function() {
					this.currentTime = 0;
					this.play();
				};
			}
			
			us.audio.addEventListener('ended', us.func_loop, false);
		}
		else
		{
			us.audio.removeEventListener('ended', us.func_loop, false);
		}
		
//		us.audio.currentTime = 0;
		us.audio.play();
				
		return us;
	};

})();
