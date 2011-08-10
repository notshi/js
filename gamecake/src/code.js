//code
gamecake={}; // a global place to keep our cake

gamecake.code={};

gamecake.setup=function(){};
gamecake.clean=function(){};
gamecake.update=function(){};
gamecake.draw=function(){};

gamecake.opts={};
gamecake.images={};
gamecake.audios={};

gamecake.ticks=0;


(function($) {
	$.fn.gamecake = function(opts) {
		
		gamecake.opts=opts;
		gamecake.game=opts.game;
		
		return this.each(function() {
			var game=opts.game;
			var $this = $(this);
			game.$this=$this;
			game.lastzoom=1;
			
			$this.css("width",game.opts.width+"px");
			$this.css("height",game.opts.height+"px");
			$this.css("background",game.opts.backcolor);
			$this.css("position","relative");
			$this.css("overflow","hidden");
			

// this forces the browser to scroll to this area which is a tad annoying.
			$this.attr("tabindex","0").focus(); //grab initial display focus so that keys work
			
			
			$this.keydown(gamecake.code.input.keydown);
			$this.keyup(gamecake.code.input.keyup);
//			$this.mousedown(gamecake.code.input.keydown);
//			$this.mouseup(gamecake.code.input.keyup);
			$("html").mousemove(function(e){return gamecake.code.input.mousemove(e,game)});
			$("html").mousedown(function(e){return gamecake.code.input.mousedown(e,game)});
			$("html").mouseup(function(e){return gamecake.code.input.mouseup(e,game)});			

			$("body").bind("touchstart",function(e){return gamecake.code.input.touchdown(e,game);});
			$("body").bind("touchmove", function(e){return gamecake.code.input.touchmove(e,game);});
			$("body").bind("touchend",  function(e){return gamecake.code.input.touchup(e,game);});
			$("body").bind("touchcancel",  function(e){return gamecake.code.input.touchup(e,game);});

			var requestAnimationFrame = (function(){
// it may be nice to use these, but they seem to degrade performance...
/*			  return  window.requestAnimationFrame       || 
					  window.webkitRequestAnimationFrame || 
					  window.mozRequestAnimationFrame    || 
					  window.oRequestAnimationFrame      || 
					  window.msRequestAnimationFrame     || */
					  return function(callback,element){
						  window.setTimeout(callback, 1000 / 50);
					  };
			})();
    
			var update;
			

			update=function() {
	   			requestAnimationFrame(update); // we need to always ask to be called again
				
				gamecake.ticks++;
				
// magic scale, this seems to cause slowdown sometimes?
				var p=game.$this.parent();
				var pw=p.width();
				var ph=p.height();
				var z=(pw/game.opts.width);
				if( (z*game.opts.height) > ph ) { z=(ph/game.opts.height); }

				game.$this.css("-webkit-transform:translateZ(0)"); // force hardware acc?
				game.$this.css("position","absolute");
				z=1;
				game.$this.css("left",Math.floor((pw-(game.opts.width*z))/(2*z))+"px");
				game.$this.css("top",Math.floor((ph-(game.opts.height*z))/(2*z))+"px");
/* this zoom is bad, also things screwup when reading input positions with any form of translation...
				if( game.lastzoom!=z )
				{
					game.lastzoom=z;
					game.$this.css("-webkit-transform:translateZ(0)"); // force hardware acc?
					game.$this.css("zoom",z);
					game.$this.css("position","relative");
					game.$this.css("left",Math.floor((pw-(game.opts.width*z))/(2*z))+"px");
					game.$this.css("top",Math.floor((ph-(game.opts.height*z))/(2*z))+"px");
				}
*/				
				if( ! gamecake.code.preload.check(game) ) {
					if(game.preload) { game.preload(gamecake,opts); } // optional preload update
					else { $this.html("<h1>Loading "+gamecake.code.preload.progress_percent+"%</h1>"); }
					return;
				} // wait to preload
				if( gamecake.state!=game ) {
					if(game.preload) { game.preload(gamecake,opts); } // optional preload update
					else { $this.html(""); }
					
					game.sheet=gamecake.gfx.sheet({sx:game.opts.width,sy:game.opts.height}).draw(); // create master sheet
					
					$this.empty(); // clean out anything the preload may have added
						
					if(gamecake.opts.canvas)
					{
						gamecake.$canvas=$("<canvas></canvas>");
						gamecake.$canvas.attr("width",game.opts.width);
						gamecake.$canvas.attr("height",game.opts.height);
						gamecake.$canvas.css("width",game.opts.width+"px");
						gamecake.$canvas.css("height",game.opts.height+"px");
						$this.append( gamecake.$canvas ); // create canvas
						
						gamecake.ctx=gamecake.$canvas.get(0).getContext("2d"); // this is what we draw on

gamecake.ctx.setTransform( 1,0  , 0,1 , 0,0 ); // reset
gamecake.ctx.fillStyle   = '#f00';
gamecake.ctx.fillRect( 0 , 0 , 100 , 100 );
		
							}
					else
					{
						$this.append( game.sheet.div ); // and display it
					}

					gamecake.state=game.setup(gamecake,opts);
				} // setup after preload
								
				gamecake.code.input.update();
				game.update(gamecake,opts);
				game.draw(gamecake,opts);
				
			};
   			update(); // and must start the upadates
		});
	};
	
})(jQuery);
