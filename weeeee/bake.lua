
dofile("../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="weeeee"

tab.cache_files={

"art/pp0.png",
"art/pp1.png",
"art/pp2.png",
"art/pp3.png",
"art/pp4.png",
"art/pp5.png",
"art/pp6.png",
"art/pp7.png",
"art/pp8.png",
"art/pp9.png",
"art/box1.png",
"art/box2.png",
"art/box3.png",
"art/score.png",
"art/over.png",
"art/e.png",
"art/sled.png",
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

"art/mp3/tune.mp3",

"art/mp3/bonus.mp3",
"art/mp3/jump.mp3",
"art/mp3/pick.mp3",
"art/mp3/splode.mp3",
"art/mp3/start.mp3",

"art/soundmanager2.swf",
"art/soundmanager2_flash9.swf",

"jslib/bookmark_bubble.js",
"jslib/excanvas.compiled.js",
"jslib/jquery.min.js",
"jslib/soundmanager2-nodebug-jsmin.js",

"weeeee.html",
"weeeee.css",
"weeeee.min.js",
"gamecake.min.js",

}


gamecake.build(tab)
