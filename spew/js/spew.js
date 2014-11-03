
var ls=function(a) { console.log(util.inspect(a,{depth:null})); }

exports.setup=function(opts){


	var spew={};

	spew.storage_available=typeof window.localStorage!=='undefined';
	spew.json_available=typeof window.JSON!=='undefined';


	spew.users={};

	spew.max_image_size=1024*1024; // 1 meg seems reasonable? bigger files are not displayed
	spew.filesizes={}; // map urls to file sizes
	
	spew.ytapi=undefined;
	spew.ytapi_count=9999;

	require('./spew.opts.js').setup(spew);
	require('./spew.sock.js').setup(spew);
	require('./spew.names.js').setup(spew);
	require('./spew.html.js').setup(spew);
	
	spew.html_setup(opts);
			
	return spew;
};
