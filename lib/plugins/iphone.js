// iphone.js: iPhone friendliness. Free of charge.
if (navigator.userAgent.match(/iPhone/i)) {
  Shining.config.help = false;
  Shining.config.transitions = 'none';
  $('#stage .contents').remove();
  $(window).unbind('resize');

  var scale = window.innerWidth / document.documentElement.clientWidth;
  
  Shining.slides.playSlide = function(name) {
    var offset = Shining.slides._slides.indexOf(name) * window.innerWidth;
    $('body').transformTransition({translate: {x: -offset }});
    Shining.slides.current(name);
  }

  Shining.slides.nextSlide = function() {
    Shining.slides.playSlide(Shining.slides.next() || Shining.slides.current());
  }

  Shining.slides.previousSlide = function() {
    Shining.slides.playSlide(Shining.slides.previous() || Shining.slides.current());
  }

  function fitToView() {
    $('div.slide').each(function(i) {
      $(this).css({left: i * window.innerWidth, height: window.innerHeight });
    });
  }
  
  $(window).bind('orientationchange', function() {
    fitToView();    
    var offset = Shining.slides._slides.indexOf(Shining.slides.current()) * window.innerWidth;
    $('body').transformTransition({translate: {x: -offset }});    
  });

  function getSlideWidth() {
    return (window.orientation == 0 || window.orientation == 180) ? 320 : 480;
  }

  function flick(direction) {
    return Shining.slides[direction == 'right' ? 'nextSlide' : 'previousSlide']();
	}

  Shining.when('slidesloaded', function(i) {
    $(Shining.config.slides).each(function(i) {
      var slide = Shining.slides._loaded[this];
      $('<div class="slide">' + slide.markup + '</div>')
        .css({left: i * getSlideWidth() })
        .appendTo($('#stage'));
    });

    $('body').bind('touchstart', function() {
      $(this).data('pan', {
        startX: event.targetTouches[0].screenX,
        lastX: event.targetTouches[0].screenX,
        startTime: new Date().getTime(),
        startOffset: $(this).transform().translate.x,
        distance: function() {
          return Math.round(scale * (this.startX - this.lastX));
        },
        delta: function() {
          var x = event.targetTouches[0].screenX;
          this.dir = this.lastX > x ? 'right' : 'left';
          var delta = Math.round(scale * (this.lastX - x));
          this.lastX = x;
          return delta;
        },
        duration: function() {
          return new Date().getTime() - this.startTime;
        }
      });
      return false;
    })
    .bind('touchmove', function() {
      var pan = $(this).data('pan');
      $(this).transform({translateBy: {x: -pan.delta()}});
      return false;
    })
    .bind('touchend', function() {
      var pan = $(this).data('pan');
      flick(pan.dir);
      return false;
    });
  });
}