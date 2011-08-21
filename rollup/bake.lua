
dofile("../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="rollup"

tab.cache_files={

"art/die/d2.png",
"art/die/d4.png",
"art/die/d6.png",
"art/die/d8.png",
"art/die/d10.png",
"art/die/d12.png",
"art/die/d20.png",

"art/by.png",
"art/icon.png",
"art/splash.png",

"art/menu.png",
"art/readme.png",

"jslib/jquery.min.js",

"rollup.html",
"rollup.css",
"rollup.min.js",
"gamecake.min.js",

}


gamecake.build(tab)
