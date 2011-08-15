//code


(function() {
	var self={};
	gamecake.code.input=self;

	gamecake.input={};
	var input=gamecake.input;

	input.x=0;
	input.y=0;
	
	input.set_down=[]; // internal state changes
	input.set_up=[];
	input.set_ascii=[];
	
	input.down=[];
	input.up=[];
	input.state=[];
	
	input.ascii=[]; // simple "ascii", array of typed chars for more inputs

	input.events=[]; // last frames events, currently always empty

	function getkey(code){
		if (code == '37') { return "left"; }
		if (code == '38') { return "up"; }
		if (code == '39') { return "right"; }
		if (code == '40') { return "down"; }
		if (code == '32') { return "fire"; }
		if (code == '0')  { return "button"; } // mouse
	}
	
	self.keydown=function(event)
	{
		var key=getkey(event.keyCode);
		input.set_ascii.push(event.keyCode);
		if (key) { 
			input.set_down[key]=true;
		}
		input.set_down["any"]=true;
		return false;
	};
	self.keyup=function(event)
	{
		var key=getkey(event.keyCode);
		if (key) { 
			input.set_up[key]=true;
		}
		input.set_up["any"]=true;
		return false;
	};

	self.touchdown=function(event,game)
	{
		self.touchmove(event,game);
		input.set_down["button"]=true;
		input.set_down["any"]=true;
		return false;
	};
	self.touchup=function(event,game)
	{
		self.touchmove(event,game);
		input.set_up["button"]=true;
		input.set_up["any"]=true;
		return false;
	};
	self.touchmove=function(event,game)
	{
		event.originalEvent.preventDefault();
		var tevent =  event.originalEvent.touches.item(0);
		if(tevent) { 
	  		var pos=game.$this.offset();
			input.x=(tevent.pageX-(pos.left*game.zoom))/game.zoom; // getting local coords is a problem
			input.y=(tevent.pageY-(pos.top*game.zoom))/game.zoom;
		}
		return false;
	};
	
	self.mousemove=function(event,game)
	{
  		var pos=game.$this.offset();
		input.x=(event.pageX-(pos.left*game.zoom))/game.zoom; // getting local coords is a problem
		input.y=(event.pageY-(pos.top*game.zoom))/game.zoom;

//		rollup.dbg.div.html(input.x + " : " + input.y );
//		console.log( input.x + " : " + input.y );
		return false;
	};
	self.mousedown=function(event,game)
	{
		self.mousemove(event,game);
		if(event.button==0)
		{
			input.set_down["button"]=true;
			input.set_down["any"]=true;
		}
		return false;
	};
	self.mouseup=function(event,game)
	{
		self.mousemove(event,game);
		if(event.button==0)
		{
			input.set_up["button"]=true;
			input.set_up["any"]=true;
		}
		return false;
	};

	self.update=function()
	{
		input.ascii=input.set_ascii;
		input.set_ascii=[];
		
		input.down=[];
		input.up=[];
		for(i in input.set_down) {
			if(!input.state[i])
			{
//console.log("down "+i)
				input.down[i]=true;
				input.state[i]=true;
			}
		}
		for(i in input.set_up) {
			if(input.state[i])
			{
//console.log("up "+i)
				input.up[i]=true;
				input.state[i]=false;
			}
		}
		input.set_down=[];
		input.set_up=[];
	};
	
	
	return self;
})();
