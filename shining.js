(function($) {
  $.shining = function() {
    var PENDING = '.fades-in-zoom';
    
    $.extend($.shining, {
      firstPage: function() { firstPage() },
      runPending: function() { runPending() }
    })
    
    function init() {
      fetchPages(function() { firstPage() });
    };
    
    function fetchPages(callback) {
      $.getJSON('pages.json', function(pages) {
        $.shining.pages = pages;
        callback();
      });
    };
        
    function firstPage() {
      $('#stage').load(pagePath($.shining.pages.intro), function() {
        $(PENDING).addClass('done');
      });
    };
    
    function pagePath(page) {
      return 'pages/' + page;
    }
    
    init();
  };
  $.shining();
})(jQuery);