
Some Javascript apps.

Building requires node and npm to be installed and a bash environment 
is assumed (Installing git on windows will easily get you one).



from within a directory EG spew the following commands are available

	npm install
	
Install the node dependencies required to build and run. This only 
needs to be done once.

	./bake
	
Combine the source js into a single js file and minify it.

	./serv
	
Start a test server at http://localhost:1337/

	./zip
	
Create an output zip containing everything.


So I generally run

	./bake && ./serv
	
to build and start a test server.

