
dofile("../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="weeeee"

tab.cache_files={

"art/by.png",
"art/icon.png",
"art/splash.png",
"art/plax/p10.png",
"art/plax/p11.png",
"art/plax/p12.png",
"art/plax/p13.png",

"art/tiles/lft.png",
"art/tiles/mid.png",
"art/tiles/rgt.png",

"jslib/jquery.min.js",

{"out/weeeee.html","weeeee.html",},
{"out/weeeee.css","weeeee.css",},
{"out/weeeee.min.js","weeeee.min.js",},
{"out/gamecake.min.js","gamecake.min.js",},

}


gamecake.build(tab)
