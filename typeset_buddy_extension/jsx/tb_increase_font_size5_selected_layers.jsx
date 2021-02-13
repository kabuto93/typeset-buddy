#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('adjustFontSizeSelectedLayers', 2);
if (res != 'done') alert(res);
