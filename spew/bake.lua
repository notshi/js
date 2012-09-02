dofile("../../bin/lua/wetgenes/bake/pathfix.lua")

local gamecake=require("wetgenes.bake.gamecake")

local tab={}
tab.arg={...}

tab.name="spew"

tab.cache_files={

"jslib/jquery.min.js",
"jslib/swfobject.js",
"jslib/web_socket.js",

"art/WebSocketMainInsecure.swf",

"spew.html",
"spew.css",
"spew.min.js",
"gamecake.min.js",

}



gamecake.build(tab)

