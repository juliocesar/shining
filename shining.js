(function($) {
  $.shining = function() {
    
    $.extend($.shining, {
      firstPage: function() { firstPage() }
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
      $.get(pagePath($.shining.pages.intro), function(page) {
        $('#stage').append(page);
      });
    };
    
    function pagePath(page) {
      return 'pages/' + page;
    }
    
    init();
  };
  $.shining();
})(jQuery);

