require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./js/calacts.js":[function(require,module,exports){
module.exports=require('uVYM5p');
},{}],"uVYM5p":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};
	
	var ouical=require('./ouical.js');


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts").clone() );


	var now = new Date();
	calacts.monday = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
	console.log(calacts.monday);



		
var myCalendar = ouical.createCalendar({
  options: {
    class: 'calclass',
  },
  data: {
    // Event title
    title: 'test',

    // Event start date
    start: new Date('June 15, 2013 19:00'),

    // Event duration (IN MINUTES)
    duration: 120,  

    // Event Address
    address: 'The internet',

    // Event Description
    description: 'Test cal.'
  }
});

		$(".calacts .tab").empty().append( myCalendar );
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
						p.time=dur;
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

},{"./ouical.js":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvY2FsYWN0cy5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvb3VpY2FsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIGxzPWZ1bmN0aW9uKGEpIHsgY29uc29sZS5sb2codXRpbC5pbnNwZWN0KGEse2RlcHRoOm51bGx9KSk7IH1cblxuZXhwb3J0cy5zZXR1cD1mdW5jdGlvbihvcHRzKXtcblxuXHR2YXIgY2FsYWN0cz17b3B0czpvcHRzfTtcblx0XG5cdHZhciBvdWljYWw9cmVxdWlyZSgnLi9vdWljYWwuanMnKTtcblxuXG5cdGNhbGFjdHMudGVtcGxhdGU9JChcIjxkaXY+PC9kaXY+XCIpO1xuXHRcdFxuXHRjYWxhY3RzLmZpbGw9ZnVuY3Rpb24oKXtcblx0XHRvcHRzLmRpdi5lbXB0eSgpLmFwcGVuZCggY2FsYWN0cy50ZW1wbGF0ZS5maW5kKFwiLmNhbGFjdHNcIikuY2xvbmUoKSApO1xuXG5cblx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cdGNhbGFjdHMubW9uZGF5ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpKyg4IC0gbm93LmdldERheSgpKSk7XG5cdGNvbnNvbGUubG9nKGNhbGFjdHMubW9uZGF5KTtcblxuXG5cblx0XHRcbnZhciBteUNhbGVuZGFyID0gb3VpY2FsLmNyZWF0ZUNhbGVuZGFyKHtcbiAgb3B0aW9uczoge1xuICAgIGNsYXNzOiAnY2FsY2xhc3MnLFxuICB9LFxuICBkYXRhOiB7XG4gICAgLy8gRXZlbnQgdGl0bGVcbiAgICB0aXRsZTogJ3Rlc3QnLFxuXG4gICAgLy8gRXZlbnQgc3RhcnQgZGF0ZVxuICAgIHN0YXJ0OiBuZXcgRGF0ZSgnSnVuZSAxNSwgMjAxMyAxOTowMCcpLFxuXG4gICAgLy8gRXZlbnQgZHVyYXRpb24gKElOIE1JTlVURVMpXG4gICAgZHVyYXRpb246IDEyMCwgIFxuXG4gICAgLy8gRXZlbnQgQWRkcmVzc1xuICAgIGFkZHJlc3M6ICdUaGUgaW50ZXJuZXQnLFxuXG4gICAgLy8gRXZlbnQgRGVzY3JpcHRpb25cbiAgICBkZXNjcmlwdGlvbjogJ1Rlc3QgY2FsLidcbiAgfVxufSk7XG5cblx0XHQkKFwiLmNhbGFjdHMgLnRhYlwiKS5lbXB0eSgpLmFwcGVuZCggbXlDYWxlbmRhciApO1xuXHR9O1xuXG4vLyBsb2FkIGFuZCBwYXJzZSByYXcgQ1NWXG5cdCQoZnVuY3Rpb24oKSB7XG5cdFx0JC5hamF4KHtcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IFwiY2FsYWN0cy5jc3ZcIixcblx0XHRcdGRhdGFUeXBlOiBcInRleHRcIixcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0Y2FsYWN0cy5jc3Y9JC5jc3YudG9BcnJheXMoZGF0YSk7XG5cdFx0XHRcdGNhbGFjdHMuUGFyc2VDU1YoKVxuXHRcdFx0XHRjYWxhY3RzLnRlbXBsYXRlLmxvYWQoXCJ0ZW1wbGF0ZS5odG1sXCIsY2FsYWN0cy5maWxsKTtcbi8vXHRcdFx0XHRjb25zb2xlLmxvZyhjYWxhY3RzLmNzdik7XG5cdFx0XHR9XG5cdFx0IH0pO1xuXHR9KTtcblxuXHRjYWxhY3RzLlBhcnNlQ1NWPWZ1bmN0aW9uKClcblx0e1xuXHRcdGNhbGFjdHMub2Jqcz1bXTtcblx0XHRmb3IodmFyIGo9MTtqPGNhbGFjdHMuY3N2Lmxlbmd0aDtqKyspIC8vIGZpcnN0IGxpbmUgaXMgaGVhZGVyXG5cdFx0e1xuXHRcdFx0dmFyIHQ9e307XG5cdFx0XHRmb3IodmFyIGk9MDtpPGNhbGFjdHMuY3N2WzBdLmxlbmd0aDtpKyspXG5cdFx0XHR7XG5cdFx0XHRcdHRbIGNhbGFjdHMuY3N2WzBdW2ldIF09Y2FsYWN0cy5jc3Zbal1baV07XG5cdFx0XHR9XG5cdFx0XHRjYWxhY3RzLm9ianNbY2FsYWN0cy5vYmpzLmxlbmd0aF09dDtcblx0XHR9XG5cdFx0Y2FsYWN0cy5wbGFjZXM9e307XG5cdFx0Y2FsYWN0cy5zbG90cz1bXTtcblx0XHRmb3IodmFyIGk9MDtpPGNhbGFjdHMub2Jqcy5sZW5ndGg7aSsrKVxuXHRcdHtcblx0XHRcdHZhciB0PXt9O1xuXHRcdFx0dC5uYW1lPWNhbGFjdHMub2Jqc1tpXVtcIkxlaXN1cmVDZW50cmVOYW1lXCJdO1xuXHRcdFx0dC5hZGRyZXNzPWNhbGFjdHMub2Jqc1tpXVtcIkFkZHJlc3NcIl07XG5cdFx0XHR0LnBob25lPWNhbGFjdHMub2Jqc1tpXVtcIlRlbGVwaG9uZVwiXTtcblx0XHRcdHQuY29tbWVudHM9Y2FsYWN0cy5vYmpzW2ldW1wiQ29tbWVudHNcIl07XG5cdFx0XHRjYWxhY3RzLnBsYWNlc1t0Lm5hbWVdPXQ7XG5cdFx0XHRcblx0XHRcdGZvcih2YXIgbiBpbiBjYWxhY3RzLm9ianNbaV0pXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBkdXI9Y2FsYWN0cy5vYmpzW2ldW25dO1xuXHRcdFx0XHRpZiggZHVyICE9IFwiXCIgKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIG5zPW4ucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHR2YXIgbmE9bnMuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGlmKCAobmFbMV09PVwibW9uZGF5XCIpIHx8IChuYVsxXT09XCJ0dWVzZGF5XCIpIHx8IChuYVsxXT09XCJ3ZWRuZXNkYXlcIikgfHwgKG5hWzFdPT1cInRodXJzZGF5XCIpIHx8IChuYVsxXT09XCJmcmlkYXlcIikgfHwgKG5hWzFdPT1cInNhdHVyZGF5XCIpIHx8IChuYVsxXT09XCJzdW5kYXlcIikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIHA9e307XG5cdFx0XHRcdFx0XHRwLmRheT1uYVsxXTtcblx0XHRcdFx0XHRcdHAuYWN0PW5hWzBdO1xuXHRcdFx0XHRcdFx0cC5wbGFjZT10Lm5hbWU7XG5cdFx0XHRcdFx0XHRwLnRpbWU9ZHVyO1xuXHRcdFx0XHRcdFx0Y2FsYWN0cy5zbG90c1tjYWxhY3RzLnNsb3RzLmxlbmd0aF09cDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG4vL1x0XHRjb25zb2xlLmxvZyhjYWxhY3RzLnBsYWNlcyk7XG4vL1x0XHRjb25zb2xlLmxvZyhjYWxhY3RzLnNsb3RzKTtcblx0fTtcblx0XG5cdHJldHVybiBjYWxhY3RzO1xuXG59O1xuIiwiOyhmdW5jdGlvbihleHBvcnRzKSB7XG4gIHZhciBNU19JTl9NSU5VVEVTID0gNjAgKiAxMDAwO1xuXG4gIHZhciBmb3JtYXRUaW1lID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvLXw6fFxcLlxcZCsvZywgJycpO1xuICB9O1xuXG4gIHZhciBjYWxjdWxhdGVFbmRUaW1lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQuZW5kID9cbiAgICAgIGZvcm1hdFRpbWUoZXZlbnQuZW5kKSA6XG4gICAgICBmb3JtYXRUaW1lKG5ldyBEYXRlKGV2ZW50LnN0YXJ0LmdldFRpbWUoKSArIChldmVudC5kdXJhdGlvbiAqIE1TX0lOX01JTlVURVMpKSk7XG4gIH07XG5cbiAgdmFyIGNhbGVuZGFyR2VuZXJhdG9ycyA9IHtcbiAgICBnb29nbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgc3RhcnRUaW1lID0gZm9ybWF0VGltZShldmVudC5zdGFydCk7XG4gICAgICB2YXIgZW5kVGltZSA9IGNhbGN1bGF0ZUVuZFRpbWUoZXZlbnQpO1xuXG4gICAgICB2YXIgaHJlZiA9IGVuY29kZVVSSShbXG4gICAgICAgICdodHRwczovL3d3dy5nb29nbGUuY29tL2NhbGVuZGFyL3JlbmRlcicsXG4gICAgICAgICc/YWN0aW9uPVRFTVBMQVRFJyxcbiAgICAgICAgJyZ0ZXh0PScgKyAoZXZlbnQudGl0bGUgfHwgJycpLFxuICAgICAgICAnJmRhdGVzPScgKyAoc3RhcnRUaW1lIHx8ICcnKSxcbiAgICAgICAgJy8nICsgKGVuZFRpbWUgfHwgJycpLFxuICAgICAgICAnJmRldGFpbHM9JyArIChldmVudC5kZXNjcmlwdGlvbiB8fCAnJyksXG4gICAgICAgICcmbG9jYXRpb249JyArIChldmVudC5hZGRyZXNzIHx8ICcnKSxcbiAgICAgICAgJyZzcHJvcD0mc3Byb3A9bmFtZTonXG4gICAgICBdLmpvaW4oJycpKTtcbiAgICAgIHJldHVybiAnPGEgY2xhc3M9XCJpY29uLWdvb2dsZVwiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICtcbiAgICAgICAgaHJlZiArICdcIj5Hb29nbGUgQ2FsZW5kYXI8L2E+JztcbiAgICB9LFxuXG4gICAgeWFob286IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgZXZlbnREdXJhdGlvbiA9IGV2ZW50LmVuZCA/XG4gICAgICAgICgoZXZlbnQuZW5kLmdldFRpbWUoKSAtIGV2ZW50LnN0YXJ0LmdldFRpbWUoKSkvIE1TX0lOX01JTlVURVMpIDpcbiAgICAgICAgZXZlbnQuZHVyYXRpb247XG5cbiAgICAgIC8vIFlhaG9vIGRhdGVzIGFyZSBjcmF6eSwgd2UgbmVlZCB0byBjb252ZXJ0IHRoZSBkdXJhdGlvbiBmcm9tIG1pbnV0ZXMgdG8gaGg6bW1cbiAgICAgIHZhciB5YWhvb0hvdXJEdXJhdGlvbiA9IGV2ZW50RHVyYXRpb24gPCA2MDAgP1xuICAgICAgICAnMCcgKyBNYXRoLmZsb29yKChldmVudER1cmF0aW9uIC8gNjApKSA6XG4gICAgICAgIE1hdGguZmxvb3IoKGV2ZW50RHVyYXRpb24gLyA2MCkpICsgJyc7XG5cbiAgICAgIHZhciB5YWhvb01pbnV0ZUR1cmF0aW9uID0gZXZlbnREdXJhdGlvbiAlIDYwIDwgMTAgP1xuICAgICAgICAnMCcgKyBldmVudER1cmF0aW9uICUgNjAgOlxuICAgICAgICBldmVudER1cmF0aW9uICUgNjAgKyAnJztcblxuICAgICAgdmFyIHlhaG9vRXZlbnREdXJhdGlvbiA9IHlhaG9vSG91ckR1cmF0aW9uICsgeWFob29NaW51dGVEdXJhdGlvbjtcblxuICAgICAgLy8gUmVtb3ZlIHRpbWV6b25lIGZyb20gZXZlbnQgdGltZVxuICAgICAgdmFyIHN0ID0gZm9ybWF0VGltZShuZXcgRGF0ZShldmVudC5zdGFydCAtIChldmVudC5zdGFydC5nZXRUaW1lem9uZU9mZnNldCgpICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTVNfSU5fTUlOVVRFUykpKSB8fCAnJztcblxuICAgICAgdmFyIGhyZWYgPSBlbmNvZGVVUkkoW1xuICAgICAgICAnaHR0cDovL2NhbGVuZGFyLnlhaG9vLmNvbS8/dj02MCZ2aWV3PWQmdHlwZT0yMCcsXG4gICAgICAgICcmdGl0bGU9JyArIChldmVudC50aXRsZSB8fCAnJyksXG4gICAgICAgICcmc3Q9JyArIHN0LFxuICAgICAgICAnJmR1cj0nICsgKHlhaG9vRXZlbnREdXJhdGlvbiB8fCAnJyksXG4gICAgICAgICcmZGVzYz0nICsgKGV2ZW50LmRlc2NyaXB0aW9uIHx8ICcnKSxcbiAgICAgICAgJyZpbl9sb2M9JyArIChldmVudC5hZGRyZXNzIHx8ICcnKVxuICAgICAgXS5qb2luKCcnKSk7XG5cbiAgICAgIHJldHVybiAnPGEgY2xhc3M9XCJpY29uLXlhaG9vXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgK1xuICAgICAgICBocmVmICsgJ1wiPllhaG9vISBDYWxlbmRhcjwvYT4nO1xuICAgIH0sXG5cbiAgICBpY3M6IGZ1bmN0aW9uKGV2ZW50LCBlQ2xhc3MsIGNhbGVuZGFyTmFtZSkge1xuICAgICAgdmFyIHN0YXJ0VGltZSA9IGZvcm1hdFRpbWUoZXZlbnQuc3RhcnQpO1xuICAgICAgdmFyIGVuZFRpbWUgPSBjYWxjdWxhdGVFbmRUaW1lKGV2ZW50KTtcblxuICAgICAgdmFyIGhyZWYgPSBlbmNvZGVVUkkoXG4gICAgICAgICdkYXRhOnRleHQvY2FsZW5kYXI7Y2hhcnNldD11dGY4LCcgKyBbXG4gICAgICAgICAgJ0JFR0lOOlZDQUxFTkRBUicsXG4gICAgICAgICAgJ1ZFUlNJT046Mi4wJyxcbiAgICAgICAgICAnQkVHSU46VkVWRU5UJyxcbiAgICAgICAgICAnVVJMOicgKyBkb2N1bWVudC5VUkwsXG4gICAgICAgICAgJ0RUU1RBUlQ6JyArIChzdGFydFRpbWUgfHwgJycpLFxuICAgICAgICAgICdEVEVORDonICsgKGVuZFRpbWUgfHwgJycpLFxuICAgICAgICAgICdTVU1NQVJZOicgKyAoZXZlbnQudGl0bGUgfHwgJycpLFxuICAgICAgICAgICdERVNDUklQVElPTjonICsgKGV2ZW50LmRlc2NyaXB0aW9uIHx8ICcnKSxcbiAgICAgICAgICAnTE9DQVRJT046JyArIChldmVudC5hZGRyZXNzIHx8ICcnKSxcbiAgICAgICAgICAnRU5EOlZFVkVOVCcsXG4gICAgICAgICAgJ0VORDpWQ0FMRU5EQVInXS5qb2luKCdcXG4nKSk7XG5cbiAgICAgIHJldHVybiAnPGEgY2xhc3M9XCInICsgZUNsYXNzICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICtcbiAgICAgICAgaHJlZiArICdcIj4nICsgY2FsZW5kYXJOYW1lICsgJyBDYWxlbmRhcjwvYT4nO1xuICAgIH0sXG5cbiAgICBpY2FsOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuaWNzKGV2ZW50LCAnaWNvbi1pY2FsJywgJ2lDYWwnKTtcbiAgICB9LFxuXG4gICAgb3V0bG9vazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmljcyhldmVudCwgJ2ljb24tb3V0bG9vaycsICdPdXRsb29rJyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZW5lcmF0ZUNhbGVuZGFycyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdvb2dsZTogY2FsZW5kYXJHZW5lcmF0b3JzLmdvb2dsZShldmVudCksXG4gICAgICB5YWhvbzogY2FsZW5kYXJHZW5lcmF0b3JzLnlhaG9vKGV2ZW50KSxcbiAgICAgIGljYWw6IGNhbGVuZGFyR2VuZXJhdG9ycy5pY2FsKGV2ZW50KSxcbiAgICAgIG91dGxvb2s6IGNhbGVuZGFyR2VuZXJhdG9ycy5vdXRsb29rKGV2ZW50KVxuICAgIH07XG4gIH07XG5cbiAgLy8gQ3JlYXRlIENTU1xuICB2YXIgYWRkQ1NTID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3VpY2FsLWNzcycpKSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGdlbmVyYXRlQ1NTKCkpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2VuZXJhdGVDU1MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZXMuaWQgPSAnb3VpY2FsLWNzcyc7XG5cbiAgICBzdHlsZXMuaW5uZXJIVE1MID0gXCIjYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94LWxhYmVse2N1cnNvcjpwb2ludGVyfS5hZGQtdG8tY2FsZW5kYXItY2hlY2tib3h+YXtkaXNwbGF5Om5vbmV9LmFkZC10by1jYWxlbmRhci1jaGVja2JveDpjaGVja2VkfmF7ZGlzcGxheTpibG9jazt3aWR0aDoxNTBweDttYXJnaW4tbGVmdDoyMHB4fWlucHV0W3R5cGU9Y2hlY2tib3hdLmFkZC10by1jYWxlbmRhci1jaGVja2JveHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTk5OTlweDtsZWZ0Oi05OTk5cHh9LmFkZC10by1jYWxlbmRhci1jaGVja2JveH5hOmJlZm9yZXt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQtaW1hZ2U6dXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRlFBQUFBUUNBWUFBQUNJb2xpN0FBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeVJwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNeTFqTURFeElEWTJMakUwTlRZMk1Td2dNakF4TWk4d01pOHdOaTB4TkRvMU5qb3lOeUFnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTmlBb1RXRmphVzUwYjNOb0tTSWdlRzF3VFUwNlNXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzBNekpDUkRVMk5VRTFNREl4TVVVeU9UWTFRMEV3TlRreE5FSkRPVUl3TkNJZ2VHMXdUVTA2Ukc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvME16SkNSRFUyTmtFMU1ESXhNVVV5T1RZMVEwRXdOVGt4TkVKRE9VSXdOQ0krSUR4NGJYQk5UVHBFWlhKcGRtVmtSbkp2YlNCemRGSmxaanBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pRek1rSkVOVFl6UVRVd01qRXhSVEk1TmpWRFFUQTFPVEUwUWtNNVFqQTBJaUJ6ZEZKbFpqcGtiMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPalF6TWtKRU5UWTBRVFV3TWpFeFJUSTVOalZEUVRBMU9URTBRa001UWpBMElpOCtJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCsxR2NiM1FBQUNoMUpSRUZVZU5yRVdBdHdWTlVaL3U3ZDl5dlpKQnRNSUM4ZUJoSUtNa1FJaHFJQktpcld3cFNXMGRhaENpcjFnUWhXZzJYS2pOUnFSN0FqUTZRamdsQkZSSVcyMEttQzBLUllqUllNQ1pHSEdFaklZME95MlUzMmxYM2QzWHY2bnh1U2JFSkNRTnZwbi9uMzNQT2Z4ejMzdTkvL3VCR2FCUUZjTWhncnBHWUM2ZGRrK3pmaVpLZ3hzdk9HNGJ1Sk1HQVROdHpjcTRsK1dTdGJzR2dwdk9pRUxwZ0JXZXRHUUdOQ3N0U0drS3dIMUVrMDRvVk5GVVpRc0VBamVkQ2cwaUJSVml2clA3MzdDTCtIOE5hN2Y3bHBSRmEyY09mTXFkVW45bjNBUkdjN05MRVlKajYyUWxlNlozL1psQVR0ODJtSU5WNFFWUFYzM0hWWG1LLzFiUmdQdnN0NjB2elhnSnpaWjg0VWxPZm5WMUwvWXZ3aEJ4azdRN3F1WjN6WkxydlNpdlJ5K1B0UjBZOG9VaXQyUDcrYVdtNVRpZnhhaEVyVlBXZmQvSlJCUWFOVmpBMkNJaHNlY0V3SXViSHpCMytDUVdORE5CQ0N5dWlFQzZOZ3BWM2Fna0NzellXa25CVEluakFNRmgyMEhBbzEvUVFGVk03S3c5YWx5N0QxemUyaUpFZW1oYnU4TXpmKytya1ZOR01rYVM3cHVLYWRiMHl1YkdzY3AvV2EzcmMwbk5YVko2UnNKdnNhVWhtWHQ1b3ladjM2ZTRvLy9oaTF0YlVvbmpXcllOVHMyUVh4aHl3dUwrOGJtemV2b0c3ZE91M2dqOFBvMk1JVlpHSWNBdzZUY1BtYTBZVjRKZlhZRUJpeS9yYmVxWmN2K2kxdEViSWdhZ3pnT0FXTWVyVDVNdkR1WGdmT0g2dkFzUm9SZ1ZBcUhPcDJUTXJYNGRZZkZtTGhWQUhUUnF0Z2tuMFFRM1cwYW5aSytVc3Z6SmUvcWZseGkyZDA0YTN1OWlKV2RuZ1VIZC9JMzNLRXlKRW9xQkUybXFDeEdCQ3FxLy9wOGlkV3ZQaDY2V2EzNVpselVJY0FuZXozdytuMTR1d0REOENhbFlXbzI5M3ZZZVBIK0Z5K0puNTgyODlIS3UycnBidXg5S0Y3RVk0eWZIcm9BSEtMNWl2MncvdjJZZTdDQmZCSEJMUldIWUo1NHJ6ckNRY3NEdHgrWUE0TUFieVRxanNITGZMSXJXV2NDaGp3dS9YSFVWbnV4ckdEQzJHMkFkd25uS1FOWHdPTEhud0ZINGRhOFZuWkJwZzBacWdjT2dKTWZLYStvcUprVERRTVgzb3IzR0Yva2hnSlE5VHJvREluUUVOcTlyakl0YU53cVVXa2VEb3kwd3RtVEtZdC84WFBwZzR3WnBBREFSVHQyWU9KeDQ1Qm85UEJsWkVCeTg2ZHZRZWRQR2tTeG1abnc1U1FBRDZYcnhuczZYV21ZTysxeDNlK241MkQyV00zWTk2dzZGMEYxRjR3QndzQnByQkV2KzB3SVFPN1hqMkhDMGVyY0xiaUVkaTB6WWd5QWsxT2dGVVFjY09Od1A1ZHl4RUxOTUNRNUNmcTBZWnBla2dDcE1aZ0VOUHZtSWM1S2NrRW00Z0w3KzlCckwwZDFyRmpZU0dHR2tlUGd5V1g0cVUxQ1FXM3pWRzV6dFYrbjI1YVFScFZHQm9qa0ZwV3JvVEJhQVEvVHBENmVwdXQzeE9aeldhS0VqTDQzSUVNM2ZySExaRDhYdHlRYXNYaGR6YkRiTlRDSmpOODl0ZnR2ZmFXOGpkNjdmUHl6UDNqUkJ6VGhHR1lLZ3d4cmNjZU0yZXlZRFFORzkrOGlBTWZIc2FSWFkvQW91VjRxUkFTOU5Dcm1ta2pLeEJLd09Rc004WDBpUWhRa3BLMUlVaWlCeHExK29MZmFQSkpYbzhsRU95Q0p0R0tTY3NmaFRZcEdZSXRGVFVYRzlEWTJvcVF3NFVuRmk1U0dGLzJ6ZmtpYWxRY1VKNjZWN1ByRkw1bVFod2dYR1JaWmp2KzhBTHpCR1BNNFl1eUE5czNzRk10SVVXNS9YeDdoTlUwK1JVN1g3T001YkZsSnhTUTJPRFIrQXJsSVV5NUhEalcwNHkrdDVVckM5SjVWbTV0WXhrei9zNVlGM1dpRVNZelAyTVJtYm1wNitFSDl2dVp4TTlOOWlCejBWaVVIYmNsc1B1WC9HSjJTVW5KZVgrTG5VVzYvTXF6SFRwNmxMMjlkeTlydExld3g1OThrcFdzV2NQdXUrOCtGbzFHbGZHOSsvYlpuMXExS2sxSnpIUVNsVXhIakJMN3JrWDVYTDVtTUJRa3M3V3ZZMHZ2WjNkNHBXNjNqN05mby9RRGZZQ2JzM2lHYTZVT1JZTVVQLzkycWhvWUU0VnNkTkNvREVFeVVZcW5oQklERW1KOGhaWWVuS2RtRVRINjQ2OHBXYTNHSmJ2ZEhwS2lUV3BpbzRZU3o3SGp4N0h1MldkeDlLT1BrRGt5SGFXYk5pRS9MdytMRnkrbWFrV2xIQ0luT3ljOU15T1RKM0pSemNFaG5DSEhZdGYwZENKdHdycnAzU3V2di9VR3ZPNHVXQkxOMkw5L043eGVGenllZHJTNDMrcTFGNDAxRFFkYVArOFZyZzFwcGNSUzN0K0REVlFlOWRoRnFGM0ppSFRhSVlhVHlMMmpZSWxkOElzR1dDUVJUQitHb0NjZ2lVNXEyUUNENktORmRRanJNMUZWWGVVWWQrUFl4ZzZuRStucDZaaVluNDhkTzNaZzdkcTFpRVFpMEdxMUtLZXFoMWg4MlQyQlVSa1pRbHBhMmt6cUh1SjFxRXBoM3pDQVBuVnlEYW84WDZFZ2VRb3dBTkRsU3g3bWZvOXQ3NzJOQlF0K3BtVDVUNDY4amdtRlM1VHhpcVB2ZGRlckxPK0tmY250ZTJYNzFHOVZ6Q3ZqdWxoZlphSkZGakpTckNqNy9EakNxZ2gwVk42RXZTSXNDVUFYbmR4UHZEeGYxdzV0NGdqb1kxcUVuQVlVZkk4U3B1b2tPbHlJQklQaEMwNm5Td0hVWkRJaE56Y1hvVkFJUkY3azVPUW9MYzgzL0UxZXV0U0twdVltUktUb0xaczNsNlp6aHFvNVF5UFI2RlZQZmNKWmcybEZONlB5ODBxK2ticDJXekx3VUVlL09aMk92cjRZVTExcHJ6cUwvNVhvUkgzZnZha3dtakZkUXRsSDQvRkM2VmRZL2RSTlZLRVllTXFBVVIzRWlTbzlWajU2QXMyK01Ld0dNeDY4ZnlTbTVvK0hTZURoNkZMTTcvZlZ1MXpPM3YyNGF4Y1VGSkRuZVpYK1NrcmdYcThQbFpVbkVLS0t3R3BOZ00vcm1hTFQ2NloxdXp3eFZCb0MwSktxdFRqcFB0VmQ4c1E4WUpLTStnM1c1WmUvSHBaM2Y5cjBrYWhrNWFxNDFiL3N0MWM4QTN1WU9RUXJyMHV5RndlcCt1anJHNkhIaXAvWXNQdmxUbXorN2Rjb3ZuTUdaazRndDZjWUtYUUZNV3V5QVY5OCtpT2NwZkI2ZTlIekZCdnZvUzg3SjlYZnluS1pXRm5mYkxmemJ3T2xtcEVrQ2F1ZmZocGVqeGVudmpxRjdLeHNkUEY2UEJ5Q3orUEg2ZE9uS1ZSVVc4ZU1HWDFMTjBNSjBNZ1FMbC9kVmdOYjhZanVBai9xUkZKaE1tWVZ6a2t2LzNOWkFWNmpKUFM0Vy9nV0dMRHIvVWEvbWtRTXpRTTJUNGRONThRL0R4Yml6dUlLTExqdEhheDdiaHFXUEphTFZKTVdQc1hwemFoM1NXajNuNkdRTUtmNy93QW1QNi82NWZxNnV1Ykdwc2FPRm50THVxUGRBUmU1djRmWTJlbWkxdWVqL09CbWpqYW4zK1YydGZpOHZvWllMRm9YbGFKbmpRWkRoWm9KZ2k3R1hYNElRUE5OK1RoOXNKdWhtS3VDV001dzVwdnFOaVNMbGZnL3loY0x4MlBFcUErUXFoUi93WDVqSGlycmRiSUpJMjRBL2xHOUdxdC9VNDVOV3o3RXk5cy9CelEzUXBVUVFhamRqTVMwTml4ZHRRaEZ4VGZUR3pWUURjNnJGSi84NVpkZmVtNmVQcjI5ZE11V2RHS2k1UFY2T3YyQlFGTW9GTDVJTlhxdHgrdXBkM2QyMXJYWTdZNUFJTUJ2VHA4RkNKZVhsL25WQktORlJhN0FnK3hnc25IMkswcDc5KzQ3NEl4MUlKV3k1cWdYdXc0ME1QYjhkd0ZrT0ZmbmdBMG5ZOXpxUWUxV25yUXR6UVJTQmd3R0VYczJ6cVVIbVh2RnZDQ0ZMd1AvTHc2UGRoUUxqVnFGVkl3U2tDUkZJZ2RQVnArc0k2NmQ3dXJ5MVhyYzdzYUdoa1o3T0J6aUFFcHhHb3RYWVlRZy9KNENSZVp3aDNmZHJpcU0ySVFrclpOMW1nL0g5am9ZKzRETXZTeXQrZVFsVEw3MXVmOGErNjVWZnZWdzVuRGg1SnBsNThOSE1LNUZDVDg4ZGlhU0dpNERGWW5USHZEa2dUVXlsLzhJTUFCdEtoOHBpWndJdXdBQUFBQkpSVTVFcmtKZ2dnPT0pO21hcmdpbi1yaWdodDouNWVtO2NvbnRlbnQ6JyAnfS5pY29uLWljYWw6YmVmb3Jle2JhY2tncm91bmQtcG9zaXRpb246LTY4cHggMH0uaWNvbi1vdXRsb29rOmJlZm9yZXt9Lmljb24teWFob286YmVmb3Jle2JhY2tncm91bmQtcG9zaXRpb246LTM2cHggKzRweH0uaWNvbi1nb29nbGU6YmVmb3Jle2JhY2tncm91bmQtcG9zaXRpb246LTUycHggMH1cIjtcblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH07XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgdGhlIG5lY2Vzc2FyeSBldmVudCBkYXRhLCBzdWNoIGFzIHN0YXJ0IHRpbWUgYW5kIGV2ZW50IGR1cmF0aW9uXG4gIHZhciB2YWxpZFBhcmFtcyA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHJldHVybiBwYXJhbXMuZGF0YSAhPT0gdW5kZWZpbmVkICYmIHBhcmFtcy5kYXRhLnN0YXJ0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIChwYXJhbXMuZGF0YS5lbmQgIT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZGF0YS5kdXJhdGlvbiAhPT0gdW5kZWZpbmVkKTtcbiAgfTtcblxuICB2YXIgZ2VuZXJhdGVNYXJrdXAgPSBmdW5jdGlvbihjYWxlbmRhcnMsIGNsYXp6LCBjYWxlbmRhcklkKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgcmVzdWx0LmlubmVySFRNTCA9ICc8bGFiZWwgZm9yPVwiY2hlY2tib3gtZm9yLScgK1xuICAgICAgY2FsZW5kYXJJZCArICdcIiBjbGFzcz1cImFkZC10by1jYWxlbmRhci1jaGVja2JveFwiPisgQWRkIHRvIG15IENhbGVuZGFyPC9sYWJlbD4nO1xuICAgIHJlc3VsdC5pbm5lckhUTUwgKz0gJzxpbnB1dCBuYW1lPVwiYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94XCIgY2xhc3M9XCJhZGQtdG8tY2FsZW5kYXItY2hlY2tib3hcIiBpZD1cImNoZWNrYm94LWZvci0nICsgY2FsZW5kYXJJZCArICdcIiB0eXBlPVwiY2hlY2tib3hcIj4nO1xuXG4gICAgT2JqZWN0LmtleXMoY2FsZW5kYXJzKS5mb3JFYWNoKGZ1bmN0aW9uKHNlcnZpY2VzKSB7XG4gICAgICByZXN1bHQuaW5uZXJIVE1MICs9IGNhbGVuZGFyc1tzZXJ2aWNlc107XG4gICAgfSk7XG5cbiAgICByZXN1bHQuY2xhc3NOYW1lID0gJ2FkZC10by1jYWxlbmRhcic7XG4gICAgaWYgKGNsYXp6ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5jbGFzc05hbWUgKz0gKCcgJyArIGNsYXp6KTtcbiAgICB9XG5cbiAgICBhZGRDU1MoKTtcblxuICAgIHJlc3VsdC5pZCA9IGNhbGVuZGFySWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgZ2V0Q2xhc3MgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLm9wdGlvbnMgJiYgcGFyYW1zLm9wdGlvbnMuY2xhc3MpIHtcbiAgICAgIHJldHVybiBwYXJhbXMub3B0aW9ucy5jbGFzcztcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldE9yR2VuZXJhdGVDYWxlbmRhcklkID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgcmV0dXJuIHBhcmFtcy5vcHRpb25zICYmIHBhcmFtcy5vcHRpb25zLmlkID9cbiAgICAgIHBhcmFtcy5vcHRpb25zLmlkIDpcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApOyAvLyBHZW5lcmF0ZSBhIDYtZGlnaXQgcmFuZG9tIElEXG4gIH07XG5cbiAgZXhwb3J0cy5jcmVhdGVDYWxlbmRhciA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIGlmICghdmFsaWRQYXJhbXMocGFyYW1zKSkge1xuICAgICAgY29uc29sZS5sb2coJ0V2ZW50IGRldGFpbHMgbWlzc2luZy4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2VuZXJhdGVNYXJrdXAoZ2VuZXJhdGVDYWxlbmRhcnMocGFyYW1zLmRhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRDbGFzcyhwYXJhbXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRPckdlbmVyYXRlQ2FsZW5kYXJJZChwYXJhbXMpKTtcbiAgfTtcbn0pKHRoaXMpO1xuIl19
