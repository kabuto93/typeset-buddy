#include "./polyfills.jsx"
#include "./main.jsx"

var res =	tryExec('adjustFontSizeSelectedLayers', 1.1);
if (res != 'done') alert(res);
