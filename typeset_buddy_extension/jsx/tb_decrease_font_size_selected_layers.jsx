#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('adjustFontSizeSelectedLayers', .9);
if (res != 'done') alert(res);
