// Shining - http://shining.heroku.com
// Copyright (c) 2010 Julio Cesar Ody - See LICENSE.txt 

(function($) {
  var KEY = { SPACE: 32, RIGHT: 39, LEFT: 37 };

  // jQuery extensions
  $.fn.hasClasses = function(classes) {
    var classes = classes.split(/\s+/), yes = true, element = this.get(0);
    for (var i = 0; i < classes.length && yes; i++) { yes = $(element).hasClass(classes[i]) }
    return yes;
  };
  $.throttle = function(method, interval) {
    if (!$.throttle.throttling) $.throttle.throttling = {};
    var now = new Date().getTime();
    if (!(method.toString() in $.throttle.throttling)) {
      $.throttle.throttling[method.toString()] = { interval: interval, last: now };
      return method();
    } else {
      var throttled = $.throttle.throttling[method.toString()];
      if (now - throttled.last < throttled.interval) {
        return false;
      } else {
        $.throttle.throttling[method.toString()].last = now;
        return method();
      }
    }
  };

  Shining = {
    // slides
    slides: {
      length:   function() { return this._slides.length },
      current:  function() {
        if (arguments.length) {
          this._current = this._slides.indexOf(arguments[0]);
          return this.current();
        } else {
          return (typeof this._current == 'undefined' ? this._slides[0] : this._slides[this._current]);
        }
      },
      all:      function() { return this._slides },
      first:    function() { return this._slides[0] },
      last:     function() { return this._slides[ this._slides.length - 1 ] },
      next:     function() { return this._slides[ this._slides.indexOf(this.current()) + 1 ] },
      previous: function() {
        var previous = this._slides[ this._slides.indexOf(this.current()) - 1 ];
        return previous ? previous : this.first();
      },
      add:      function(slides)  { return Array.prototype.push.apply(this._slides, slides) },
      loaded:   function(name)    { return !!Shining.slides._loaded[name] },
      _slides: [],
      _loaded: {},
      _current: 0
    },

    // public methods
    firstSlide:     function() { getSlide(Shining.slides.first()) },
    lastSlide:      function() { getSlide(Shining.slides.last() ) },
    nextSlide:      function() { trigger('next') },
    previousSlide:  function() { trigger('previous') },
    getSlide:       function(slide) { getSlide(slide) },
    help:     help,
    init:     init,
    when:     when,
    trigger:  trigger,
    
    // slide scripts
    scripts: {
      LINE: /^(\d[.\d]*),[\s]*(.*)/, parsed: [], processes: [],
      nextSlide:      function() { Shining.nextSlide() },
      previousSlide:  function() { Shining.previousSlide() },
      at:             function(seconds, method) {
        Shining.scripts.processes.push(setTimeout(method, parseFloat(seconds) * 1000))
      },
      parse:          function(script) {
        var lines = script.split("\n"), tokens, parsed = [];
        for (var i = 0; lines.length > i; i++) {
          if (Shining.scripts.LINE.test(lines[i])) {
            var tokens = lines[i].match(Shining.scripts.LINE);
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
      run:          function(script) {
        if (typeof script == 'undefined' || script == '') return false;
        var parsed = Shining.scripts.parse(script), all = [];
        for (var i = 0; parsed.length > i; i += 2) {
          all.push(["at(", parsed[i], ", function() { ", parsed[i+1], " })"].join(''));
        }
        with(Shining.scripts) { eval(all.join(';')) };
      },
      reap: function() {
        $(Shining.scripts.processes).each(function() { clearTimeout(this) });
        return Shining.scripts.processes = [];
      }
    }
  };

  function applyTransition(enter, leave) {
    switch(Shining.config.transitions) {
      case 'fade':
        $('#stage').fadeOut(200, function() {
          enter.call();
          $('#stage').fadeIn(200, function() {
            leave.call();
          })
        })
        break;
      case 'slide':
        $('#stage').animate(
          { opacity: 0, marginLeft: '-200' },
          200,
          function() {
            enter.call();
            $('#stage')
              .css({ marginLeft: null, marginRight: '-200px' })
              .animate({ opacity: 1, marginRight: '0' }, 200, function() {
                leave.call();
              })
          }
        );
        break;
      case 'slice':
        var width = $('#stage').width() / 10;
        for (var i = 0; i <= 10; i++) {
          $('#stage').append(
            $('<div class="slice"></div>').css({
              backgroundColor: $('body').css('background-color'),
              left: (i * width) - 10
            }).delay(i * 50).animate({width: width + 1})
          );
        }
        setTimeout(enter, 900);
        var reversed = Array.prototype.reverse.call($('#stage .slice'));
        for (var i = 0; i < reversed.length; i++) {
          $(reversed[i]).delay(i * 50).animate({width: '0'})
        }
        setTimeout(leave, 4200);
        break;
      default:
        enter();
        setTimeout(leave, 200);
        break;
    }
  }

  // For the "slice" transition
  function slice() {
    var width = $('#stage').width() / 10;
    for (var i = 0; i <= 10; i++) {
      $('#stage').append(
        $('<div class="slice"></div>').css({
          backgroundColor: $('body').css('background-color'),
          left: (i * width) - 10
        }).delay(i * 100).animate({width: width + 1})
      );
    }
  }

  function unslice() {
    var reversed = Array.prototype.reverse.call($('#stage .slice'));
    for (var i = 0; i < reversed.length; i++) {
      $(reversed[i]).delay(i * 100).animate({width: '0'})
    }
  }

  function help(message, duration, force) {
    if (Shining.config.help == false && force != true) return false;
    var duration = duration || 500;
    $('#help').remove();
    $('<div id="help"></div>')
      .html(message)
      .appendTo('body')
      .animate({opacity: 1})
      .delay(duration)
      .fadeOut(200, function() { $('#help').remove() })
  }

  function init() {
    $(window).resize(function() { centerStage() });
    $(document).ready(function() {
      bindKeys();
      bindEvents();
      $(window).bind('hashchange', function(event) {
        var slide = document.location.hash.replace('#', '');
        if (slide) { Shining.getSlide(slide) };
      });
      loadConfig(function() {
        loadPlugins();
        trigger('init');
        var startAt = document.location.hash.replace('#', ''),
          first = startAt ? startAt : Shining.slides.current();
        loadSlide(first, function() { playSlide(first); centerStage() });
        preloadSlides();
        setTitle(Shining.config.title);
        setTheme(Shining.config.theme);
        help('← (previous slide), → or SPACE BAR (next slide)', 3000);
      });
    });
  }

  function trigger(event, data) { $(document).trigger(event + '.shining', data) }
  function when(event, method)  { $(document).bind(event + '.shining', method) }

  function getSlide(name) {
    if (!name) return false;
    applyTransition(
      function() { playSlide(name)},
      $.noop
    )
  }

  function setTitle(title) {
    if (!title || title == '') return false;
    $.browser.msie ? document.title = title : $('title').text(title);
  }

  function setTheme(name) {
    if (!name || name == "default") { return false };
    var path = $('link.theme').attr('href').replace('default.css', name + '.css');
    return $('link.theme').attr('href', path);
  }

  function slidePath(name)    { return 'slides/' + name }
  function slideFormat(name)  {
    if (hasNoExtension(name)) return false;
    var format = name.substr(name.lastIndexOf('.') + 1, name.length).toLowerCase();
    return format;
  }
  
  function slidePlusExtension(name, extension) {
    return hasNoExtension(name) ? name + '.' + extension : name.substr(0, name.lastIndexOf('.')) + '.' + extension;
  }
    
  function hasNoExtension(name) { return !(/\.\w+$/.test(name)) }
  
  function compileSlide(name, data) {
    if (!slideFormat(name)) return false;
    switch(slideFormat(name)) {
      case 'haml':
        return Haml.render(data)
      case 'md':
      case 'markdown':
        return new Showdown.converter().makeHtml(data);
      default: // html
        return data;
    }
    return name;
  }

  function loadSlide(name, afterLoad) {
    if (!Shining.slides.loaded(name)) {
      $.get(
        slidePath(name),
        function(data) {
          Shining.slides._loaded[name] = {};
          Shining.slides._loaded[name].markup = compileSlide(name, data);
          trigger('slideloaded', [name]);
          if (data) { loadSlideScript(name, afterLoad) };
        }
      );
    } else {
      if ($.isFunction(afterLoad)) afterLoad.call();
    }
  }

  function preloadSlides() {
    $(Shining.config.slides).each(function() { loadSlide(this) })
  }

  function playSlide(name) {
    Shining.scripts.reap();
    var slide = Shining.slides._loaded[name];
    Shining.slides.current(name);
    $('#stage .contents').html(slide.markup);
    $('#stage img').each(function() { $(this).load(function() { centerStage() }) });
    trigger('slideplay', [name]);
    $(window).trigger('resize');
    Shining.scripts.run(slide.script);
  }

  function loadPlugins() {
    if (Shining.config.plugins && Shining.config.plugins.length) {
      $(Shining.config.plugins).each(function() {
        $('head').append('<script type="text/javascript" src="' + pluginPath(this) + '"></script>');
      })
    }
  }

  function pluginPath(name) { return 'vendor/lib/plugins/' + name + '.js' }

  function loadSlideScript(name, afterLoad) {
    $.ajax({
      url: slidePath(slidePlusExtension(name, 'js')),
      dataType: 'text',
      type: 'GET',
      success: function(script) { Shining.slides._loaded[name].script = script },
      complete: function()      { if ($.isFunction(afterLoad)) afterLoad.call() }
    })
  }

  function loadSlideStyle(name) {
    $('link.slide').remove();
    $('head').append('<link rel="stylesheet" type="text/css" href="' + slidePath(slidePlusExtension(name, 'css')) + '" media="all" class="slide"/>')
  }

  function loadConfig(callback) {
    $.getJSON('config.json', function(config) {
      Shining.config = config;
      Shining.slides.add(config.slides);
      callback.call();
    });
  }

  function bindKeys() {
    $(document).keydown(function(event) {
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
  }

  function bindEvents() {
    when('previous',  function() { 
      help('←');
      if (Shining.slides.previous()) { document.location.hash = Shining.slides.previous() }
    });
    when('next',      function() { 
      help('→');
      if ($('#stage .step:not(:visible)').length) {
        var step = $('#stage .step:not(:visible):first');
        step.show();
        trigger('step', [step])
      } else {
        if (Shining.slides.next()) { document.location.hash = Shining.slides.next() };
      }
    });
    when('slideplay', function() { loadSlideStyle(arguments[1]) });
  }
  
  function centerStage() {
    var top = ($(window).height() - $('#stage').outerHeight()) / 2;
    if (top < 0) top = 0;
  	$('#stage').css({ top: top });
  }

  Shining.init();
})(jQuery);
