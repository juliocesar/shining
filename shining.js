(function($) {
  $.shining = function() {
    
    String.prototype.markup = function() { return this + '.html' };
    String.prototype.script = function() { return this + '.js' };
    
    function page(number) {
      return 'pages/' + $.shining.pages[number];
    };
    
    $.extend($.shining, {
      firstPage: function() { firstPage() },
      page: page
    });
    
    function init() {
      fetchPages(function() { getPage(0) });
    };
    
    function fetchPages(callback) {
      $.getJSON('pages.json', function(pages) {
        $.shining.pages = pages;
        callback.call();
      });
    };
    
    function getPage(number) {
      $('#stage').load(page(number).markup());
      $.getScript(page(number).script());
    }
            
    init();
  };
  $.shining();
})(jQuery);