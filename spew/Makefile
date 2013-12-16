
#make full - for a really slow build that runs all art generation scripts as well

all: bake

full: art sfx bake

FORCE:

bake:
	../../bin/exe/gamecake bake.lua

art: FORCE
	../../bin/exe/gamecake art/art.lua

sfx: FORCE
	../../bin/exe/gamecake art/sfx.lua

