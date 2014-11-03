require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"uVYM5p":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};
	
	var ouical=require('./ouical.js');


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts_main").clone() );


	var now = new Date();
	calacts.monday = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
	console.log(calacts.monday);



		
var myCalendar = 


		$(".calacts .tab").empty();
		
		for(var i=0;i<calacts.slots.length;i++)
		{
			var days=0;
			
			var v=calacts.slots[i];
			var l=calacts.template.find(".calacts_slot").clone();


			switch(v.day)
			{
				case "monday": days=0; break;
				case "tuesday": days=1; break;
				case "wednesday": days=2; break;
				case "thursday": days=3; break;
				case "friday": days=4; break;
				case "saturday": days=5; break;
				case "sunday": days=6; break;
			}
			
			console.log(v.time);
			var a=v.time.split("-");
			var a0=a[0].split(":");
			var a1=a[1].split(":");
			
			l.find(".act").text(v.act);
			l.find(".day").text(v.day);
			l.find(".time").text(v.time);
			l.find(".place").text(v.place);
			l.find(".cal").append(ouical.createCalendar({
  options: {
    class: 'calclass'+i,
  },
  data: {
    // Event title
    title: v.act+' at '+v.place,

    // Event start date
    start: new Date(calacts.monday.getTime() + (days*24*60*60*1000) + (a0[0]*60*60*1000) + (a0[1]*60*1000) ),
    end:   new Date(calacts.monday.getTime() + (days*24*60*60*1000) + (a1[0]*60*60*1000) + (a1[1]*60*1000) ),

    // Event Address
    address: calacts.places[v.place].address,

    // Event Description
    description: v.act+' at '+v.place
  }
}));
			
			$(".calacts .tab").append( l );
		}

		
	};

