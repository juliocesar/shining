// iphone.js: iPhone friendliness. Free of charge.
// The iPhone touch code is heavily borrowed from libraries around the web.
// If you recognize anything as yours and you'd like credit for it, get in touch.
var iPhone = !!navigator.userAgent.match(/iPhone/), iPad = !!navigator.userAgent.match(/iPad/);

if (iPhone || iPad) {
  Shining.config.help = false;
  Shining.config.transitions = 'none';
  if (iPhone) {
    clearInterval(Shining.pluginProcesses['resize']);
    $(window).unbind('resize');
  }

  var scale = window.innerWidth / document.documentElement.clientWidth;

  Shining.slides.playSlide = function(name) {
    var index = Shining.slides._slides.indexOf(name),
      offset = index * window.innerWidth,
      slide = Shining.slides._loaded[name];
    $('body').transformTransition({translate: {x: -offset }});
    Shining.slides.current(name);
    var aside = $('#stage .slide:eq(' + index + ') aside');
    if (aside.length) setTimeout(
      function() {
        Shining.note(aside.html(), 5000);
        $('#note').css({right: 10 - offset, maxWidth: '60%'});
      },
      500
    );
  };

  Shining.centerStage = function(animate) {
    $('.slide').each(function() {
      centerSlide($(this));
    });
  };

  Shining.slides.nextSlide = function() {
    Shining.slides.playSlide(Shining.slides.next() || Shining.slides.current());
  };

  Shining.slides.previousSlide = function() {
    Shining.slides.playSlide(Shining.slides.previous() || Shining.slides.current());
  };

  function fitToView() {
    $('div.slide').each(function(i) {
      $(this).css({left: i * window.innerWidth, height: window.innerHeight });
    });
  }

  function centerSlide(slide) {
    var top = (window.innerHeight - slide.outerHeight()) / 3;
    if (top < 0) top = 0;
    slide.css({ top: top });
  }

  function currentSlide() {
    return $('#stage .slide:eq(' + Shining.slides._slides.indexOf(Shining.slides.current()) + ')');
  }

  $(window).bind('orientationchange', function() {
    fitToView();
    var offset = Shining.slides._slides.indexOf(Shining.slides.current()) * window.innerWidth;
    $('body').transformTransition({translate: {x: -offset }});
    $('#note').css({right: 10 - offset});
  });

  function flick(direction) {
    return Shining.slides[direction == 'right' ? 'nextSlide' : 'previousSlide']();
	}

  Shining.when('slidesloaded', function(i) {
    $('#stage').empty();
    $(Shining.config.slides).each(function(i) {
      var slide = Shining.slides._loaded[this];
      $('<div class="slide">' + slide.markup + '</div>')
        .css({left: i * window.innerWidth })
        .appendTo($('#stage'));
    });
    if (iPad) Shining.centerStage();
    $('body').bind('touchstart', function() {
      $(this).data('pan', {
        startX: event.targetTouches[0].screenX,
        lastX: event.targetTouches[0].screenX,
        startTime: new Date().getTime(),
        startOffset: $(this).transform().translate.x,
        distance: function() { return Math.round(scale * (this.startX - this.lastX)); },
        delta: function() {
          var x = event.targetTouches[0].screenX;
          this.dir = this.lastX > x ? 'right' : 'left';
          var delta = Math.round(scale * (this.lastX - x));
          this.lastX = x;
          return delta;
        },
        duration: function() { return new Date().getTime() - this.startTime; }
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
      if (pan.dir) flick(pan.dir);
      return false;
    });
  });
}