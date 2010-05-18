// iphone.js: iPhone friendliness. Free of charge.

Shining.when('init', function() {
  Shining.config.help = false;
  $('head').append('<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0">')
  $('head').append('<link rel="stylesheet" type="text/css" href="vendor/css/iphone.css" media="all" class="iphone"/>')
  $('head').append('<meta name="apple-mobile-web-app-capable" content="yes" />');
  $('#stage').click(Shining.nextSlide);
  $(document).click(function(event) {
    if ($(event.target).is('a')) return false;
    if (event.pageX < ($(window).width() / 2)) {
      Shining.previousSlide();
    } else {
      Shining.nextSlide();
    }
  })
  Shining.help('Tap on the left or right hand side to navigate', 3000, true);
})

/*
 * jSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/swipe
 * http://www.ryanscherf.com/demos/swipe/
 *
 * Copyright (c) 2009 Ryan Scherf (www.ryanscherf.com)
 * Licensed under the MIT license
 *
 * $Date: 2009-07-14 (Tue, 14 Jul 2009) $
 * $version: 0.1
 * 
 * This jQuery plugin will only run on devices running Mobile Safari
 * on iPhone or iPod Touch devices running iPhone OS 2.0 or later. 
 * http://developer.apple.com/iphone/library/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
 */