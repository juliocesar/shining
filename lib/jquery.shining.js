(function($) {
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
    String.prototype.style =  function() { return this + '.css' };    

    $.extend($.shining, {
      firstSlide:     function() { getSlide($.shining.slides.first) },
      lastSlide:      function() { getSlide($.shining.slides.last ) },
      nextSlide:      function() { getSlide($.shining.slides.next) },
      previousSlide:  function() { getSlide($.shining.slides.previous) }
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
      $(document).click(function(event) {
        if ($(event.target).is('a')) return false;
        if (event.pageX < ($(window).width() / 2)) {
          $.shining.previousSlide();
        } else {
          $.shining.nextSlide();
        }
      })
      loadConfig(function() { 
        getSlide($.shining.slides.current);
        setTitle($.shining.config.title);
        setTheme($.shining.config.theme);
      });
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
                $.shining.scripts.run($.shining.currentScript);
              },
            200);
          }, 200);
      } else {
        loadSlide(name);
      }
    }
    
    function setTitle(title) {
      if (!title) { return false };
      $('title').text(title);
    }
    
    function setTheme(name) {
      if (!name || name == "default") { return false };
      var path = $('link.theme').attr('href').replace('default.css', name + 'css');
      return $('link.theme').attr('href', path);
    }

    // private
    function slide(name) {
      return 'slides/' + name;
    }
    
    function vendored() {
      return $('script:first').attr('src').match(/^vendor/);
    }
    
    function loadSlide(name) {
      $('#stage').load(
        slide(name).markup(),
        function(data) {
          $.shining.slides.current = name;
          $('link.slide').remove(); // remove now previous slide styles
          if (SyntaxHighlighter) SyntaxHighlighter.highlight();
          $('#stage').centralize();
          $.shining.scripts.reap();
          if (data) {
            loadSlideScript(name);
            loadSlideStyle(name);
          }
        }
      );
    }
    
    function loadSlideScript(name) {
      $.get(slide(name).script(), function(script) {
        if ($.shining.config.transitions) {
          $.shining.currentScript = script;
        } else {
          $.shining.scripts.run(script)
        }      
      })
    }
    
    function loadSlideStyle(name) {
      $('head').append('<link rel="stylesheet" type="text/css" href="' + slide(name).style() + '" media="all" class="slide"/>')
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
        var parsed = $.shining.scripts.parse(script), all = [];
        for (var i = 0; parsed.length > i; i += 2) {
          all.push(["at(", parsed[i], ", function() { ", parsed[i+1], " })"].join(''));
        }
        with($.shining.scripts) { eval(all.join(';')) }; 
      },
      reap: function() {
        $($.shining.scripts.processes).map(function() { clearTimeout(this) });
        return $.shining.scripts.processes = [];
      }
    }
    
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

// http://github.com/juliocesar/jquery-ondistance
(function($){$.fn.ondistance=function(specified,close,far){var elt=this.get(0),last=new Date().getTime();$(document).mousemove(function(e){var current=new Date().getTime();if(current-last<500)return;var offset=$(elt).offset(),center={x:offset.left+($(elt).width()/2),y:offset.top+($(elt).height()/2)},last=current,distance=parseInt(Math.sqrt(Math.pow(e.pageX-center.x,2)+Math.pow(e.pageY-center.y,2)));if(specified>=distance){if($(elt).data('mouseclose')==true)return false;$(elt).data('mouseclose',true);close(elt);}else{if($(elt).data('mouseclose')==false)return false;$(elt).data('mouseclose',false);far(elt);}})}})(jQuery);

// centralizes an element vertically
(function($){$.fn.centralize=function(){var self=this.get(0);windowHeight=document.documentElement.clientHeight,elementHeight=(self.offsetHeight+$(self).padding().top+$(self).padding().bottom);$(self).css('position','relative').css('top',(windowHeight/2)-(elementHeight/2)+'px');};})(jQuery);