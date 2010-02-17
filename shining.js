(function($) {
  $.shining = function() {
    $.shining.slides = {
      get length()      { return this._slides.length },
      get current()     { return (typeof this._current == 'undefined' ? this._slides[0] : this._slides[this._current]) },
      set current(_new) { return this._current = this._slides.indexOf(_new) },
      get all()         { return this._slides },
      get first()       { return this._slides[0] },
      get last()        { return this._slides[this._slides.length - 1] },
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
        $('#controls #first').    click(function() { $.shining.firstSlide() });
        $('#controls #previous'). click(function() { $.shining.previousSlide() });
        $('#controls #next').     click(function() { $.shining.nextSlide() });
        $('#controls #last').     click(function() { $.shining.lastSlide() });        
      });
      fetchSlides(function() { getSlide($.shining.slides.current) });
    }
    
    // helpers
    function slide(name)  { return 'slides/' + name }
    
    function fetchSlides(callback) {
      $.getJSON('slides.json', function(slides) {
        $.shining.slides.add(slides);
        callback.call();
      });
    }
    
    function getSlide(name) {
      if (!name) return false;
      $('#stage').load(
        slide(name).markup(),
        function(data) {
          $.shining.slides.current = name;
          if (data) $.get(slide(name).script(), function(script) { with($.shining.context) { eval(script) } });
        }
      );
    }
            
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