// iphone.js: iPhone friendliness. Free of charge.

if (navigator.userAgent.match(/iPhone/i)) {
  Shining.when('init', function() {
    Shining.config.help = false;
    $('head').append('<link rel="stylesheet" type="text/css" href="vendor/css/iphone.css" media="all" class="iphone"/>')
    $('#stage').click(function(event) {
      if ($(event.target).is('a')) return false;
      if (event.pageX < ($(window).width() / 2)) {
        Shining.previousSlide();
      } else {
        Shining.nextSlide();
      }
    })
    Shining.help('Tap on the left or right hand side to navigate', 3000, true);
  });  
}