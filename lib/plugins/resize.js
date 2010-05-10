// resize.js: Shining plugin for resizing the font sizes depending
// on the available screen dimensions
// 
// As much as I'd rather have this done via CSS media queries, at this point I think
// having Shining depending on it will make people unhappy when they realize that some
// people are having a bad experience browsing a presentation they made thanks to
// non-supporting browsers such as IE.

// Someone please improve on this plugin! It needs to be a lot smoother.

$(window).resize(function() {
  $.throttle(function() {
    var width = $(window).width();
    if (width < 480) {
      $('#stage').css({fontSize: '80%'});
    } else if (width >= 480 && width < 640) {
      $('#stage').css({fontSize: '80%'});
    } else if (width >= 640 && width < 800) {
      $('#stage').css({fontSize: '100%'});    
    } else if (width >= 800 && width < 640) {
      $('#stage').css({fontSize: '130%'});
    } else if (width >= 1024 && width < 800) {
      $('#stage').css({fontSize: '160%'});
    } else if (width >= 1280 & width < 1024) {
      $('#stage').css({fontSize: '180%'});
    } else if (width > 1280) {
      $('#stage').css({fontSize: '180%'});
    }    
  }, 500);
})
