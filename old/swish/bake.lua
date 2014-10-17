dofile("../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="swish"

tab.cache_files={

"jslib/jquery.min.js",

"swish.html",
"swish.css",
"swish.min.js",

}



gamecake.build(tab)

