
#make full - for a really slow build that runs all art generation scripts as well

all: bake

full: art sfx bake

FORCE:

bake:
	../bin/exe/lua bake.lua

art: FORCE
	../bin/exe/lua art/art.lua

sfx: FORCE
	../bin/exe/lua art/sfx.lua

# the cookie used here is ip locked and changes often so reasonably safe to expose here
# its probably out of date by the time anyone else gets to know it, still would be nice to
# pick it up from chrome or something
upload: all
	curl -# --form "filedata=@out/spew.zip" --form "filename=" --form "mimetype=" --form "dataid=139601" --form "submit=Upload" --cookie "wet_session=35483fc3297df329ef0df6c84cde4b8e" --referer "http://wet.appspot.com/data" http://wet.appspot.com/data >/dev/null
