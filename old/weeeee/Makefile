
#make full - for a really slow build that runs all art generation scripts as well
#make fast - for a really fast build that only bumps the base code

all: fast

full: art sfx bake

FORCE:

bake:
	../bin/exe/lua bake.lua

fast:
	../bin/exe/lua bake.lua noart

art: FORCE
	../bin/exe/lua art/art.lua

sfx: FORCE
	../bin/exe/lua art/sfx.lua
