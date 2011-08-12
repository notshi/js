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
				if(us.sound){us.sound.stop();}
			};
		}

		if( gamecake.audios[opts.name] )
		{
			opts.url=gamecake.audios[opts.name].url;
		}
		
		if(!us.sound)
		{
			
//console.log("new channel "+channel);

			var so={
				id: opts.name,
				url: opts.url,
				stream:false,
				autoLoad:true
			};
			
			if(opts.loop)
			{
				so.loops=9999;
				so.onload=function() { this.play({loops:9999}); };
			}
			
			us.sound=soundManager.createSound(so);

		}
		
		if(!opts.loop)
		{
			if(us.sound){us.sound.play();}
		}	
		return us;
	};

})();
