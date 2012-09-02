
#make full - for a really slow build that runs all art generation scripts as well

all: bake

full: art sfx bake

FORCE:

bake:
	../../bin/exe/lua bake.lua

art: FORCE
	../../bin/exe/lua art/art.lua

sfx: FORCE
	../../bin/exe/lua art/sfx.lua

