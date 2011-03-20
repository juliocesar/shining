// Shining - http://shining.heroku.com
// Copyright (c) 2010 Julio Cesar Ody - See LICENSE.txt
(function($) {
  var KEY = { SPACE: 32, RIGHT: 39, LEFT: 37 };

  Shining = {
    // slides
    slides: {
      length:   function() { return this._slides.length; },
      current:  function() {
        if (arguments.length) {
          this._current = this._slides.indexOf(arguments[0]);
          return this.current();
        } else {
          return (typeof this._current == 'undefined' ? this._slides[0] : this._slides[this._current]);
        }
      },
      all:      function() { return this._slides; },
      first:    function() { return this._slides[0]; },
      last:     function() { return this._slides[ this._slides.length - 1 ]; },
      next:     function() { return this._slides[ this._slides.indexOf(this.current()) + 1 ]; },
      previous: function() {
        var previous = this._slides[ this._slides.indexOf(this.current()) - 1 ];
        return previous;
      },
      add:      function(slides)  { return Array.prototype.push.apply(this._slides, slides); },
      loaded:   function(name)    { return !!Shining.slides._loaded[name]; },
      totalLoaded: function() { var len = 0; for (var i in this._loaded) len++; return len; },
      _slides: [],
      _loaded: {},
      _current: 0
    },

    // public methods
    firstSlide:     function() { playSlide(Shining.slides.first()); },
    lastSlide:      function() { playSlide(Shining.slides.last()); },
    nextSlide:      function() { 
      if (!Shining.slides.next()) return false;
      $('.current:first').next().addClass('current');
      $('.previous').removeClass('previous');  
      $('.current:first').addClass('previous').removeClass('current');
      $('.next').removeClass('next');    
      trigger('nextslide'); 
    },
    previousSlide:  function() { 
      if (!Shining.slides.previous()) return false;      
      $('body .slide.current:first').addClass('next').removeClass('current');
      $('body .slide.previous').addClass('current').removeClass('previous');
      trigger('previousslide'); 
    },
    setTheme:       setTheme,
    playSlide:      playSlide,
    help:     help,
    note:     note,
    when:     when,
    trigger:  trigger,
    pluginProcesses: {},
    centerSlide: centerSlide,

    // slide scripts
    scripts: {
      LINE: /^(\d[.\d]*),[\s]*(.*)/, parsed: [], processes: [],
      nextSlide: function() { Shining.nextSlide(); },
      previousSlide: function() { Shining.previousSlide(); },
      at: function(seconds, method) {
        Shining.scripts.processes.push(setTimeout(method, parseFloat(seconds) * 1000));
      },
      parse: function(script) {
        var lines = script.split("\n"), tokens, parsed = [];
        for (var i = 0; lines.length > i; i++) {
          if (Shining.scripts.LINE.test(lines[i])) {
            tokens = lines[i].match(Shining.scripts.LINE);
            var time = tokens[1], code = tokens[2];
            parsed.push(time);
            if (code.length) parsed.push(code);
          } else {
            if (isNaN(parsed[parsed.length - 1])) {
              parsed[parsed.length - 1] += ("; " + lines[i]);
            } else {
              parsed.push(lines[i]);
            }
          }
        }
        return parsed;
      },
      runSlide: function(name) {
        var script = Shining.slides._loaded[name].script;
        this.run(script);
      },
      run: function(script) {
        if (typeof script == 'undefined' || script == '') return false;
        var parsed = Shining.scripts.parse(script), all = [];
        for (var i = 0; parsed.length > i; i += 2) {
          all.push(["at(", parsed[i], ", function() { ", parsed[i+1], " })"].join(''));
        }
        with(Shining.scripts) { eval(all.join(';')); };
      },
      reap: function() {
        $(Shining.scripts.processes).each(function() { clearTimeout(this); });
        return Shining.scripts.processes = [];
      }
    }
  };

  function help(message, duration, force) {
    if (Shining.config.help == false && force != true) return false;
    $('#help').remove();
    return $('<div id="help"></div>')
      .html(message)
      .appendTo('body')
      .animate({opacity: 1})
      .delay(duration || 500)
      .fadeOut(200, function() { $('#help').remove(); });
  }

  function note(message, duration) {
    if (message == false) return $('#note').dequeue();
    $('#note').remove();
    return $('<aside id="note"></div>')
      .html(message)
      .appendTo('body')
      .animate({marginBottom: 0, opacity: 'toggle'})
      .delay(parseInt(duration, 10) || 500)
      .animate({marginBottom: 10, opacity: 'toggle'});
  }

  function trigger(name, data)  { $(document).trigger(name + '.shining', data); }
  function when(name, method)   { $(document).bind(name + '.shining', method); }

  function setTitle(title) {
    if (!title || title == '') return false;
    return $.browser.msie ? document.title = title : $('title').text(title);
  }

  function setTheme(name) {
    if (!name || name == "") { name = "default" };
    if ($('link.theme').length) {
       $('link.theme').attr('href', "vendor/themes/" + name + ".css");
    } else {
      $('head').append('<link rel="stylesheet" href="vendor/themes/' + name + '.css" class="theme"/>');
    }
  }

  function slideFormat(name)  {
    if (hasNoExtension(name)) return false;
    return name.substr(name.lastIndexOf('.') + 1, name.length).toLowerCase();
  }

  function slidePlusExtension(name, extension) {
    return hasNoExtension(name) ? name + '.' + extension : name.substr(0, name.lastIndexOf('.')) + '.' + extension;
  }

  function hasNoExtension(name) { return !(/\.\w+$/.test(name)); }

  function compileSlide(name, data) {
    if (!slideFormat(name)) return false;
    switch(slideFormat(name)) {
      case 'md':
      case 'markdown':
        return new Showdown.converter().makeHtml(data);
      default: // html
        return data;
    }
    return name;
  }

  function loadSlides(callback) {
    $.getJSON(
      '/slides.json',
      function(slides) {
        Shining.slides._loaded = slides;
        for (slide in slides) {
          slides[slide].markup = compileSlide(slide, slides[slide].markup);
        };
        trigger('slidesloaded');
        if ($.isFunction(callback)) callback();
      }
    );
  }

  function playSlide(name) {
    $('#' + name.split('.').join(''))
      .addClass('current')
        .prev().addClass('previous').end()
        .next().addClass('next');
    Shining.slides.current(name);
    trigger('slideplay', [name]);
  }

  function loadPlugins() {
    if (Shining.config.plugins && Shining.config.plugins.length) {
      $(Shining.config.plugins).each(function() {
        $('head').append('<script type="text/javascript" src="vendor/lib/plugins/' + this + '.js"></script>');
      });
    }
  }

  function loadSlideStyle(name) {
    $('link.slide').remove();
    $('head').append('<link rel="stylesheet" type="text/css" href="slides/' + slidePlusExtension(name, 'css') + '" media="all" class="slide"/>')
  }

  function loadConfig(callback) {
    $.getJSON('config.json', function(config) {
      Shining.config = config;
      Shining.slides.add(config.slides);
      callback.call();
    });
  }

  function centerSlide() {
    var top = ($(window).height() - $('div.slide.current').outerHeight()) / 2;
    if (top < 0) top = 0;
    $('div.slide').css({ top: top });
  }

  function hasPendingStep() {
    return !!$('div.slide .step:not(:visible)').length;
  }

  function runPendingStep() {
    $('div.slide .step:not(:visible):first').show();
  }

  // Now configure everything!
  when('previousslide', function() {
    if (Shining.slides.previous()) {
      help('←');
      document.location.hash = Shining.slides.previous();
    }
  });

  when('nextslide', function() {
    help('→');
    if (hasPendingStep()) {
      runPendingStep();
    } else {
      if (Shining.slides.next()) document.location.hash = Shining.slides.next();
    }
  });

  when('slideplay', function(event, name) {
    note(false);
    $(window).trigger('resize');
    $(window).trigger('resize'); // until I figure out why once won't do
    loadSlideStyle(name);
    Shining.scripts.runSlide(name);
    if (SyntaxHighlighter) SyntaxHighlighter.highlight({gutter: false, toolbar: false});
    if ($('body aside').length) setTimeout(function() { note($('body aside').html(), 5000); }, 500);
  });

  when('slidesloaded', function() {
    help('← (previous slide), → or SPACE BAR (next slide)', 3000);
  });

  when('slidesloaded', function() {
    $(Shining.config.slides).each(function(i) {
      var slide = $('<div class="slide" id="' + this.split('.').join('') + '">' +
        Shining.slides._loaded[this].markup +
      '</div>');
      $('body').append(slide);
    });
  });

  $(window)
    .resize(function() { centerSlide(); })
    .bind('hashchange', function() {
      var slide = document.location.hash.replace('#', '');
      if (slide) Shining.playSlide(slide);
    });

  $(document)
    .keydown(function(event) {
      switch(event.keyCode) {
        case KEY.RIGHT:
        case KEY.SPACE:
          Shining.nextSlide();
          break;
        case KEY.LEFT:
          Shining.previousSlide();
          break;
      }
    })
    .ready(function() {
      loadConfig(function() {
        loadPlugins();
        var startAt = document.location.hash.replace('#', ''), first = startAt || Shining.slides.current();
        loadSlides(function() { playSlide(first); });
        setTitle(Shining.config.title);
        setTheme(Shining.config.theme);
      });
    });
})(jQuery);
