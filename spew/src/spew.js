
Spew=function(opts){

	var storage_available=typeof window.localStorage!=='undefined';
	var json_available=typeof window.JSON!=='undefined';


	var spew={};
	var users={};
	
#include "../spew/src/spew.opts.js"	
#include "../spew/src/spew.sock.js"
#include "../spew/src/spew.names.js"
#include "../spew/src/spew.html.js"

		
	return spew;
};