// load and parse raw CSV
	$(function() {
		$.ajax({
			type: "GET",
			url: "calacts.csv",
			dataType: "text",
			success: function(data) {
				calacts.csv=$.csv.toArrays(data);
				calacts.ParseCSV()
				calacts.template.load("template.html",calacts.fill);
//				console.log(calacts.csv);
			}
		 });
	});

	calacts.ParseCSV=function()
	{
		calacts.objs=[];
		for(var j=1;j<calacts.csv.length;j++) // first line is header
		{
			var t={};
			for(var i=0;i<calacts.csv[0].length;i++)
			{
				t[ calacts.csv[0][i] ]=calacts.csv[j][i];
			}
			calacts.objs[calacts.objs.length]=t;
		}
		calacts.places={};
		calacts.slots=[];
		for(var i=0;i<calacts.objs.length;i++)
		{
			var t={};
			t.name=calacts.objs[i]["LeisureCentreName"];
			t.address=calacts.objs[i]["Address"];
			t.phone=calacts.objs[i]["Telephone"];
			t.comments=calacts.objs[i]["Comments"];
			calacts.places[t.name]=t;
			
			for(var n in calacts.objs[i])
			{
				var dur=calacts.objs[i][n];
				if( dur != "" )
				{
					var ns=n.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
					var na=ns.split(" ");
					if( (na[1]=="monday") || (na[1]=="tuesday") || (na[1]=="wednesday") || (na[1]=="thursday") || (na[1]=="friday") || (na[1]=="saturday") || (na[1]=="sunday"))
					{
						var p={};
						p.day=na[1];
						p.act=na[0];
						p.place=t.name;
						p.time=dur.split(" ");p.time=p.time[p.time.length-1]; // last bit
						calacts.slots[calacts.slots.length]=p;
					}
				}
			}
		}
//		console.log(calacts.places);
//		console.log(calacts.slots);
	};
	
	return calacts;

};

},{"./ouical.js":3}],"./js/calacts.js":[function(require,module,exports){
module.exports=require('uVYM5p');
},{}],3:[function(require,module,exports){
;(function(exports) {
  var MS_IN_MINUTES = 60 * 1000;

  var formatTime = function(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  var calculateEndTime = function(event) {
    return event.end ?
      formatTime(event.end) :
      formatTime(new Date(event.start.getTime() + (event.duration * MS_IN_MINUTES)));
  };

  var calendarGenerators = {
    google: function(event) {
      var startTime = formatTime(event.start);
      var endTime = calculateEndTime(event);

      var href = encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        '&text=' + (event.title || ''),
        '&dates=' + (startTime || ''),
        '/' + (endTime || ''),
        '&details=' + (event.description || ''),
        '&location=' + (event.address || ''),
        '&sprop=&sprop=name:'
      ].join(''));
      return '<a class="icon-google" target="_blank" href="' +
        href + '">Google Calendar</a>';
    },

    yahoo: function(event) {
      var eventDuration = event.end ?
        ((event.end.getTime() - event.start.getTime())/ MS_IN_MINUTES) :
        event.duration;

      // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
      var yahooHourDuration = eventDuration < 600 ?
        '0' + Math.floor((eventDuration / 60)) :
        Math.floor((eventDuration / 60)) + '';

      var yahooMinuteDuration = eventDuration % 60 < 10 ?
        '0' + eventDuration % 60 :
        eventDuration % 60 + '';

      var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

      // Remove timezone from event time
      var st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() *
                                                  MS_IN_MINUTES))) || '';

      var href = encodeURI([
        'http://calendar.yahoo.com/?v=60&view=d&type=20',
        '&title=' + (event.title || ''),
        '&st=' + st,
        '&dur=' + (yahooEventDuration || ''),
        '&desc=' + (event.description || ''),
        '&in_loc=' + (event.address || '')
      ].join(''));

      return '<a class="icon-yahoo" target="_blank" href="' +
        href + '">Yahoo! Calendar</a>';
    },

    ics: function(event, eClass, calendarName) {
      var startTime = formatTime(event.start);
      var endTime = calculateEndTime(event);

      var href = encodeURI(
        'data:text/calendar;charset=utf8,' + [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + (startTime || ''),
          'DTEND:' + (endTime || ''),
          'SUMMARY:' + (event.title || ''),
          'DESCRIPTION:' + (event.description || ''),
          'LOCATION:' + (event.address || ''),
          'END:VEVENT',
          'END:VCALENDAR'].join('\n'));

      return '<a class="' + eClass + '" target="_blank" href="' +
        href + '">' + calendarName + ' Calendar</a>';
    },

    ical: function(event) {
      return this.ics(event, 'icon-ical', 'iCal');
    },

    outlook: function(event) {
      return this.ics(event, 'icon-outlook', 'Outlook');
    }
  };

  var generateCalendars = function(event) {
    return {
      google: calendarGenerators.google(event),
      yahoo: calendarGenerators.yahoo(event),
      ical: calendarGenerators.ical(event),
      outlook: calendarGenerators.outlook(event)
    };
  };

  // Create CSS
  var addCSS = function() {
    if (!document.getElementById('ouical-css')) {
      document.getElementsByTagName('head')[0].appendChild(generateCSS());
    }
  };

  var generateCSS = function() {
    var styles = document.createElement('style');
    styles.id = 'ouical-css';

    styles.innerHTML = "#add-to-calendar-checkbox-label{cursor:pointer}.add-to-calendar-checkbox~a{display:none}.add-to-calendar-checkbox:checked~a{display:block;width:150px;margin-left:20px}input[type=checkbox].add-to-calendar-checkbox{position:absolute;top:-9999px;left:-9999px}.add-to-calendar-checkbox~a:before{width:16px;height:16px;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAQCAYAAACIoli7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MzJCRDU2NUE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0MzJCRDU2NkE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzMkJENTYzQTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQzMkJENTY0QTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1Gcb3QAACh1JREFUeNrEWAtw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);margin-right:.5em;content:' '}.icon-ical:before{background-position:-68px 0}.icon-outlook:before{}.icon-yahoo:before{background-position:-36px +4px}.icon-google:before{background-position:-52px 0}";

    return styles;
  };

  // Make sure we have the necessary event data, such as start time and event duration
  var validParams = function(params) {
    return params.data !== undefined && params.data.start !== undefined &&
      (params.data.end !== undefined || params.data.duration !== undefined);
  };

  var generateMarkup = function(calendars, clazz, calendarId) {
    var result = document.createElement('div');

    result.innerHTML = '<label for="checkbox-for-' +
      calendarId + '" class="add-to-calendar-checkbox">+ Add to my Calendar</label>';
    result.innerHTML += '<input name="add-to-calendar-checkbox" class="add-to-calendar-checkbox" id="checkbox-for-' + calendarId + '" type="checkbox">';

    Object.keys(calendars).forEach(function(services) {
      result.innerHTML += calendars[services];
    });

    result.className = 'add-to-calendar';
    if (clazz !== undefined) {
      result.className += (' ' + clazz);
    }

    addCSS();

    result.id = calendarId;
    return result;
  };

  var getClass = function(params) {
    if (params.options && params.options.class) {
      return params.options.class;
    }
  };

  var getOrGenerateCalendarId = function(params) {
    return params.options && params.options.id ?
      params.options.id :
      Math.floor(Math.random() * 1000000); // Generate a 6-digit random ID
  };

  exports.createCalendar = function(params) {
    if (!validParams(params)) {
      console.log('Event details missing.');
      return;
    }

    return generateMarkup(generateCalendars(params.data),
                          getClass(params),
                          getOrGenerateCalendarId(params));
  };
})(this);

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvY2FsYWN0cy5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvb3VpY2FsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgbHM9ZnVuY3Rpb24oYSkgeyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoYSx7ZGVwdGg6bnVsbH0pKTsgfVxuXG5leHBvcnRzLnNldHVwPWZ1bmN0aW9uKG9wdHMpe1xuXG5cdHZhciBjYWxhY3RzPXtvcHRzOm9wdHN9O1xuXHRcblx0dmFyIG91aWNhbD1yZXF1aXJlKCcuL291aWNhbC5qcycpO1xuXG5cblx0Y2FsYWN0cy50ZW1wbGF0ZT0kKFwiPGRpdj48L2Rpdj5cIik7XG5cdFx0XG5cdGNhbGFjdHMuZmlsbD1mdW5jdGlvbigpe1xuXHRcdG9wdHMuZGl2LmVtcHR5KCkuYXBwZW5kKCBjYWxhY3RzLnRlbXBsYXRlLmZpbmQoXCIuY2FsYWN0c19tYWluXCIpLmNsb25lKCkgKTtcblxuXG5cdHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuXHRjYWxhY3RzLm1vbmRheSA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKSsoOCAtIG5vdy5nZXREYXkoKSkpO1xuXHRjb25zb2xlLmxvZyhjYWxhY3RzLm1vbmRheSk7XG5cblxuXG5cdFx0XG52YXIgbXlDYWxlbmRhciA9IFxuXG5cblx0XHQkKFwiLmNhbGFjdHMgLnRhYlwiKS5lbXB0eSgpO1xuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8Y2FsYWN0cy5zbG90cy5sZW5ndGg7aSsrKVxuXHRcdHtcblx0XHRcdHZhciBkYXlzPTA7XG5cdFx0XHRcblx0XHRcdHZhciB2PWNhbGFjdHMuc2xvdHNbaV07XG5cdFx0XHR2YXIgbD1jYWxhY3RzLnRlbXBsYXRlLmZpbmQoXCIuY2FsYWN0c19zbG90XCIpLmNsb25lKCk7XG5cblxuXHRcdFx0c3dpdGNoKHYuZGF5KVxuXHRcdFx0e1xuXHRcdFx0XHRjYXNlIFwibW9uZGF5XCI6IGRheXM9MDsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ0dWVzZGF5XCI6IGRheXM9MTsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ3ZWRuZXNkYXlcIjogZGF5cz0yOyBicmVhaztcblx0XHRcdFx0Y2FzZSBcInRodXJzZGF5XCI6IGRheXM9MzsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJmcmlkYXlcIjogZGF5cz00OyBicmVhaztcblx0XHRcdFx0Y2FzZSBcInNhdHVyZGF5XCI6IGRheXM9NTsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJzdW5kYXlcIjogZGF5cz02OyBicmVhaztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2codi50aW1lKTtcblx0XHRcdHZhciBhPXYudGltZS5zcGxpdChcIi1cIik7XG5cdFx0XHR2YXIgYTA9YVswXS5zcGxpdChcIjpcIik7XG5cdFx0XHR2YXIgYTE9YVsxXS5zcGxpdChcIjpcIik7XG5cdFx0XHRcblx0XHRcdGwuZmluZChcIi5hY3RcIikudGV4dCh2LmFjdCk7XG5cdFx0XHRsLmZpbmQoXCIuZGF5XCIpLnRleHQodi5kYXkpO1xuXHRcdFx0bC5maW5kKFwiLnRpbWVcIikudGV4dCh2LnRpbWUpO1xuXHRcdFx0bC5maW5kKFwiLnBsYWNlXCIpLnRleHQodi5wbGFjZSk7XG5cdFx0XHRsLmZpbmQoXCIuY2FsXCIpLmFwcGVuZChvdWljYWwuY3JlYXRlQ2FsZW5kYXIoe1xuICBvcHRpb25zOiB7XG4gICAgY2xhc3M6ICdjYWxjbGFzcycraSxcbiAgfSxcbiAgZGF0YToge1xuICAgIC8vIEV2ZW50IHRpdGxlXG4gICAgdGl0bGU6IHYuYWN0KycgYXQgJyt2LnBsYWNlLFxuXG4gICAgLy8gRXZlbnQgc3RhcnQgZGF0ZVxuICAgIHN0YXJ0OiBuZXcgRGF0ZShjYWxhY3RzLm1vbmRheS5nZXRUaW1lKCkgKyAoZGF5cyoyNCo2MCo2MCoxMDAwKSArIChhMFswXSo2MCo2MCoxMDAwKSArIChhMFsxXSo2MCoxMDAwKSApLFxuICAgIGVuZDogICBuZXcgRGF0ZShjYWxhY3RzLm1vbmRheS5nZXRUaW1lKCkgKyAoZGF5cyoyNCo2MCo2MCoxMDAwKSArIChhMVswXSo2MCo2MCoxMDAwKSArIChhMVsxXSo2MCoxMDAwKSApLFxuXG4gICAgLy8gRXZlbnQgQWRkcmVzc1xuICAgIGFkZHJlc3M6IGNhbGFjdHMucGxhY2VzW3YucGxhY2VdLmFkZHJlc3MsXG5cbiAgICAvLyBFdmVudCBEZXNjcmlwdGlvblxuICAgIGRlc2NyaXB0aW9uOiB2LmFjdCsnIGF0ICcrdi5wbGFjZVxuICB9XG59KSk7XG5cdFx0XHRcblx0XHRcdCQoXCIuY2FsYWN0cyAudGFiXCIpLmFwcGVuZCggbCApO1xuXHRcdH1cblxuXHRcdFxuXHR9O1xuXG4vLyBsb2FkIGFuZCBwYXJzZSByYXcgQ1NWXG5cdCQoZnVuY3Rpb24oKSB7XG5cdFx0JC5hamF4KHtcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IFwiY2FsYWN0cy5jc3ZcIixcblx0XHRcdGRhdGFUeXBlOiBcInRleHRcIixcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0Y2FsYWN0cy5jc3Y9JC5jc3YudG9BcnJheXMoZGF0YSk7XG5cdFx0XHRcdGNhbGFjdHMuUGFyc2VDU1YoKVxuXHRcdFx0XHRjYWxhY3RzLnRlbXBsYXRlLmxvYWQoXCJ0ZW1wbGF0ZS5odG1sXCIsY2FsYWN0cy5maWxsKTtcbi8vXHRcdFx0XHRjb25zb2xlLmxvZyhjYWxhY3RzLmNzdik7XG5cdFx0XHR9XG5cdFx0IH0pO1xuXHR9KTtcblxuXHRjYWxhY3RzLlBhcnNlQ1NWPWZ1bmN0aW9uKClcblx0e1xuXHRcdGNhbGFjdHMub2Jqcz1bXTtcblx0XHRmb3IodmFyIGo9MTtqPGNhbGFjdHMuY3N2Lmxlbmd0aDtqKyspIC8vIGZpcnN0IGxpbmUgaXMgaGVhZGVyXG5cdFx0e1xuXHRcdFx0dmFyIHQ9e307XG5cdFx0XHRmb3IodmFyIGk9MDtpPGNhbGFjdHMuY3N2WzBdLmxlbmd0aDtpKyspXG5cdFx0XHR7XG5cdFx0XHRcdHRbIGNhbGFjdHMuY3N2WzBdW2ldIF09Y2FsYWN0cy5jc3Zbal1baV07XG5cdFx0XHR9XG5cdFx0XHRjYWxhY3RzLm9ianNbY2FsYWN0cy5vYmpzLmxlbmd0aF09dDtcblx0XHR9XG5cdFx0Y2FsYWN0cy5wbGFjZXM9e307XG5cdFx0Y2FsYWN0cy5zbG90cz1bXTtcblx0XHRmb3IodmFyIGk9MDtpPGNhbGFjdHMub2Jqcy5sZW5ndGg7aSsrKVxuXHRcdHtcblx0XHRcdHZhciB0PXt9O1xuXHRcdFx0dC5uYW1lPWNhbGFjdHMub2Jqc1tpXVtcIkxlaXN1cmVDZW50cmVOYW1lXCJdO1xuXHRcdFx0dC5hZGRyZXNzPWNhbGFjdHMub2Jqc1tpXVtcIkFkZHJlc3NcIl07XG5cdFx0XHR0LnBob25lPWNhbGFjdHMub2Jqc1tpXVtcIlRlbGVwaG9uZVwiXTtcblx0XHRcdHQuY29tbWVudHM9Y2FsYWN0cy5vYmpzW2ldW1wiQ29tbWVudHNcIl07XG5cdFx0XHRjYWxhY3RzLnBsYWNlc1t0Lm5hbWVdPXQ7XG5cdFx0XHRcblx0XHRcdGZvcih2YXIgbiBpbiBjYWxhY3RzLm9ianNbaV0pXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBkdXI9Y2FsYWN0cy5vYmpzW2ldW25dO1xuXHRcdFx0XHRpZiggZHVyICE9IFwiXCIgKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIG5zPW4ucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR2YXIgbmE9bnMuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGlmKCAobmFbMV09PVwibW9uZGF5XCIpIHx8IChuYVsxXT09XCJ0dWVzZGF5XCIpIHx8IChuYVsxXT09XCJ3ZWRuZXNkYXlcIikgfHwgKG5hWzFdPT1cInRodXJzZGF5XCIpIHx8IChuYVsxXT09XCJmcmlkYXlcIikgfHwgKG5hWzFdPT1cInNhdHVyZGF5XCIpIHx8IChuYVsxXT09XCJzdW5kYXlcIikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIHA9e307XG5cdFx0XHRcdFx0XHRwLmRheT1uYVsxXTtcblx0XHRcdFx0XHRcdHAuYWN0PW5hWzBdO1xuXHRcdFx0XHRcdFx0cC5wbGFjZT10Lm5hbWU7XG5cdFx0XHRcdFx0XHRwLnRpbWU9ZHVyLnNwbGl0KFwiIFwiKTtwLnRpbWU9cC50aW1lW3AudGltZS5sZW5ndGgtMV07IC8vIGxhc3QgYml0XG5cdFx0XHRcdFx0XHRjYWxhY3RzLnNsb3RzW2NhbGFjdHMuc2xvdHMubGVuZ3RoXT1wO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cbi8vXHRcdGNvbnNvbGUubG9nKGNhbGFjdHMucGxhY2VzKTtcbi8vXHRcdGNvbnNvbGUubG9nKGNhbGFjdHMuc2xvdHMpO1xuXHR9O1xuXHRcblx0cmV0dXJuIGNhbGFjdHM7XG5cbn07XG4iLCI7KGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiAgdmFyIE1TX0lOX01JTlVURVMgPSA2MCAqIDEwMDA7XG5cbiAgdmFyIGZvcm1hdFRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKS5yZXBsYWNlKC8tfDp8XFwuXFxkKy9nLCAnJyk7XG4gIH07XG5cbiAgdmFyIGNhbGN1bGF0ZUVuZFRpbWUgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiBldmVudC5lbmQgP1xuICAgICAgZm9ybWF0VGltZShldmVudC5lbmQpIDpcbiAgICAgIGZvcm1hdFRpbWUobmV3IERhdGUoZXZlbnQuc3RhcnQuZ2V0VGltZSgpICsgKGV2ZW50LmR1cmF0aW9uICogTVNfSU5fTUlOVVRFUykpKTtcbiAgfTtcblxuICB2YXIgY2FsZW5kYXJHZW5lcmF0b3JzID0ge1xuICAgIGdvb2dsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHZhciBzdGFydFRpbWUgPSBmb3JtYXRUaW1lKGV2ZW50LnN0YXJ0KTtcbiAgICAgIHZhciBlbmRUaW1lID0gY2FsY3VsYXRlRW5kVGltZShldmVudCk7XG5cbiAgICAgIHZhciBocmVmID0gZW5jb2RlVVJJKFtcbiAgICAgICAgJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vY2FsZW5kYXIvcmVuZGVyJyxcbiAgICAgICAgJz9hY3Rpb249VEVNUExBVEUnLFxuICAgICAgICAnJnRleHQ9JyArIChldmVudC50aXRsZSB8fCAnJyksXG4gICAgICAgICcmZGF0ZXM9JyArIChzdGFydFRpbWUgfHwgJycpLFxuICAgICAgICAnLycgKyAoZW5kVGltZSB8fCAnJyksXG4gICAgICAgICcmZGV0YWlscz0nICsgKGV2ZW50LmRlc2NyaXB0aW9uIHx8ICcnKSxcbiAgICAgICAgJyZsb2NhdGlvbj0nICsgKGV2ZW50LmFkZHJlc3MgfHwgJycpLFxuICAgICAgICAnJnNwcm9wPSZzcHJvcD1uYW1lOidcbiAgICAgIF0uam9pbignJykpO1xuICAgICAgcmV0dXJuICc8YSBjbGFzcz1cImljb24tZ29vZ2xlXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgK1xuICAgICAgICBocmVmICsgJ1wiPkdvb2dsZSBDYWxlbmRhcjwvYT4nO1xuICAgIH0sXG5cbiAgICB5YWhvbzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHZhciBldmVudER1cmF0aW9uID0gZXZlbnQuZW5kID9cbiAgICAgICAgKChldmVudC5lbmQuZ2V0VGltZSgpIC0gZXZlbnQuc3RhcnQuZ2V0VGltZSgpKS8gTVNfSU5fTUlOVVRFUykgOlxuICAgICAgICBldmVudC5kdXJhdGlvbjtcblxuICAgICAgLy8gWWFob28gZGF0ZXMgYXJlIGNyYXp5LCB3ZSBuZWVkIHRvIGNvbnZlcnQgdGhlIGR1cmF0aW9uIGZyb20gbWludXRlcyB0byBoaDptbVxuICAgICAgdmFyIHlhaG9vSG91ckR1cmF0aW9uID0gZXZlbnREdXJhdGlvbiA8IDYwMCA/XG4gICAgICAgICcwJyArIE1hdGguZmxvb3IoKGV2ZW50RHVyYXRpb24gLyA2MCkpIDpcbiAgICAgICAgTWF0aC5mbG9vcigoZXZlbnREdXJhdGlvbiAvIDYwKSkgKyAnJztcblxuICAgICAgdmFyIHlhaG9vTWludXRlRHVyYXRpb24gPSBldmVudER1cmF0aW9uICUgNjAgPCAxMCA/XG4gICAgICAgICcwJyArIGV2ZW50RHVyYXRpb24gJSA2MCA6XG4gICAgICAgIGV2ZW50RHVyYXRpb24gJSA2MCArICcnO1xuXG4gICAgICB2YXIgeWFob29FdmVudER1cmF0aW9uID0geWFob29Ib3VyRHVyYXRpb24gKyB5YWhvb01pbnV0ZUR1cmF0aW9uO1xuXG4gICAgICAvLyBSZW1vdmUgdGltZXpvbmUgZnJvbSBldmVudCB0aW1lXG4gICAgICB2YXIgc3QgPSBmb3JtYXRUaW1lKG5ldyBEYXRlKGV2ZW50LnN0YXJ0IC0gKGV2ZW50LnN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNU19JTl9NSU5VVEVTKSkpIHx8ICcnO1xuXG4gICAgICB2YXIgaHJlZiA9IGVuY29kZVVSSShbXG4gICAgICAgICdodHRwOi8vY2FsZW5kYXIueWFob28uY29tLz92PTYwJnZpZXc9ZCZ0eXBlPTIwJyxcbiAgICAgICAgJyZ0aXRsZT0nICsgKGV2ZW50LnRpdGxlIHx8ICcnKSxcbiAgICAgICAgJyZzdD0nICsgc3QsXG4gICAgICAgICcmZHVyPScgKyAoeWFob29FdmVudER1cmF0aW9uIHx8ICcnKSxcbiAgICAgICAgJyZkZXNjPScgKyAoZXZlbnQuZGVzY3JpcHRpb24gfHwgJycpLFxuICAgICAgICAnJmluX2xvYz0nICsgKGV2ZW50LmFkZHJlc3MgfHwgJycpXG4gICAgICBdLmpvaW4oJycpKTtcblxuICAgICAgcmV0dXJuICc8YSBjbGFzcz1cImljb24teWFob29cIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArXG4gICAgICAgIGhyZWYgKyAnXCI+WWFob28hIENhbGVuZGFyPC9hPic7XG4gICAgfSxcblxuICAgIGljczogZnVuY3Rpb24oZXZlbnQsIGVDbGFzcywgY2FsZW5kYXJOYW1lKSB7XG4gICAgICB2YXIgc3RhcnRUaW1lID0gZm9ybWF0VGltZShldmVudC5zdGFydCk7XG4gICAgICB2YXIgZW5kVGltZSA9IGNhbGN1bGF0ZUVuZFRpbWUoZXZlbnQpO1xuXG4gICAgICB2YXIgaHJlZiA9IGVuY29kZVVSSShcbiAgICAgICAgJ2RhdGE6dGV4dC9jYWxlbmRhcjtjaGFyc2V0PXV0ZjgsJyArIFtcbiAgICAgICAgICAnQkVHSU46VkNBTEVOREFSJyxcbiAgICAgICAgICAnVkVSU0lPTjoyLjAnLFxuICAgICAgICAgICdCRUdJTjpWRVZFTlQnLFxuICAgICAgICAgICdVUkw6JyArIGRvY3VtZW50LlVSTCxcbiAgICAgICAgICAnRFRTVEFSVDonICsgKHN0YXJ0VGltZSB8fCAnJyksXG4gICAgICAgICAgJ0RURU5EOicgKyAoZW5kVGltZSB8fCAnJyksXG4gICAgICAgICAgJ1NVTU1BUlk6JyArIChldmVudC50aXRsZSB8fCAnJyksXG4gICAgICAgICAgJ0RFU0NSSVBUSU9OOicgKyAoZXZlbnQuZGVzY3JpcHRpb24gfHwgJycpLFxuICAgICAgICAgICdMT0NBVElPTjonICsgKGV2ZW50LmFkZHJlc3MgfHwgJycpLFxuICAgICAgICAgICdFTkQ6VkVWRU5UJyxcbiAgICAgICAgICAnRU5EOlZDQUxFTkRBUiddLmpvaW4oJ1xcbicpKTtcblxuICAgICAgcmV0dXJuICc8YSBjbGFzcz1cIicgKyBlQ2xhc3MgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgK1xuICAgICAgICBocmVmICsgJ1wiPicgKyBjYWxlbmRhck5hbWUgKyAnIENhbGVuZGFyPC9hPic7XG4gICAgfSxcblxuICAgIGljYWw6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5pY3MoZXZlbnQsICdpY29uLWljYWwnLCAnaUNhbCcpO1xuICAgIH0sXG5cbiAgICBvdXRsb29rOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuaWNzKGV2ZW50LCAnaWNvbi1vdXRsb29rJywgJ091dGxvb2snKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdlbmVyYXRlQ2FsZW5kYXJzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ29vZ2xlOiBjYWxlbmRhckdlbmVyYXRvcnMuZ29vZ2xlKGV2ZW50KSxcbiAgICAgIHlhaG9vOiBjYWxlbmRhckdlbmVyYXRvcnMueWFob28oZXZlbnQpLFxuICAgICAgaWNhbDogY2FsZW5kYXJHZW5lcmF0b3JzLmljYWwoZXZlbnQpLFxuICAgICAgb3V0bG9vazogY2FsZW5kYXJHZW5lcmF0b3JzLm91dGxvb2soZXZlbnQpXG4gICAgfTtcbiAgfTtcblxuICAvLyBDcmVhdGUgQ1NTXG4gIHZhciBhZGRDU1MgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdWljYWwtY3NzJykpIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoZ2VuZXJhdGVDU1MoKSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZW5lcmF0ZUNTUyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlcy5pZCA9ICdvdWljYWwtY3NzJztcblxuICAgIHN0eWxlcy5pbm5lckhUTUwgPSBcIiNhZGQtdG8tY2FsZW5kYXItY2hlY2tib3gtbGFiZWx7Y3Vyc29yOnBvaW50ZXJ9LmFkZC10by1jYWxlbmRhci1jaGVja2JveH5he2Rpc3BsYXk6bm9uZX0uYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94OmNoZWNrZWR+YXtkaXNwbGF5OmJsb2NrO3dpZHRoOjE1MHB4O21hcmdpbi1sZWZ0OjIwcHh9aW5wdXRbdHlwZT1jaGVja2JveF0uYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94e3Bvc2l0aW9uOmFic29sdXRlO3RvcDotOTk5OXB4O2xlZnQ6LTk5OTlweH0uYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94fmE6YmVmb3Jle3dpZHRoOjE2cHg7aGVpZ2h0OjE2cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZC1pbWFnZTp1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFGUUFBQUFRQ0FZQUFBQ0lvbGk3QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5UnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU15MWpNREV4SURZMkxqRTBOVFkyTVN3Z01qQXhNaTh3TWk4d05pMHhORG8xTmpveU55QWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROaUFvVFdGamFXNTBiM05vS1NJZ2VHMXdUVTA2U1c1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvME16SkNSRFUyTlVFMU1ESXhNVVV5T1RZMVEwRXdOVGt4TkVKRE9VSXdOQ0lnZUcxd1RVMDZSRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG8wTXpKQ1JEVTJOa0UxTURJeE1VVXlPVFkxUTBFd05Ua3hORUpET1VJd05DSStJRHg0YlhCTlRUcEVaWEpwZG1Wa1JuSnZiU0J6ZEZKbFpqcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPalF6TWtKRU5UWXpRVFV3TWpFeFJUSTVOalZEUVRBMU9URTBRa001UWpBMElpQnpkRkpsWmpwa2IyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qUXpNa0pFTlRZMFFUVXdNakV4UlRJNU5qVkRRVEExT1RFMFFrTTVRakEwSWk4K0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4KzFHY2IzUUFBQ2gxSlJFRlVlTnJFV0F0d1ZOVVovdTdkOXl2WkpCdE1JQzhlQmhJS01rUUlocUlCS2lyV3dwU1cwZGFoQ2lyMWdRaFdnMlhLak5ScVI3QWpRNlFqZ2xCRlJJVzIwS21DMEtSWWpSWU1DWkdIR0VqSVkwT3kyVTMybFgzZDNYdjZueHVTYkVKQ1FOdnBuL24zM1BPZnh6MzN1OS8vdUJHYUJRRmNNaGdycEdZQzZkZGsremZpWktneHN2T0c0YnVKTUdBVE50emNxNGwrV1N0YnNHZ3B2T2lFTHBnQldldEdRR05Dc3RTR2tLd0gxRWswNG9WTkZVWlFzRUFqZWRDZzBpQlJWaXZyUDczN0NMK0g4TmE3ZjdscFJGYTJjT2ZNcWRVbjluM0FSR2M3TkxFWUpqNjJRbGU2WjMvWmxBVHQ4Mm1JTlY0UVZQVjMzSFZYbUsvMWJSZ1B2c3Q2MHZ6WGdKelpaODRVbE9mblYxTC9ZdndoQnhrN1E3cXVaM3paTHJ2U2l2UnkrUHRSMFk4b1VpdDJQNythV201VGlmeGFoRXJWUFdmZC9KUkJRYU5WakEyQ0loc2VjRXdJdWJIekIzK0NRV05ETkJDQ3l1aUVDNk5ncFYzYWdrQ3N6WVdrbkJUSW5qQU1GaDIwSEFvMS9RUUZWTTdLdzlhbHk3RDF6ZTJpSkVlbWhidThNemYrK3JrVk5HTWthUzdwdUthZGIweXViR3NjcC9XYTNyYzBuTlhWSjZSc0p2c2FVaG1YdDVveVp2MzZlNG8vL2hpMXRiVW9ualdyWU5UczJRWHhoeXd1TCs4Ym16ZXZvRzdkT3UzZ2o4UG8yTUlWWkdJY0F3NlRjUG1hMFlWNEpmWFlFQml5L3JiZXFaY3YraTF0RWJJZ2FnemdPQVdNZXJUNU12RHVYZ2ZPSDZ2QXNSb1JnVkFxSE9wMlRNclg0ZFlmRm1MaFZBSFRScXRna24wUVEzVzBhblpLK1VzdnpKZS9xZmx4aTJkMDRhM3U5aUpXZG5nVUhkL0kzM0tFeUpFb3FCRTJtcUN4R0JDcXEvL3A4aWRXdlBoNjZXYTM1Wmx6VUljQW5lejN3K24xNHV3REQ4Q2FsWVdvMjkzdlllUEgrRnkrSm41ODI4OUhLdTJycGJ1eDlLRjdFWTR5Zkhyb0FIS0w1aXYydy92MlllN0NCZkJIQkxSV0hZSjU0cnpyQ1Fjc0R0eCtZQTRNQWJ5VHFqc0hMZkxJcldXY0Noand1L1hIVVZudXhyR0RDMkcyQWR3bm5LUU5Yd09MSG53Rkg0ZGE4Vm5aQnBnMFpxZ2NPZ0pNZkthK29xSmtURFFNWDNvcjNHRi9raGdKUTlUcm9ESW5RRU5xOXJqSXRhTndxVVdrZURveTB3dG1US1l0LzhYUHBnNHdacEFEQVJUdDJZT0p4NDVCbzlQQmxaRUJ5ODZkdlFlZFBHa1N4bVpudzVTUUFENlhyeG5zNlhXbVlPKzF4M2UrbjUyRDJXTTNZOTZ3NkYwRjFGNHdCd3NCcHJCRXYrMHdJUU83WGoySEMwZXJjTGJpRWRpMHpZZ3lBazFPZ0ZVUWNjT053UDVkeXhFTE5NQ1E1Q2ZxMFlacGVrZ0NwTVpnRU5Qdm1JYzVLY2tFbTRnTDcrOUJyTDBkMXJGallTR0dHa2VQZ3lXWDRxVTFDUVczelZHNXp0VituMjVhUVJwVkdCb2prRnBXcm9UQmFBUS9UcEQ2ZXB1dDN4T1p6V2FLRWpMNDNJRU0zZnJITFpEOFh0eVFhc1hoZHpiRGJOVENKak44OXRmdHZmYVc4amQ2N2ZQeXpQM2pSQnpUaEdHWUtnd3hyY2NlTTJleVlEUU5HOSs4aUFNZkhzYVJYWS9Bb3VWNHFSQVM5TkNybW1rakt4Qkt3T1FzTThYMGlRaFFrcEsxSVVpaUJ4cTErb0xmYVBKSlhvOGxFT3lDSnRHS1Njc2ZoVFlwR1lJdEZUVVhHOURZMm9xUXc0VW5GaTVTR0YvMnpma2lhbFFjVUo2NlY3UHJGTDVtUWh3Z1hHUlpaanYrOEFMekJHUE00WXV5QTlzM3NGTXRJVVc1L1h4N2hOVTArUlU3WDdPTTViRmxKeFNRMk9EUitBcmxJVXk1SERqVzA0eSt0NVVyQzlKNVZtNXRZeGt6L3M1WUYzV2lFU1l6UDJNUm1ibXA2K0VIOXZ1WnhNOU45aUJ6MFZpVUhiY2xzUHVYL0dKMlNVbkplWCtMblVXNi9NcXpIVHA2bEwyOWR5OXJ0TGV3eDU5OGtwV3NXY1B1dSs4K0ZvMUdsZkc5Ky9iWm4xcTFLazFKekhRU2xVeEhqQkw3cmtYNVhMNW1NQlFrczdXdlkwdnZaM2Q0cFc2M2o3TmZvL1FEZllDYnMzaUdhNlVPUllNVVAvOTJxaG9ZRTRWc2ROQ29ERUV5VVlxbmhCSURFbUo4aFpZZW5LZG1FVEg2NDY4cFdhM0dKYnZkSHBLaVRXcGlvNFlTejdIang3SHUyV2R4OUtPUGtEa3lIYVdiTmlFL0x3K0xGeSttYWtXbEhDSW5PeWM5TXlPVEozSlJ6Y0VobkNISFl0ZjBkQ0p0d3JycDNTdXZ2L1VHdk80dVdCTE4yTDkvTjd4ZUZ6eWVkclM0MytxMUY0MDFEUWRhUCs4VnJnMXBwY1JTM3QrRERWUWU5ZGhGcUYzSmlIVGFJWWFUeUwyallJbGQ4SXNHV0NRUlRCK0dvQ2NnaVU1cTJRQ0Q2S05GZFFqck0xRlZYZVVZZCtQWXhnNm5FK25wNlppWW40OGRPM1pnN2RxMWlFUWkwR3ExS0tlcWgxaDgyVDJCVVJrWlFscGEya3pxSHVKMXFFcGgzekNBUG5WeURhbzhYNkVnZVFvd0FORGxTeDdtZm85dDc3Mk5CUXQrcG1UNVQ0NjhqZ21GUzVUeGlxUHZkZGVyTE8rS2ZjbnRlMlg3MUc5VnpDdmp1bGhmWmFKRkZqSlNyQ2o3L0RqQ3FnaDBWTjZFdlNJc0NVQVhuZHhQdkR4ZjF3NXQ0Z2pvWTFxRW5BWVVmSThTcHVva09seUlCSVBoQzA2blN3SFVaREloTnpjWG9WQUlSRjdrNU9Rb0xjODMvRTFldXRTS3B1WW1SS1RvTFpzM2w2WnpocW81UXlQUjZGVlBmY0paZzJsRk42UHk4MHEra2JwMld6THdVRWUvT1oyT3ZyNFlVMTFwcnpxTC81WG9SSDNmdmFrd21qRmRRdGxINC9GQzZWZFkvZFJOVktFWWVNcUFVUjNFaVNvOVZqNTZBczIrTUt3R014NjhmeVNtNW8rSFNlRGg2RkxNNy9mVnUxek8zdjI0YXhjVUZKRG5lWlgrU2tyZ1hxOFBsWlVuRUtLS3dHcE5nTS9ybWFMVDY2WjF1end4VkJvQzBKS3F0VGpwUHRWZDhzUThZSktNK2czVzVaZS9IcFozZjlyMGthaGs1YXE0MWIvc3QxYzhBM3VZT1FRcnIwdXlGd2VwK3Vqckc2SEhpcC9Zc1B2bFRteis3ZGNvdm5NR1prNGd0NmNZS1hRRk1XdXlBVjk4K2lPY3BmQjZlOUh6RkJ2dm9TODdKOVhmeW5LWldGbmZiTGZ6YndPbG1wRWtDYXVmZmhwZWp4ZW52anFGN0t4c2RQRjZQQnlDeitQSDZkT25LVlJVVzhlTUdYMUxOME1KME1nUUxsL2RWZ05iOFlqdUFqL3FSRkpoTW1ZVnpra3YvM05aQVY2akpQUzRXL2dXR0xEci9VYS9ta1FNelFNMlQ0ZE41OFEvRHhiaXp1SUtMTGp0SGF4N2JocVdQSmFMVkpNV1BzWHB6YWgzU1dqM242R1FNS2Y3L3dBbVA2LzY1ZnE2dXViR3BzYU9GbnRMdXFQZEFSZTV2NGZZMmVtaTF1ZWovT0JtamphbjMrVjJ0Zmk4dm9aWUxGb1hsYUpualFaRGhab0pnaTdHWFg0SVFQTk4rVGg5c0p1aG1LdUNXTTV3NXB2cU5pU0xsZmcveWhjTHgyUEVxQStRcWhSL3dYNWpIaXJyZGJJSkkyNEEvbEc5R3F0L1U0NU5XejdFeTlzL0J6UTNRcFVRUWFqZGpNUzBOaXhkdFFoRnhUZlRHelZRRGM2ckZKLzg1WmRmZW02ZVByMjlkTXVXZEdLaTVQVjZPdjJCUUZNb0ZMNUlOWHF0eCt1cGQzZDIxclhZN1k1QUlNQnZUcDhGQ0plWGwvblZCS05GUmE3QWcreGdzbkgySzBwNzkrNDc0SXgxSUpXeTVxZ1h1dzQwTVBiOGR3RmtPRmZuZ0Ewblk5enFRZTFXbnJRdHpRUlNCZ3dHRVhzMnpxVUhtWHZGdkNDRkx3UC9MdzZQZGhRTGpWcUZWSXdTa0NSRklnZFBWcCtzSTY2ZDd1cnkxWHJjN3NhR2hrWjdPQnppQUVweEdvdFhZWVFnL0o0Q1JlWndoM2ZkcmlxTTJJUWtyWk4xbWcvSDlqb1krNERNdlN5dCtlUWxUTDcxdWY4YSs2NVZmdlZ3NW5EaDVKcGw1OE5ITUs1RkNUODhkaWFTR2k0REZZblRIdkRrZ1RVeWwvOElNQUJ0S2g4cGlad0l1d0FBQUFCSlJVNUVya0pnZ2c9PSk7bWFyZ2luLXJpZ2h0Oi41ZW07Y29udGVudDonICd9Lmljb24taWNhbDpiZWZvcmV7YmFja2dyb3VuZC1wb3NpdGlvbjotNjhweCAwfS5pY29uLW91dGxvb2s6YmVmb3Jle30uaWNvbi15YWhvbzpiZWZvcmV7YmFja2dyb3VuZC1wb3NpdGlvbjotMzZweCArNHB4fS5pY29uLWdvb2dsZTpiZWZvcmV7YmFja2dyb3VuZC1wb3NpdGlvbjotNTJweCAwfVwiO1xuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfTtcblxuICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSB0aGUgbmVjZXNzYXJ5IGV2ZW50IGRhdGEsIHN1Y2ggYXMgc3RhcnQgdGltZSBhbmQgZXZlbnQgZHVyYXRpb25cbiAgdmFyIHZhbGlkUGFyYW1zID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgcmV0dXJuIHBhcmFtcy5kYXRhICE9PSB1bmRlZmluZWQgJiYgcGFyYW1zLmRhdGEuc3RhcnQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgKHBhcmFtcy5kYXRhLmVuZCAhPT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5kYXRhLmR1cmF0aW9uICE9PSB1bmRlZmluZWQpO1xuICB9O1xuXG4gIHZhciBnZW5lcmF0ZU1hcmt1cCA9IGZ1bmN0aW9uKGNhbGVuZGFycywgY2xhenosIGNhbGVuZGFySWQpIHtcbiAgICB2YXIgcmVzdWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICByZXN1bHQuaW5uZXJIVE1MID0gJzxsYWJlbCBmb3I9XCJjaGVja2JveC1mb3ItJyArXG4gICAgICBjYWxlbmRhcklkICsgJ1wiIGNsYXNzPVwiYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94XCI+KyBBZGQgdG8gbXkgQ2FsZW5kYXI8L2xhYmVsPic7XG4gICAgcmVzdWx0LmlubmVySFRNTCArPSAnPGlucHV0IG5hbWU9XCJhZGQtdG8tY2FsZW5kYXItY2hlY2tib3hcIiBjbGFzcz1cImFkZC10by1jYWxlbmRhci1jaGVja2JveFwiIGlkPVwiY2hlY2tib3gtZm9yLScgKyBjYWxlbmRhcklkICsgJ1wiIHR5cGU9XCJjaGVja2JveFwiPic7XG5cbiAgICBPYmplY3Qua2V5cyhjYWxlbmRhcnMpLmZvckVhY2goZnVuY3Rpb24oc2VydmljZXMpIHtcbiAgICAgIHJlc3VsdC5pbm5lckhUTUwgKz0gY2FsZW5kYXJzW3NlcnZpY2VzXTtcbiAgICB9KTtcblxuICAgIHJlc3VsdC5jbGFzc05hbWUgPSAnYWRkLXRvLWNhbGVuZGFyJztcbiAgICBpZiAoY2xhenogIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0LmNsYXNzTmFtZSArPSAoJyAnICsgY2xhenopO1xuICAgIH1cblxuICAgIGFkZENTUygpO1xuXG4gICAgcmVzdWx0LmlkID0gY2FsZW5kYXJJZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBnZXRDbGFzcyA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMub3B0aW9ucyAmJiBwYXJhbXMub3B0aW9ucy5jbGFzcykge1xuICAgICAgcmV0dXJuIHBhcmFtcy5vcHRpb25zLmNsYXNzO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2V0T3JHZW5lcmF0ZUNhbGVuZGFySWQgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICByZXR1cm4gcGFyYW1zLm9wdGlvbnMgJiYgcGFyYW1zLm9wdGlvbnMuaWQgP1xuICAgICAgcGFyYW1zLm9wdGlvbnMuaWQgOlxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCk7IC8vIEdlbmVyYXRlIGEgNi1kaWdpdCByYW5kb20gSURcbiAgfTtcblxuICBleHBvcnRzLmNyZWF0ZUNhbGVuZGFyID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKCF2YWxpZFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXZlbnQgZGV0YWlscyBtaXNzaW5nLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBnZW5lcmF0ZU1hcmt1cChnZW5lcmF0ZUNhbGVuZGFycyhwYXJhbXMuZGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldENsYXNzKHBhcmFtcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldE9yR2VuZXJhdGVDYWxlbmRhcklkKHBhcmFtcykpO1xuICB9O1xufSkodGhpcyk7XG4iXX0=
