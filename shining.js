(function($) {
  $.fn.ondistance = function(specified, close, far) {
    var elt = this.get(0),
      last,
      offset = $(elt).offset(),
      center = { x: offset.left + ($(elt).width() / 2), y: offset.top + ($(elt).height() / 2) };
    $(document).mousemove(function(e) {
      // Throttle
      var current = new Date().getTime();
      if (current - last < 500) return;
      last = current;
      var distance = parseInt(Math.sqrt(Math.pow(e.pageX-center.x, 2) + Math.pow(e.pageY-center.y, 2)));
      if (specified >= distance) {
        if ($(elt).data('mouseclose') == true) return false;
        $(elt).data('mouseclose', true);
        close(elt);
      } else {
        if ($(elt).data('mouseclose') == false) return false;
        $(elt).data('mouseclose', false);
        far(elt);
      }
    })
  }
  
  $.fn.centralize = function() {
    var self = this.get(0);
      windowHeight = document.documentElement.clientHeight, 
      elementHeight = (self.offsetHeight + $(self).padding().top + $(self).padding().bottom);
    $(self).css('position', 'relative').css('top', (windowHeight / 2) - (elementHeight / 2) + 'px');      
  }
  
  $.shining = function() {
    $.shining.slides = {
      get length()      { return this._slides.length },
      get current()     { return (typeof this._current == 'undefined' ? this._slides[0] : this._slides[this._current]) },
      set current(_new) { this._current = this._slides.indexOf(_new); return this.current },
      get all()         { return this._slides },
      get first()       { return this._slides[0] },
      get last()        { return this._slides[ this._slides.length - 1 ] },
      get next()        { return this._slides[ this._slides.indexOf(this.current) + 1 ] },
      get previous()    { return this._slides[ this._slides.indexOf(this.current) - 1 ] },
      add: function(slides) { return Array.prototype.push.apply(this._slides, slides) },
      _slides: [],
      _current: 0
    };

    String.prototype.markup = function() { return this + '.html' };
    String.prototype.script = function() { return this + '.js' };

    $.extend($.shining, {
      firstSlide:     function() { return getSlide($.shining.slides.first) },
      lastSlide:      function() { return getSlide($.shining.slides.last ) },
      nextSlide:      function() { return getSlide($.shining.slides.next) },
      previousSlide:  function() { return getSlide($.shining.slides.previous) }
    });

    function init()         {
      $(document).ready(function() {
        $('#controls').ondistance(
          300,
          function(controls) { $(controls).addClass('fades-in') },
          function(controls) { $(controls).removeClass('fades-in') }
        );
        $('#controls #first').    click(function() { $.shining.firstSlide() });
        $('#controls #previous'). click(function() { $.shining.previousSlide() });
        $('#controls #next').     click(function() { $.shining.nextSlide() });
        $('#controls #last').     click(function() { $.shining.lastSlide() });
        $('#stage').centralize();
      });
      $(window).resize(function() { $('#stage').centralize() });
      loadConfig(function() { getSlide($.shining.slides.current) });
    }

    function getSlide(name) {
      if (!name) return false;
      if ($.shining.config.transitions) {
        $('#stage').removeClass('fades-in');
        setTimeout(
          function() {
            loadSlide(name);
            setTimeout(
              function() {
                $('#stage').addClass('fades-in');
                runSlideScript($.shining.currentScript);
              },
            200);
          }, 200);
      } else {
        loadSlide(name);
      }
    }

    // private
    function slide(name) {
      return 'slides/' + name;
    }
    
    function loadSlide(name) {
      $('#stage').load(
        slide(name).markup(),
        function(data) {
          $.shining.slides.current = name;
          $('#stage').centralize();
          if (data) {
            $.get(slide(name).script(), function(script) {
              if ($.shining.config.transitions) {
                $.shining.currentScript = script;
              } else {
                runSlideScript(script);
              }
            });
          }
        }
      );
    }

    function loadConfig(callback) {
      $.getJSON('config.json', function(config) {
        $.shining.config = config;
        $.shining.slides.add(config.slides);
        if (config.transitions) {
          $('#stage').addClass('transparent fades-in');
        }
        callback.call();
      });
    }

    function runSlideScript(script) {
      with($.shining.context) { eval(script) };
    };

    // boots!
    init();
  }

  // gives slide scripts a context for execution
  $.shining.context = $.noop;
  with ($.shining.context) {
    this.at            = function(seconds, method) { setTimeout(method, parseInt(seconds) * 1000) };
    this.nextSlide     = function() { $.shining.nextSlide() };
    this.previousSlide = function() { $.shining.previousSlide() };
  }

  // boots!
  $.shining();
  
})(jQuery);


/*
 * JSizes - JQuery plugin v0.33
 *
 * Licensed under the revised BSD License.
 * Copyright 2008-2010 Bram Stein
 * All rights reserved.
 */
(function(b){var a=function(c){return parseInt(c,10)||0};b.each(["min","max"],function(d,c){b.fn[c+"Size"]=function(g){var f,e;if(g){if(g.width!==undefined){this.css(c+"-width",g.width)}if(g.height!==undefined){this.css(c+"-height",g.height)}return this}else{f=this.css(c+"-width");e=this.css(c+"-height");return{width:(c==="max"&&(f===undefined||f==="none"||a(f)===-1)&&Number.MAX_VALUE)||a(f),height:(c==="max"&&(e===undefined||e==="none"||a(e)===-1)&&Number.MAX_VALUE)||a(e)}}}});b.fn.isVisible=function(){return this.is(":visible")};b.each(["border","margin","padding"],function(d,c){b.fn[c]=function(e){if(e){if(e.top!==undefined){this.css(c+"-top"+(c==="border"?"-width":""),e.top)}if(e.bottom!==undefined){this.css(c+"-bottom"+(c==="border"?"-width":""),e.bottom)}if(e.left!==undefined){this.css(c+"-left"+(c==="border"?"-width":""),e.left)}if(e.right!==undefined){this.css(c+"-right"+(c==="border"?"-width":""),e.right)}return this}else{return{top:a(this.css(c+"-top"+(c==="border"?"-width":""))),bottom:a(this.css(c+"-bottom"+(c==="border"?"-width":""))),left:a(this.css(c+"-left"+(c==="border"?"-width":""))),right:a(this.css(c+"-right"+(c==="border"?"-width":"")))}}}})})(jQuery);