(function($) {
  $.shining = function() {
    $.shining.current = 0;
    
    String.prototype.markup = function() { return this + '.html' };
    String.prototype.script = function() { return this + '.js' };
    
    function page(number) {
      return 'pages/' + $.shining.pages[number];
    };
    
    $.extend($.shining, {
      firstSlide:     function() { getSlide(0) },
      nextSlide:      function() { getSlide($.shining.current++) },
      previousSlide:  function() { getSlide($.shining.current--) },
      page: page
    });
    
    function init() {
      fetchPages(function() { getSlide(0) });
    };
    
    function fetchPages(callback) {
      $.getJSON('pages.json', function(pages) {
        $.shining.pages = pages;
        callback.call();
      });
    };
    
    function getSlide(number) {
      $('#stage').load(page(number).markup());
      $.get(page(number).script(), function(script) { with($.shining.context) { eval(script) } });
    }
            
    init();
  };
  
  // gives page scripts a context for execution
  $.shining.context = $.noop;
  with ($.shining.context) {
    this.at =             function(seconds, method) { setTimeout(method, parseInt(seconds) * 1000) };
    this.nextSlide =      function() { $.shining.nextSlide(); };
    this.previousSlide =  function() { $.shining.previousSlide(); };
  }
  
  // boots!
  $.shining();
})(jQuery);