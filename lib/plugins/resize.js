// resize.js: Shining plugin for resizing the stage's base font size depending on available screen dimensions
Shining.pluginProcesses['resize'] = setInterval(function() {
  var width = $(window).width();
  if (width >= 640 && width < 800) {
    $('#stage').css({fontSize: '100%'});
  } else if (width >= 800 && width < 1024) {
    $('#stage').css({fontSize: '130%'});
  } else if (width >= 1024 && width < 1280) {
    $('#stage').css({fontSize: '160%'});
  } else if (width >= 1280 && width < 1440) {
    $('#stage').css({fontSize: '180%'});
  } else if (width > 1440) {
    $('#stage').css({fontSize: '200%'});
  }  
}, 500);
