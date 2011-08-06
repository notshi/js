
dofile("../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="weeeee"

tab.cache_files={

"art/by.png",
"art/icon.png",
"art/splash.png",

}


gamecake.build(tab)
