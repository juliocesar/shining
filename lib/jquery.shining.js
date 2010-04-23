(function($) {
  $.shining = function() {
    $.shining.slides = {
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
      next:     function() {
        window.sli = this._slides;
        return this._slides[ this._slides.indexOf(this.current()) + 1 ]
      },
      previous: function() {
        var previous = this._slides[ this._slides.indexOf(this.current()) - 1 ];
        return previous ? previous : this.first();
      },
      add:      function(slides)  { return Array.prototype.push.apply(this._slides, slides) },
      loaded:   function(name)    { return !!$.shining.slides._loaded[name] },
      _slides: [],
      _loaded: {},
      _current: 0
    };

    function applyTransition(enter, leave) {
      switch($.shining.config.transitions) {
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

    String.prototype.markup = function() { return this + '.html' };
    String.prototype.script = function() { return this + '.js' };
    String.prototype.style  = function() { return this + '.css' };

    var KEY = { SPACE: 32, RIGHT: 39, LEFT: 37 };

    $.fn.effect = function(name) { return this.each(function() { applyEffect(this, name) }); };
    $.fn.hasClasses = function(classes) {
      var classes = classes.split(/\s+/), yes = true, element = this.get(0);
      for (var i = 0; i < classes.length && yes; i++) { yes = $(element).hasClass(classes[i]) }
      return yes;
    }

    $.extend($.shining, {
      firstSlide:     function() { getSlide($.shining.slides.first()) },
      lastSlide:      function() { getSlide($.shining.slides.last() ) },
      nextSlide:      function() {
        if ($.shining.slides.next()) {
          document.location.hash = $.shining.slides.next();
          trigger('next');
        }
      },
      previousSlide:  function() {
        if ($.shining.slides.previous()) {
          document.location.hash = $.shining.slides.previous();
          trigger('previous');
        }
      },
      getSlide:       function(slide) { getSlide(slide) },
      help: help
    });

    var FILTERS = {
      // reads: "fades-out" can be achieved by removing "fades-in" if the element hasClass "transparent"
      'fades-out': { remove: 'fades-in', when: 'fades-in transparent' }
    }

    function init() {
      $(document).ready(function() {
        $(window).resize(function() { $('#stage').centralize() });
        $('#stage').centralize();
        bindKeys();
        loadConfig(function() {
          var startAt = document.location.hash.replace('#', ''),
            first = startAt ? startAt : $.shining.slides.current();
          loadSlide(first, function() { playSlide(first) });
          if (!local() && !($.shining.config.help == false)) preloadSlides();
          setTitle($.shining.config.title);
          setTheme($.shining.config.theme);
          trigger('init.shining');
          help('← (previous slide), → or SPACE BAR (next slide)', 3000);
        });
      });
    }

    function trigger(event, data) {
      $(document).trigger(event + '.shining', data);
    }

    function bind(event, method) {
      $(document).bind(event + '.shining', method);
    }

    function applyEffect(element, name) {
      if (name in FILTERS) {
        if ($(element).hasClasses(FILTERS[name].when)) $(element).removeClass(FILTERS[name].remove)
      } else {
        $(element).addClass(name);
      }
    }

    function getSlide(name) {
      if (!name) return false;
      applyTransition(
        function() { loadSlide(name, function() { playSlide(name) }) },
        function() {
          $.shining.scripts.run($.shining.slides._loaded[$.shining.slides.current()].script)
        }
      )
    }

    function setTitle(title) {
      if (!title || title == '') return false;
      $.browser.msie ? document.title = title : $('title').text(title);
    }

    function setTheme(name) {
      if (!name || name == "default") { return false };
      var path = $('link.theme').attr('href').replace('default.css', name + 'css');
      return $('link.theme').attr('href', path);
    }

    function slide(name) {
      return 'slides/' + name;
    }

    function loadSlide(name, afterLoad) {
      if (!$.shining.slides.loaded(name)) {
        $.get(
          slide(name).markup(),
          function(data) {
            $.shining.slides._loaded[name] = {};
            $.shining.slides._loaded[name].markup = data;
            if (data) {
              loadSlideScript(name, afterLoad);
              loadSlideStyle(name);
            }
          }
        );
      } else {
        if ($.isFunction(afterLoad)) afterLoad.call();
        loadSlideStyle(name);
      }
    }

    function preloadSlides() {
      $($.shining.config.slides).each(function() {
        loadSlide(this);
      })
    }

    function playSlide(name) {
      var slide = $.shining.slides._loaded[name];
      $('#stage .contents').html(slide.markup);
      $.shining.scripts.run(slide.script);
    }

    function loadSlideScript(name, afterLoad) {
      $.ajax({
        url: slide(name).script(),
        type: 'GET',
        success: function(script) {
          $.shining.slides._loaded[name].script = script;
        },
        complete: function() {
          if ($.isFunction(afterLoad)) afterLoad.call();
        }
      })
    }

    function loadSlideStyle(name) {
      $('link.slide').remove();
      $('head').append('<link rel="stylesheet" type="text/css" href="' + slide(name).style() + '" media="all" class="slide"/>')
    }

    function loadConfig(callback) {
      $.getJSON('config.json', function(config) {
        $.shining.config = config;
        $.shining.slides.add(config.slides);
        callback.call();
      });
    }

    function bindKeys() {
      $(document).keydown(function(event) {
        switch(event.keyCode) {
          case KEY.RIGHT:
          case KEY.SPACE:
            $.shining.nextSlide();
            break;
          case KEY.LEFT:
            $.shining.previousSlide();
            break;
        }
      })
    }

    function help(message, duration) {
      if ($.shining.config.help == false) return false;
      var duration = duration || 500;
      $('#help').remove();
      $('<div id="help"></div>')
        .html(message)
        .css({display: 'inline-block'})
        .appendTo('body')
        .animate({opacity: 1})
        .delay(duration)
        .fadeOut(200, function() { $('#help').remove() })
    }

    function local() {
      document.location.protocol == 'file:'
    }

    $.shining.scripts = {
      LINE: /^(\d[.\d]*),[\s]*(.*)/,
      parsed: [], processes: [],
      nextSlide:      function() { $.shining.nextSlide() },
      previousSlide:  function() { $.shining.previousSlide() },
      at:             function(seconds, method) {
        $.shining.scripts.processes.push(setTimeout(method, parseFloat(seconds) * 1000))
      },
      parse:          function(script) {
        var lines = script.split("\n"), tokens, parsed = [];
        for (var i = 0; lines.length > i; i++) {
          if ($.shining.scripts.LINE.test(lines[i])) {
            var tokens = lines[i].match($.shining.scripts.LINE);
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
        var parsed = $.shining.scripts.parse(script), all = [];
        for (var i = 0; parsed.length > i; i += 2) {
          all.push(["at(", parsed[i], ", function() { ", parsed[i+1], " })"].join(''));
        }
        with($.shining.scripts) { eval(all.join(';')) };
      },
      reap: function() {
        $($.shining.scripts.processes).each(function() { clearTimeout(this) });
        return $.shining.scripts.processes = [];
      }
    }

    bind('previous',  function() { help('←') });
    bind('next',      function() { help('→') });

    init();
  }
  // boots!
  $.shining();
})(jQuery);

// Dependencies!!

/*
 * JSizes - JQuery plugin v0.33
 *
 * Licensed under the revised BSD License.
 * Copyright 2008-2010 Bram Stein
 * All rights reserved.
 */
(function(b){var a=function(c){return parseInt(c,10)||0};b.each(["min","max"],function(d,c){b.fn[c+"Size"]=function(g){var f,e;if(g){if(g.width!==undefined){this.css(c+"-width",g.width)}if(g.height!==undefined){this.css(c+"-height",g.height)}return this}else{f=this.css(c+"-width");e=this.css(c+"-height");return{width:(c==="max"&&(f===undefined||f==="none"||a(f)===-1)&&Number.MAX_VALUE)||a(f),height:(c==="max"&&(e===undefined||e==="none"||a(e)===-1)&&Number.MAX_VALUE)||a(e)}}}});b.fn.isVisible=function(){return this.is(":visible")};b.each(["border","margin","padding"],function(d,c){b.fn[c]=function(e){if(e){if(e.top!==undefined){this.css(c+"-top"+(c==="border"?"-width":""),e.top)}if(e.bottom!==undefined){this.css(c+"-bottom"+(c==="border"?"-width":""),e.bottom)}if(e.left!==undefined){this.css(c+"-left"+(c==="border"?"-width":""),e.left)}if(e.right!==undefined){this.css(c+"-right"+(c==="border"?"-width":""),e.right)}return this}else{return{top:a(this.css(c+"-top"+(c==="border"?"-width":""))),bottom:a(this.css(c+"-bottom"+(c==="border"?"-width":""))),left:a(this.css(c+"-left"+(c==="border"?"-width":""))),right:a(this.css(c+"-right"+(c==="border"?"-width":"")))}}}})})(jQuery);

// centralizes an element vertically
(function($){$.fn.centralize=function(){var self=this.get(0);windowHeight=document.documentElement.clientHeight,elementHeight=(self.offsetHeight+$(self).padding().top+$(self).padding().bottom);$(self).css('position','relative').css('top',(windowHeight/2)-(elementHeight/2)+'px');};})(jQuery);

/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);

// IE Array.prototype.indexOf fix
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(elt,from){var len=this.length;var from=Number(arguments[1])||0;from=(from<0)?Math.ceil(from):Math.floor(from);if(from<0)from+=len;for(;from<len;from++){if(from in this&&this[from]===elt)return from;} return-1;};}

$(window).bind('hashchange', function(event) {
  var slide = document.location.hash.replace('#', '');
  if (slide) { $.shining.getSlide(slide) };
});
