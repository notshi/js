require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/calacts.js":[function(require,module,exports){
module.exports=require('uVYM5p');
},{}],"uVYM5p":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts_main").clone() );
	};

	calacts.template.load("template.html",calacts.fill);
	
	return calacts;

};

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvY2FsYWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBscz1mdW5jdGlvbihhKSB7IGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdChhLHtkZXB0aDpudWxsfSkpOyB9XG5cbmV4cG9ydHMuc2V0dXA9ZnVuY3Rpb24ob3B0cyl7XG5cblx0dmFyIGNhbGFjdHM9e29wdHM6b3B0c307XG5cblxuXHRjYWxhY3RzLnRlbXBsYXRlPSQoXCI8ZGl2PjwvZGl2PlwiKTtcblx0XHRcblx0Y2FsYWN0cy5maWxsPWZ1bmN0aW9uKCl7XG5cdFx0b3B0cy5kaXYuZW1wdHkoKS5hcHBlbmQoIGNhbGFjdHMudGVtcGxhdGUuZmluZChcIi5jYWxhY3RzX21haW5cIikuY2xvbmUoKSApO1xuXHR9O1xuXG5cdGNhbGFjdHMudGVtcGxhdGUubG9hZChcInRlbXBsYXRlLmh0bWxcIixjYWxhY3RzLmZpbGwpO1xuXHRcblx0cmV0dXJuIGNhbGFjdHM7XG5cbn07XG4iXX0=
