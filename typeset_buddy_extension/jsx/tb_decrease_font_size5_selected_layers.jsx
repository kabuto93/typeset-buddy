#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('adjustFontSizeSelectedLayers', .5);
if (res != 'done') alert(res);
