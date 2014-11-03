require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"uVYM5p":[function(require,module,exports){

var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){

	var calacts={opts:opts};
	
	var ouical=require('./ouical.js');


	calacts.template=$("<div></div>");
		
	calacts.fill=function(){
		opts.div.empty().append( calacts.template.find(".calacts").clone() );
		
var myCalendar = ouical.createCalendar({
  options: {
    class: 'my-class',
  },
  data: {
    // Event title
    title: 'Get on the front page of HN',

    // Event start date
    start: new Date('June 15, 2013 19:00'),

    // Event duration (IN MINUTES)
    duration: 120,

    // You can also choose to set an end time
    // If an end time is set, this will take precedence over duration
    end: new Date('June 15, 2013 23:00'),     

    // Event Address
    address: 'The internet',

    // Event Description
    description: 'Test cal.'
  }
});

		$(".calacts .test").empty().append( myCalendar );
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
				console.log(calacts.csv);
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
		console.log(calacts.places);
		console.log(calacts.slots);
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

    styles.innerHTML = "#add-to-calendar-checkbox-label{cursor:pointer}.add-to-calendar-checkbox~a{display:none}.add-to-calendar-checkbox:checked~a{display:block;width:150px;margin-left:20px}input[type=checkbox].add-to-calendar-checkbox{position:absolute;top:-9999px;left:-9999px}.add-to-calendar-checkbox~a:before{width:16px;height:16px;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAQCAYAAACIoli7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MzJCRDU2NUE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0MzJCRDU2NkE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzMkJENTYzQTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQzMkJENTY0QTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1Gcb3QAACh1JREFUeNrEWAtwVNUZ/u7d9yvZJBtMIC8eBhIKMkQIhqIBKirWwpSW0dahCir1gQhWg2XKjNRqR7AjQ6QjglBFRIW20KmC0KRYjRYMCZGHGEjIY0Oy2U32lX3d3Xv6nxuSbEJCQNvpn/n33POfxz33u9//uBGaBQFcMhgrpGYC6ddk+zfiZKgxsvOG4buJMGATNtzcq4l+WStbsGgpvOiELpgBWetGQGNCstSGkKwH1Ek04oVNFUZQsEAjedCg0iBRVivrP737CL+H8Na7f7lpRFa2cOfMqdUn9n3ARGc7NLEYJj62Qle6Z3/ZlATt82mINV4QVPV33HVXmK/1bRgPvst60vzXgJzZZ84UlOfnV1L/YvwhBxk7Q7quZ3zZLrvSivRy+PtR0Y8oUit2P7+aWm5TifxahErVPWfd/JRBQaNVjA2CIhsecEwIubHzB3+CQWNDNBCCyuiEC6NgpV3agkCszYWknBTInjAMFh20HAo1/QQFVM7Kw9aly7D1ze2iJEemhbu8Mzf++rkVNGMkaS7puKadb0yubGscp/Wa3rc0nNXVJ6RsJvsaUhmXt5oyZv36e4o//hi1tbUonjWrYNTs2QXxhywuL+8bmzevoG7dOu3gj8Po2MIVZGIcAw6TcPma0YV4JfXYEBiy/rbeqZcv+i1tEbIgagzgOAWMerT5MvDuXgfOH6vAsRoRgVAqHOp2TMrX4dYfFmLhVAHTRqtgkn0QQ3W0anZK+UsvzJe/qflxi2d04a3u9iJWdngUHd/I33KEyJEoqBE2mqCxGBCqq//p8idWvPh66Wa35ZlzUIcAnez3w+n14uwDD8CalYWo293vYePH+Fy+Jn58289HKu2rpbux9KF7EY4yfHroAHKL5iv2w/v2Ye7CBfBHBLRWHYJ54rzrCQcsDtx+YA4MAbyTqjsHLfLIrWWcChjwu/XHUVnuxrGDC2G2AdwnnKQNXwOLHnwFH4da8VnZBpg0ZqgcOgJMfKa+oqJkTDQMX3or3GF/khgJQ9TroDInQENq9rjItaNwqUWkeDoy0wtmTKYt/8XPpg4wZpADARTt2YOJx45Bo9PBlZEBy86dvQedPGkSxmZnw5SQAD6Xrxns6XWmYO+1x3e+n52D2WM3Y96w6F0F1F4wBwsBprBEv+0wIQO7Xj2HC0ercLbiEdi0zYgyAk1OgFUQccONwP5dyxELNMCQ5Cfq0YZpekgCpMZgENPvmIc5KckEm4gL7+9BrL0d1rFjYSGGGkePgyWX4qU1CQW3zVG5ztV+n25aQRpVGBojkFpWroTBaAQ/TpD6eput3xOZzWaKEjL43IEM3frHLZD8XtyQasXhdzbDbNTCJjN89tftvfaW8jd67fPyzP3jRBzThGGYKgwxrcceM2eyYDQNG9+8iAMfHsaRXY/AouV4qRAS9NCrmmkjKxBKwOQsM8X0iQhQkpK1IUiiBxq1+oLfaPJJXo8lEOyCJtGKScsfhTYpGYItFTUXG9DY2oqQw4UnFi5SGF/2zfkialQcUJ66V7PrFL5mQhwgXGRZZjv+8ALzBGPM4YuyA9s3sFMtIUW5/Xx7hNU0+RU7X7OM5bFlJxSQ2ODR+ArlIUy5HDjW04y+t5UrC9J5Vm5tYxkz/s5YF3WiESYzP2MRmbmp6+EH9vuZxM9N9iBz0ViUHbclsPuX/GJ2SUnJeX+LnUW6/MqzHTp6lL29dy9rtLewx598kpWsWcPuu+8+Fo1GlfG9+/bZn1q1Kk1JzHQSlUxHjBL7rkX5XL5mMBQks7WvY0vvZ3d4pW63j7Nfo/QDfYCbs3iGa6UORYMUP/92qhoYE4VsdNCoDEEyUYqnhBIDEmJ8hZYenKdmETH6468pWa3GJbvdHpKiTWpio4YSz7Hjx7Hu2Wdx9KOPkDkyHaWbNiE/Lw+LFy+makWlHCInOyc9MyOTJ3JRzcEhnCHHYtf0dCJtwrrp3Suvv/UGvO4uWBLN2L9/N7xeFzyedrS43+q1F401DQdaP+8Vrg1ppcRS3t+DDVQe9dhFqF3JiHTaIYaTyL2jYIld8IsGWCQRTB+GoCcgiU5q2QCD6KNFdQjrM1FVXeUYd+PYxg6nE+np6ZiYn48dO3Zg7dq1iEQi0Gq1KKeqh1h82T2BURkZQlpa2kzqHuJ1qEph3zCAPnVyDao8X6EgeQowANDlSx7mfo9t772NBQt+pmT5T468jgmFS5TxiqPvdderLO+Kfcnte2X71G9VzCvjulhfZaJFFjJSrCj7/DjCqgh0VN6EvSIsCUAXndxPvDxf1w5t4gjoY1qEnAYUfI8SpuokOlyIBIPhC06nSwHUZDIhNzcXoVAIRF7k5OQoLc83/E1eutSKpuYmRKToLZs3l6Zzhqo5QyPR6FVPfcJZg2lFN6Py80q+kbp2WzLwUEe/OZ2Ovr4YU11przqL/5XoRH3fvakwmjFdQtlH4/FC6VdY/dRNVKEYeMqAUR3EiSo9Vj56As2+MKwGMx68fySm5o+HSeDh6FLM7/fVu1zO3v24axcUFJDneZX+SkrgXq8PlZUnEKKKwGpNgM/rmaLT66Z1uzwxVBoC0JKqtTjpPtVd8sQ8YJKM+g3W5Ze/HpZ3f9r0kahk5aq41b/st1c8A3uYOQQrr0uyFwep+ujrG6HHip/YsPvlTmz+7dcovnMGZk4gt6cYKXQFMWuyAV98+iOcpfB6e9HzFBvvoS87J9XfynKZWFnfbLfzbwOlmpEkCauffhpejxenvjqF7KxsdPF6PByCz+PH6dOnKVRUW8eMGX1LN0MJ0MgQLl/dVgNb8YjuAj/qRFJhMmYVzkkv/3NZAV6jJPS4W/gWGLDr/Ua/mkQMzQM2T4dN58Q/DxbizuIKLLjtHax7bhqWPJaLVJMWPsXpzah3SWj3n6GQMKf7/wAmP6/65fq6uubGpsaOFntLuqPdARe5v4fY2emi1uej/OBmjjan3+V2tfi8voZYLFoXlaJnjQZDhZoJgi7GXX4IQPNN+Th9sJuhmKuCWM5w5pvqNiSLlfg/yhcLx2PEqA+QqhR/wX5jHirrdbIJI24A/lG9Gqt/U45NWz7Ey9s/BzQ3QpUQQajdjMS0NixdtQhFxTfTGzVQDc6rFJ/85Zdfem6ePr29dMuWdGKi5PV6Ov2BQFMoFL5INXqtx+upd3d21rXY7Y5AIMBvTp8FCJeXl/nVBKNFRa7Ag+xgsnH2K0p79+474Ix1IJWy5qgXuw40MPb8dwFkOFfngA0nY9zqQe1WnrQtzQRSBgwGEXs2zqUHmXvFvCCFLwP/Lw6PdhQLjVqFVIwSkCRFIgdPVp+sI66d7ury1Xrc7saGhkZ7OBziAEpxGotXYYQg/J4CReZwh3fdriqM2IQkrZN1mg/H9joY+4DMvSyt+eQlTL71uf8a+65VfvVw5nDh5Jpl58NHMK5FCT88diaSGi4DFYnTHvDkgTUyl/8IMABtKh8piZwIuwAAAABJRU5ErkJggg==);margin-right:.5em;content:' '}.icon-ical:before{background-position:-68px 0}.icon-outlook:before{}.icon-yahoo:before{background-position:-36px +4px}.icon-google:before{background-position:-52px 0}";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvY2FsYWN0cy5qcyIsIi9ob21lL2tyaXNzL2hnL2pzL2NhbGFjdHMvanMvb3VpY2FsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBscz1mdW5jdGlvbihhKSB7IGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdChhLHtkZXB0aDpudWxsfSkpOyB9XG5cbmV4cG9ydHMuc2V0dXA9ZnVuY3Rpb24ob3B0cyl7XG5cblx0dmFyIGNhbGFjdHM9e29wdHM6b3B0c307XG5cdFxuXHR2YXIgb3VpY2FsPXJlcXVpcmUoJy4vb3VpY2FsLmpzJyk7XG5cblxuXHRjYWxhY3RzLnRlbXBsYXRlPSQoXCI8ZGl2PjwvZGl2PlwiKTtcblx0XHRcblx0Y2FsYWN0cy5maWxsPWZ1bmN0aW9uKCl7XG5cdFx0b3B0cy5kaXYuZW1wdHkoKS5hcHBlbmQoIGNhbGFjdHMudGVtcGxhdGUuZmluZChcIi5jYWxhY3RzXCIpLmNsb25lKCkgKTtcblx0XHRcbnZhciBteUNhbGVuZGFyID0gb3VpY2FsLmNyZWF0ZUNhbGVuZGFyKHtcbiAgb3B0aW9uczoge1xuICAgIGNsYXNzOiAnbXktY2xhc3MnLFxuICB9LFxuICBkYXRhOiB7XG4gICAgLy8gRXZlbnQgdGl0bGVcbiAgICB0aXRsZTogJ0dldCBvbiB0aGUgZnJvbnQgcGFnZSBvZiBITicsXG5cbiAgICAvLyBFdmVudCBzdGFydCBkYXRlXG4gICAgc3RhcnQ6IG5ldyBEYXRlKCdKdW5lIDE1LCAyMDEzIDE5OjAwJyksXG5cbiAgICAvLyBFdmVudCBkdXJhdGlvbiAoSU4gTUlOVVRFUylcbiAgICBkdXJhdGlvbjogMTIwLFxuXG4gICAgLy8gWW91IGNhbiBhbHNvIGNob29zZSB0byBzZXQgYW4gZW5kIHRpbWVcbiAgICAvLyBJZiBhbiBlbmQgdGltZSBpcyBzZXQsIHRoaXMgd2lsbCB0YWtlIHByZWNlZGVuY2Ugb3ZlciBkdXJhdGlvblxuICAgIGVuZDogbmV3IERhdGUoJ0p1bmUgMTUsIDIwMTMgMjM6MDAnKSwgICAgIFxuXG4gICAgLy8gRXZlbnQgQWRkcmVzc1xuICAgIGFkZHJlc3M6ICdUaGUgaW50ZXJuZXQnLFxuXG4gICAgLy8gRXZlbnQgRGVzY3JpcHRpb25cbiAgICBkZXNjcmlwdGlvbjogJ1Rlc3QgY2FsLidcbiAgfVxufSk7XG5cblx0XHQkKFwiLmNhbGFjdHMgLnRlc3RcIikuZW1wdHkoKS5hcHBlbmQoIG15Q2FsZW5kYXIgKTtcblx0fTtcblxuLy8gbG9hZCBhbmQgcGFyc2UgcmF3IENTVlxuXHQkKGZ1bmN0aW9uKCkge1xuXHRcdCQuYWpheCh7XG5cdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0dXJsOiBcImNhbGFjdHMuY3N2XCIsXG5cdFx0XHRkYXRhVHlwZTogXCJ0ZXh0XCIsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGNhbGFjdHMuY3N2PSQuY3N2LnRvQXJyYXlzKGRhdGEpO1xuXHRcdFx0XHRjYWxhY3RzLlBhcnNlQ1NWKClcblx0XHRcdFx0Y2FsYWN0cy50ZW1wbGF0ZS5sb2FkKFwidGVtcGxhdGUuaHRtbFwiLGNhbGFjdHMuZmlsbCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGNhbGFjdHMuY3N2KTtcblx0XHRcdH1cblx0XHQgfSk7XG5cdH0pO1xuXG5cdGNhbGFjdHMuUGFyc2VDU1Y9ZnVuY3Rpb24oKVxuXHR7XG5cdFx0Y2FsYWN0cy5vYmpzPVtdO1xuXHRcdGZvcih2YXIgaj0xO2o8Y2FsYWN0cy5jc3YubGVuZ3RoO2orKykgLy8gZmlyc3QgbGluZSBpcyBoZWFkZXJcblx0XHR7XG5cdFx0XHR2YXIgdD17fTtcblx0XHRcdGZvcih2YXIgaT0wO2k8Y2FsYWN0cy5jc3ZbMF0ubGVuZ3RoO2krKylcblx0XHRcdHtcblx0XHRcdFx0dFsgY2FsYWN0cy5jc3ZbMF1baV0gXT1jYWxhY3RzLmNzdltqXVtpXTtcblx0XHRcdH1cblx0XHRcdGNhbGFjdHMub2Jqc1tjYWxhY3RzLm9ianMubGVuZ3RoXT10O1xuXHRcdH1cblx0XHRjYWxhY3RzLnBsYWNlcz17fTtcblx0XHRjYWxhY3RzLnNsb3RzPVtdO1xuXHRcdGZvcih2YXIgaT0wO2k8Y2FsYWN0cy5vYmpzLmxlbmd0aDtpKyspXG5cdFx0e1xuXHRcdFx0dmFyIHQ9e307XG5cdFx0XHR0Lm5hbWU9Y2FsYWN0cy5vYmpzW2ldW1wiTGVpc3VyZUNlbnRyZU5hbWVcIl07XG5cdFx0XHR0LmFkZHJlc3M9Y2FsYWN0cy5vYmpzW2ldW1wiQWRkcmVzc1wiXTtcblx0XHRcdHQucGhvbmU9Y2FsYWN0cy5vYmpzW2ldW1wiVGVsZXBob25lXCJdO1xuXHRcdFx0dC5jb21tZW50cz1jYWxhY3RzLm9ianNbaV1bXCJDb21tZW50c1wiXTtcblx0XHRcdGNhbGFjdHMucGxhY2VzW3QubmFtZV09dDtcblx0XHRcdFxuXHRcdFx0Zm9yKHZhciBuIGluIGNhbGFjdHMub2Jqc1tpXSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGR1cj1jYWxhY3RzLm9ianNbaV1bbl07XG5cdFx0XHRcdGlmKCBkdXIgIT0gXCJcIiApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgbnM9bi5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdHZhciBuYT1ucy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0aWYoIChuYVsxXT09XCJtb25kYXlcIikgfHwgKG5hWzFdPT1cInR1ZXNkYXlcIikgfHwgKG5hWzFdPT1cIndlZG5lc2RheVwiKSB8fCAobmFbMV09PVwidGh1cnNkYXlcIikgfHwgKG5hWzFdPT1cImZyaWRheVwiKSB8fCAobmFbMV09PVwic2F0dXJkYXlcIikgfHwgKG5hWzFdPT1cInN1bmRheVwiKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YXIgcD17fTtcblx0XHRcdFx0XHRcdHAuZGF5PW5hWzFdO1xuXHRcdFx0XHRcdFx0cC5hY3Q9bmFbMF07XG5cdFx0XHRcdFx0XHRwLnBsYWNlPXQubmFtZTtcblx0XHRcdFx0XHRcdHAudGltZT1kdXI7XG5cdFx0XHRcdFx0XHRjYWxhY3RzLnNsb3RzW2NhbGFjdHMuc2xvdHMubGVuZ3RoXT1wO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhjYWxhY3RzLnBsYWNlcyk7XG5cdFx0Y29uc29sZS5sb2coY2FsYWN0cy5zbG90cyk7XG5cdH07XG5cdFxuXHRyZXR1cm4gY2FsYWN0cztcblxufTtcbiIsIjsoZnVuY3Rpb24oZXhwb3J0cykge1xuICB2YXIgTVNfSU5fTUlOVVRFUyA9IDYwICogMTAwMDtcblxuICB2YXIgZm9ybWF0VGltZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpLnJlcGxhY2UoLy18OnxcXC5cXGQrL2csICcnKTtcbiAgfTtcblxuICB2YXIgY2FsY3VsYXRlRW5kVGltZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50LmVuZCA/XG4gICAgICBmb3JtYXRUaW1lKGV2ZW50LmVuZCkgOlxuICAgICAgZm9ybWF0VGltZShuZXcgRGF0ZShldmVudC5zdGFydC5nZXRUaW1lKCkgKyAoZXZlbnQuZHVyYXRpb24gKiBNU19JTl9NSU5VVEVTKSkpO1xuICB9O1xuXG4gIHZhciBjYWxlbmRhckdlbmVyYXRvcnMgPSB7XG4gICAgZ29vZ2xlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHN0YXJ0VGltZSA9IGZvcm1hdFRpbWUoZXZlbnQuc3RhcnQpO1xuICAgICAgdmFyIGVuZFRpbWUgPSBjYWxjdWxhdGVFbmRUaW1lKGV2ZW50KTtcblxuICAgICAgdmFyIGhyZWYgPSBlbmNvZGVVUkkoW1xuICAgICAgICAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9jYWxlbmRhci9yZW5kZXInLFxuICAgICAgICAnP2FjdGlvbj1URU1QTEFURScsXG4gICAgICAgICcmdGV4dD0nICsgKGV2ZW50LnRpdGxlIHx8ICcnKSxcbiAgICAgICAgJyZkYXRlcz0nICsgKHN0YXJ0VGltZSB8fCAnJyksXG4gICAgICAgICcvJyArIChlbmRUaW1lIHx8ICcnKSxcbiAgICAgICAgJyZkZXRhaWxzPScgKyAoZXZlbnQuZGVzY3JpcHRpb24gfHwgJycpLFxuICAgICAgICAnJmxvY2F0aW9uPScgKyAoZXZlbnQuYWRkcmVzcyB8fCAnJyksXG4gICAgICAgICcmc3Byb3A9JnNwcm9wPW5hbWU6J1xuICAgICAgXS5qb2luKCcnKSk7XG4gICAgICByZXR1cm4gJzxhIGNsYXNzPVwiaWNvbi1nb29nbGVcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArXG4gICAgICAgIGhyZWYgKyAnXCI+R29vZ2xlIENhbGVuZGFyPC9hPic7XG4gICAgfSxcblxuICAgIHlhaG9vOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIGV2ZW50RHVyYXRpb24gPSBldmVudC5lbmQgP1xuICAgICAgICAoKGV2ZW50LmVuZC5nZXRUaW1lKCkgLSBldmVudC5zdGFydC5nZXRUaW1lKCkpLyBNU19JTl9NSU5VVEVTKSA6XG4gICAgICAgIGV2ZW50LmR1cmF0aW9uO1xuXG4gICAgICAvLyBZYWhvbyBkYXRlcyBhcmUgY3JhenksIHdlIG5lZWQgdG8gY29udmVydCB0aGUgZHVyYXRpb24gZnJvbSBtaW51dGVzIHRvIGhoOm1tXG4gICAgICB2YXIgeWFob29Ib3VyRHVyYXRpb24gPSBldmVudER1cmF0aW9uIDwgNjAwID9cbiAgICAgICAgJzAnICsgTWF0aC5mbG9vcigoZXZlbnREdXJhdGlvbiAvIDYwKSkgOlxuICAgICAgICBNYXRoLmZsb29yKChldmVudER1cmF0aW9uIC8gNjApKSArICcnO1xuXG4gICAgICB2YXIgeWFob29NaW51dGVEdXJhdGlvbiA9IGV2ZW50RHVyYXRpb24gJSA2MCA8IDEwID9cbiAgICAgICAgJzAnICsgZXZlbnREdXJhdGlvbiAlIDYwIDpcbiAgICAgICAgZXZlbnREdXJhdGlvbiAlIDYwICsgJyc7XG5cbiAgICAgIHZhciB5YWhvb0V2ZW50RHVyYXRpb24gPSB5YWhvb0hvdXJEdXJhdGlvbiArIHlhaG9vTWludXRlRHVyYXRpb247XG5cbiAgICAgIC8vIFJlbW92ZSB0aW1lem9uZSBmcm9tIGV2ZW50IHRpbWVcbiAgICAgIHZhciBzdCA9IGZvcm1hdFRpbWUobmV3IERhdGUoZXZlbnQuc3RhcnQgLSAoZXZlbnQuc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1TX0lOX01JTlVURVMpKSkgfHwgJyc7XG5cbiAgICAgIHZhciBocmVmID0gZW5jb2RlVVJJKFtcbiAgICAgICAgJ2h0dHA6Ly9jYWxlbmRhci55YWhvby5jb20vP3Y9NjAmdmlldz1kJnR5cGU9MjAnLFxuICAgICAgICAnJnRpdGxlPScgKyAoZXZlbnQudGl0bGUgfHwgJycpLFxuICAgICAgICAnJnN0PScgKyBzdCxcbiAgICAgICAgJyZkdXI9JyArICh5YWhvb0V2ZW50RHVyYXRpb24gfHwgJycpLFxuICAgICAgICAnJmRlc2M9JyArIChldmVudC5kZXNjcmlwdGlvbiB8fCAnJyksXG4gICAgICAgICcmaW5fbG9jPScgKyAoZXZlbnQuYWRkcmVzcyB8fCAnJylcbiAgICAgIF0uam9pbignJykpO1xuXG4gICAgICByZXR1cm4gJzxhIGNsYXNzPVwiaWNvbi15YWhvb1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICtcbiAgICAgICAgaHJlZiArICdcIj5ZYWhvbyEgQ2FsZW5kYXI8L2E+JztcbiAgICB9LFxuXG4gICAgaWNzOiBmdW5jdGlvbihldmVudCwgZUNsYXNzLCBjYWxlbmRhck5hbWUpIHtcbiAgICAgIHZhciBzdGFydFRpbWUgPSBmb3JtYXRUaW1lKGV2ZW50LnN0YXJ0KTtcbiAgICAgIHZhciBlbmRUaW1lID0gY2FsY3VsYXRlRW5kVGltZShldmVudCk7XG5cbiAgICAgIHZhciBocmVmID0gZW5jb2RlVVJJKFxuICAgICAgICAnZGF0YTp0ZXh0L2NhbGVuZGFyO2NoYXJzZXQ9dXRmOCwnICsgW1xuICAgICAgICAgICdCRUdJTjpWQ0FMRU5EQVInLFxuICAgICAgICAgICdWRVJTSU9OOjIuMCcsXG4gICAgICAgICAgJ0JFR0lOOlZFVkVOVCcsXG4gICAgICAgICAgJ1VSTDonICsgZG9jdW1lbnQuVVJMLFxuICAgICAgICAgICdEVFNUQVJUOicgKyAoc3RhcnRUaW1lIHx8ICcnKSxcbiAgICAgICAgICAnRFRFTkQ6JyArIChlbmRUaW1lIHx8ICcnKSxcbiAgICAgICAgICAnU1VNTUFSWTonICsgKGV2ZW50LnRpdGxlIHx8ICcnKSxcbiAgICAgICAgICAnREVTQ1JJUFRJT046JyArIChldmVudC5kZXNjcmlwdGlvbiB8fCAnJyksXG4gICAgICAgICAgJ0xPQ0FUSU9OOicgKyAoZXZlbnQuYWRkcmVzcyB8fCAnJyksXG4gICAgICAgICAgJ0VORDpWRVZFTlQnLFxuICAgICAgICAgICdFTkQ6VkNBTEVOREFSJ10uam9pbignXFxuJykpO1xuXG4gICAgICByZXR1cm4gJzxhIGNsYXNzPVwiJyArIGVDbGFzcyArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArXG4gICAgICAgIGhyZWYgKyAnXCI+JyArIGNhbGVuZGFyTmFtZSArICcgQ2FsZW5kYXI8L2E+JztcbiAgICB9LFxuXG4gICAgaWNhbDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmljcyhldmVudCwgJ2ljb24taWNhbCcsICdpQ2FsJyk7XG4gICAgfSxcblxuICAgIG91dGxvb2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5pY3MoZXZlbnQsICdpY29uLW91dGxvb2snLCAnT3V0bG9vaycpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2VuZXJhdGVDYWxlbmRhcnMgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICBnb29nbGU6IGNhbGVuZGFyR2VuZXJhdG9ycy5nb29nbGUoZXZlbnQpLFxuICAgICAgeWFob286IGNhbGVuZGFyR2VuZXJhdG9ycy55YWhvbyhldmVudCksXG4gICAgICBpY2FsOiBjYWxlbmRhckdlbmVyYXRvcnMuaWNhbChldmVudCksXG4gICAgICBvdXRsb29rOiBjYWxlbmRhckdlbmVyYXRvcnMub3V0bG9vayhldmVudClcbiAgICB9O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBDU1NcbiAgdmFyIGFkZENTUyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291aWNhbC1jc3MnKSkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChnZW5lcmF0ZUNTUygpKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdlbmVyYXRlQ1NTID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVzLmlkID0gJ291aWNhbC1jc3MnO1xuXG4gICAgc3R5bGVzLmlubmVySFRNTCA9IFwiI2FkZC10by1jYWxlbmRhci1jaGVja2JveC1sYWJlbHtjdXJzb3I6cG9pbnRlcn0uYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94fmF7ZGlzcGxheTpub25lfS5hZGQtdG8tY2FsZW5kYXItY2hlY2tib3g6Y2hlY2tlZH5he2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTUwcHg7bWFyZ2luLWxlZnQ6MjBweH1pbnB1dFt0eXBlPWNoZWNrYm94XS5hZGQtdG8tY2FsZW5kYXItY2hlY2tib3h7cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5cHg7bGVmdDotOTk5OXB4fS5hZGQtdG8tY2FsZW5kYXItY2hlY2tib3h+YTpiZWZvcmV7d2lkdGg6MTZweDtoZWlnaHQ6MTZweDtkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUZRQUFBQVFDQVlBQUFDSW9saTdBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlScFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TXkxak1ERXhJRFkyTGpFME5UWTJNU3dnTWpBeE1pOHdNaTh3TmkweE5EbzFOam95TnlBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5pQW9UV0ZqYVc1MGIzTm9LU0lnZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8wTXpKQ1JEVTJOVUUxTURJeE1VVXlPVFkxUTBFd05Ua3hORUpET1VJd05DSWdlRzF3VFUwNlJHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzBNekpDUkRVMk5rRTFNREl4TVVVeU9UWTFRMEV3TlRreE5FSkRPVUl3TkNJK0lEeDRiWEJOVFRwRVpYSnBkbVZrUm5KdmJTQnpkRkpsWmpwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qUXpNa0pFTlRZelFUVXdNakV4UlRJNU5qVkRRVEExT1RFMFFrTTVRakEwSWlCemRGSmxaanBrYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2pRek1rSkVOVFkwUVRVd01qRXhSVEk1TmpWRFFUQTFPVEUwUWtNNVFqQTBJaTgrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMUdjYjNRQUFDaDFKUkVGVWVOckVXQXR3Vk5VWi91N2Q5eXZaSkJ0TUlDOGVCaElLTWtRSWhxSUJLaXJXd3BTVzBkYWhDaXIxZ1FoV2cyWEtqTlJxUjdBalE2UWpnbEJGUklXMjBLbUMwS1JZalJZTUNaR0hHRWpJWTBPeTJVMzJsWDNkM1h2Nm54dVNiRUpDUU52cG4vbjMzUE9meHozM3U5Ly91QkdhQlFGY01oZ3JwR1lDNmRkayt6ZmlaS2d4c3ZPRzRidUpNR0FUTnR6Y3E0bCtXU3Ric0dncHZPaUVMcGdCV2V0R1FHTkNzdFNHa0t3SDFFazA0b1ZORlVaUXNFQWplZENnMGlCUlZpdnJQNzM3Q0wrSDhOYTdmN2xwUkZhMmNPZk1xZFVuOW4zQVJHYzdOTEVZSmo2MlFsZTZaMy9abEFUdDgybUlOVjRRVlBWMzNIVlhtSy8xYlJnUHZzdDYwdnpYZ0p6Wlo4NFVsT2ZuVjFML1l2d2hCeGs3UTdxdVozelpMcnZTaXZSeStQdFIwWThvVWl0MlA3K2FXbTVUaWZ4YWhFclZQV2ZkL0pSQlFhTlZqQTJDSWhzZWNFd0l1Ykh6QjMrQ1FXTkROQkNDeXVpRUM2TmdwVjNhZ2tDc3pZV2tuQlRJbmpBTUZoMjBIQW8xL1FRRlZNN0t3OWFseTdEMXplMmlKRWVtaGJ1OE16ZisrcmtWTkdNa2FTN3B1S2FkYjB5dWJHc2NwL1dhM3JjMG5OWFZKNlJzSnZzYVVobVh0NW95WnYzNmU0by8vaGkxdGJVb25qV3JZTlRzMlFYeGh5d3VMKzhibXpldm9HN2RPdTNnajhQbzJNSVZaR0ljQXc2VGNQbWEwWVY0SmZYWUVCaXkvcmJlcVpjditpMXRFYklnYWd6Z09BV01lclQ1TXZEdVhnZk9INnZBc1JvUmdWQXFIT3AyVE1yWDRkWWZGbUxoVkFIVFJxdGdrbjBRUTNXMGFuWksrVXN2ekplL3FmbHhpMmQwNGEzdTlpSldkbmdVSGQvSTMzS0V5SkVvcUJFMm1xQ3hHQkNxcS8vcDhpZFd2UGg2NldhMzVabHpVSWNBbmV6M3crbjE0dXdERDhDYWxZV28yOTN2WWVQSCtGeStKbjU4Mjg5SEt1MnJwYnV4OUtGN0VZNHlmSHJvQUhLTDVpdjJ3L3YyWWU3Q0JmQkhCTFJXSFlKNTRyenJDUWNzRHR4K1lBNE1BYnlUcWpzSExmTElyV1djQ2hqd3UvWEhVVm51eHJHREMyRzJBZHdubktRTlh3T0xIbndGSDRkYThWblpCcGcwWnFnY09nSk1mS2Erb3FKa1REUU1YM29yM0dGL2toZ0pROVRyb0RJblFFTnE5cmpJdGFOd3FVV2tlRG95MHd0bVRLWXQvOFhQcGc0d1pwQURBUlR0MllPSng0NUJvOVBCbFpFQnk4NmR2UWVkUEdrU3htWm53NVNRQUQ2WHJ4bnM2WFdtWU8rMXgzZStuNTJEMldNM1k5Nnc2RjBGMUY0d0J3c0JwckJFdiswd0lRTzdYajJIQzBlcmNMYmlFZGkwellneUFrMU9nRlVRY2NPTndQNWR5eEVMTk1DUTVDZnEwWVpwZWtnQ3BNWmdFTlB2bUljNUtja0VtNGdMNys5QnJMMGQxckZqWVNHR0drZVBneVdYNHFVMUNRVzN6Vkc1enRWK24yNWFRUnBWR0JvamtGcFdyb1RCYUFRL1RwRDZlcHV0M3hPWnpXYUtFakw0M0lFTTNmckhMWkQ4WHR5UWFzWGhkemJEYk5UQ0pqTjg5dGZ0dmZhVzhqZDY3ZlB5elAzalJCelRoR0dZS2d3eHJjY2VNMmV5WURRTkc5KzhpQU1mSHNhUlhZL0FvdVY0cVJBUzlOQ3JtbWtqS3hCS3dPUXNNOFgwaVFoUWtwSzFJVWlpQnhxMStvTGZhUEpKWG84bEVPeUNKdEdLU2NzZmhUWXBHWUl0RlRVWEc5RFkyb3FRdzRVbkZpNVNHRi8yemZraWFsUWNVSjY2VjdQckZMNW1RaHdnWEdSWlpqdis4QUx6QkdQTTRZdXlBOXMzc0ZNdElVVzUvWHg3aE5VMCtSVTdYN09NNWJGbEp4U1EyT0RSK0FybElVeTVIRGpXMDR5K3Q1VXJDOUo1Vm01dFl4a3ovczVZRjNXaUVTWXpQMk1SbWJtcDYrRUg5dnVaeE05TjlpQnowVmlVSGJjbHNQdVgvR0oyU1VuSmVYK0xuVVc2L01xekhUcDZsTDI5ZHk5cnRMZXd4NTk4a3BXc1djUHV1KzgrRm8xR2xmRzkrL2JabjFxMUtrMUp6SFFTbFV4SGpCTDdya1g1WEw1bU1CUWtzN1d2WTB2dlozZDRwVzYzajdOZm8vUURmWUNiczNpR2E2VU9SWU1VUC85MnFob1lFNFZzZE5Db0RFRXlVWXFuaEJJREVtSjhoWlllbktkbUVUSDY0NjhwV2EzR0pidmRIcEtpVFdwaW80WVN6N0hqeDdIdTJXZHg5S09Qa0RreUhhV2JOaUUvTHcrTEZ5K21ha1dsSENJbk95YzlNeU9USjNKUnpjRWhuQ0hIWXRmMGRDSnR3cnJwM1N1dnYvVUd2TzR1V0JMTjJMOS9ON3hlRnp5ZWRyUzQzK3ExRjQwMURRZGFQKzhWcmcxcHBjUlMzdCtERFZRZTlkaEZxRjNKaUhUYUlZYVR5TDJqWUlsZDhJc0dXQ1FSVEIrR29DY2dpVTVxMlFDRDZLTkZkUWpyTTFGVlhlVVlkK1BZeGc2bkUrbnA2WmlZbjQ4ZE8zWmc3ZHExaUVRaTBHcTFLS2VxaDFoODJUMkJVUmtaUWxwYTJrenFIdUoxcUVwaDN6Q0FQblZ5RGFvOFg2RWdlUW93QU5EbFN4N21mbzl0NzcyTkJRdCtwbVQ1VDQ2OGpnbUZTNVR4aXFQdmRkZXJMTytLZmNudGUyWDcxRzlWekN2anVsaGZaYUpGRmpKU3JDajcvRGpDcWdoMFZONkV2U0lzQ1VBWG5keFB2RHhmMXc1dDRnam9ZMXFFbkFZVWZJOFNwdW9rT2x5SUJJUGhDMDZuU3dIVVpESWhOemNYb1ZBSVJGN2s1T1FvTGM4My9FMWV1dFNLcHVZbVJLVG9MWnMzbDZaemhxbzVReVBSNkZWUGZjSlpnMmxGTjZQeTgwcStrYnAyV3pMd1VFZS9PWjJPdnI0WVUxMXByenFMLzVYb1JIM2Z2YWt3bWpGZFF0bEg0L0ZDNlZkWS9kUk5WS0VZZU1xQVVSM0VpU285Vmo1NkFzMitNS3dHTXg2OGZ5U201bytIU2VEaDZGTE03L2ZWdTF6TzN2MjRheGNVRkpEbmVaWCtTa3JnWHE4UGxaVW5FS0tLd0dwTmdNL3JtYUxUNjZaMXV6d3hWQm9DMEpLcXRUanBQdFZkOHNROFlKS00rZzNXNVplL0hwWjNmOXIwa2FoazVhcTQxYi9zdDFjOEEzdVlPUVFycjB1eUZ3ZXArdWpyRzZISGlwL1lzUHZsVG16KzdkY292bk1HWms0Z3Q2Y1lLWFFGTVd1eUFWOTgraU9jcGZCNmU5SHpGQnZ2b1M4N0o5WGZ5bktaV0ZuZmJMZnpid09sbXBFa0NhdWZmaHBlanhlbnZqcUY3S3hzZFBGNlBCeUN6K1BINmRPbktWUlVXOGVNR1gxTE4wTUowTWdRTGwvZFZnTmI4WWp1QWovcVJGSmhNbVlWemtrdi8zTlpBVjZqSlBTNFcvZ1dHTERyL1VhL21rUU16UU0yVDRkTjU4US9EeGJpenVJS0xManRIYXg3YmhxV1BKYUxWSk1XUHNYcHphaDNTV2ozbjZHUU1LZjcvd0FtUDYvNjVmcTZ1dWJHcHNhT0ZudEx1cVBkQVJlNXY0ZlkyZW1pMXVlai9PQm1qamFuMytWMnRmaTh2b1pZTEZvWGxhSm5qUVpEaFpvSmdpN0dYWDRJUVBOTitUaDlzSnVobUt1Q1dNNXc1cHZxTmlTTGxmZy95aGNMeDJQRXFBK1FxaFIvd1g1akhpcnJkYklKSTI0QS9sRzlHcXQvVTQ1Tld6N0V5OXMvQnpRM1FwVVFRYWpkak1TME5peGR0UWhGeFRmVEd6VlFEYzZyRkovODVaZGZlbTZlUHIyOWRNdVdkR0tpNVBWNk92MkJRRk1vRkw1SU5YcXR4K3VwZDNkMjFyWFk3WTVBSU1CdlRwOEZDSmVYbC9uVkJLTkZSYTdBZyt4Z3NuSDJLMHA3OSs0NzRJeDFJSld5NXFnWHV3NDBNUGI4ZHdGa09GZm5nQTBuWTl6cVFlMVduclF0elFSU0Jnd0dFWHMyenFVSG1YdkZ2Q0NGTHdQL0x3NlBkaFFMalZxRlZJd1NrQ1JGSWdkUFZwK3NJNjZkN3VyeTFYcmM3c2FHaGtaN09CemlBRXB4R290WFlZUWcvSjRDUmVad2gzZmRyaXFNMklRa3JaTjFtZy9IOWpvWSs0RE12U3l0K2VRbFRMNzF1ZjhhKzY1VmZ2Vnc1bkRoNUpwbDU4TkhNSzVGQ1Q4OGRpYVNHaTRERlluVEh2RGtnVFV5bC84SU1BQnRLaDhwaVp3SXV3QUFBQUJKUlU1RXJrSmdnZz09KTttYXJnaW4tcmlnaHQ6LjVlbTtjb250ZW50OicgJ30uaWNvbi1pY2FsOmJlZm9yZXtiYWNrZ3JvdW5kLXBvc2l0aW9uOi02OHB4IDB9Lmljb24tb3V0bG9vazpiZWZvcmV7fS5pY29uLXlhaG9vOmJlZm9yZXtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0zNnB4ICs0cHh9Lmljb24tZ29vZ2xlOmJlZm9yZXtiYWNrZ3JvdW5kLXBvc2l0aW9uOi01MnB4IDB9XCI7XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9O1xuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIHRoZSBuZWNlc3NhcnkgZXZlbnQgZGF0YSwgc3VjaCBhcyBzdGFydCB0aW1lIGFuZCBldmVudCBkdXJhdGlvblxuICB2YXIgdmFsaWRQYXJhbXMgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICByZXR1cm4gcGFyYW1zLmRhdGEgIT09IHVuZGVmaW5lZCAmJiBwYXJhbXMuZGF0YS5zdGFydCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAocGFyYW1zLmRhdGEuZW5kICE9PSB1bmRlZmluZWQgfHwgcGFyYW1zLmRhdGEuZHVyYXRpb24gIT09IHVuZGVmaW5lZCk7XG4gIH07XG5cbiAgdmFyIGdlbmVyYXRlTWFya3VwID0gZnVuY3Rpb24oY2FsZW5kYXJzLCBjbGF6eiwgY2FsZW5kYXJJZCkge1xuICAgIHZhciByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHJlc3VsdC5pbm5lckhUTUwgPSAnPGxhYmVsIGZvcj1cImNoZWNrYm94LWZvci0nICtcbiAgICAgIGNhbGVuZGFySWQgKyAnXCIgY2xhc3M9XCJhZGQtdG8tY2FsZW5kYXItY2hlY2tib3hcIj4rIEFkZCB0byBteSBDYWxlbmRhcjwvbGFiZWw+JztcbiAgICByZXN1bHQuaW5uZXJIVE1MICs9ICc8aW5wdXQgbmFtZT1cImFkZC10by1jYWxlbmRhci1jaGVja2JveFwiIGNsYXNzPVwiYWRkLXRvLWNhbGVuZGFyLWNoZWNrYm94XCIgaWQ9XCJjaGVja2JveC1mb3ItJyArIGNhbGVuZGFySWQgKyAnXCIgdHlwZT1cImNoZWNrYm94XCI+JztcblxuICAgIE9iamVjdC5rZXlzKGNhbGVuZGFycykuZm9yRWFjaChmdW5jdGlvbihzZXJ2aWNlcykge1xuICAgICAgcmVzdWx0LmlubmVySFRNTCArPSBjYWxlbmRhcnNbc2VydmljZXNdO1xuICAgIH0pO1xuXG4gICAgcmVzdWx0LmNsYXNzTmFtZSA9ICdhZGQtdG8tY2FsZW5kYXInO1xuICAgIGlmIChjbGF6eiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQuY2xhc3NOYW1lICs9ICgnICcgKyBjbGF6eik7XG4gICAgfVxuXG4gICAgYWRkQ1NTKCk7XG5cbiAgICByZXN1bHQuaWQgPSBjYWxlbmRhcklkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIGdldENsYXNzID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zICYmIHBhcmFtcy5vcHRpb25zLmNsYXNzKSB7XG4gICAgICByZXR1cm4gcGFyYW1zLm9wdGlvbnMuY2xhc3M7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRPckdlbmVyYXRlQ2FsZW5kYXJJZCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHJldHVybiBwYXJhbXMub3B0aW9ucyAmJiBwYXJhbXMub3B0aW9ucy5pZCA/XG4gICAgICBwYXJhbXMub3B0aW9ucy5pZCA6XG4gICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTsgLy8gR2VuZXJhdGUgYSA2LWRpZ2l0IHJhbmRvbSBJRFxuICB9O1xuXG4gIGV4cG9ydHMuY3JlYXRlQ2FsZW5kYXIgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAoIXZhbGlkUGFyYW1zKHBhcmFtcykpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFdmVudCBkZXRhaWxzIG1pc3NpbmcuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGdlbmVyYXRlTWFya3VwKGdlbmVyYXRlQ2FsZW5kYXJzKHBhcmFtcy5kYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3MocGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0T3JHZW5lcmF0ZUNhbGVuZGFySWQocGFyYW1zKSk7XG4gIH07XG59KSh0aGlzKTtcbiJdfQ==
