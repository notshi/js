
name="rollup"

cache_files={

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

"jslib/jquery.min.js",

{"out/rollup.html","rollup.html",},
{"out/rollup.css","rollup.css",},
{"out/rollup.min.js","rollup.min.js",},
{"out/gamecake.min.js","gamecake.min.js",},

}

dofile '../gamecake/bake.lua'
