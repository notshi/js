
Spew=function(opts){

	var storage_available=typeof window.localStorage!=='undefined';
	var json_available=typeof window.JSON!=='undefined';


	var spew={};
	var users={};

	spew.max_image_size=1024*1024; // 1 meg seems reasonable? bigger files are not displayed
	spew.filesizes={}; // map urls to file sizes
	
	spew.ytapi=undefined;
	spew.ytapi_count=9999;
	
#include "../spew/src/spew.opts.js"	
#include "../spew/src/spew.sock.js"
#include "../spew/src/spew.names.js"
#include "../spew/src/spew.html.js"
		
	return spew;
};
