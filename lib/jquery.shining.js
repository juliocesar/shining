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
      next:     function() { return this._slides[ this._slides.indexOf(this.current()) + 1 ] },
      previous: function() { return this._slides[ this._slides.indexOf(this.current()) - 1 ] },
      add:      function(slides) { return Array.prototype.push.apply(this._slides, slides) },
      _slides: [],
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

    $.fn.effect = function(name) { return this.each(function() { applyEffect(this, name) }); }
    $.fn.hasClasses = function(classes) {
      var classes = classes.split(/\s+/), yes = true, element = this.get(0);
      for (var i = 0; i < classes.length && yes; i++) { yes = $(element).hasClass(classes[i]) }
      return yes;
    }

    $.extend($.shining, {
      firstSlide:     function() { getSlide($.shining.slides.first()) },
      lastSlide:      function() { getSlide($.shining.slides.last() ) },
      nextSlide:      function() { getSlide($.shining.slides.next()) },
      previousSlide:  function() { getSlide($.shining.slides.previous()) },
      getSlide:       function(slide) { getSlide(slide) }
    });

    var FILTERS = {
      // reads: "fades-out" can be achieved by removing "fades-in" if the element hasClass "transparent"
      'fades-out': { remove: 'fades-in', when: 'fades-in transparent' }
    }

    function init() {
      $(document).ready(function() {
        $('#controls').ondistance(
          300,
          function(controls) { $(controls).effect('fades-in') },
          function(controls) { $(controls).effect('fades-out') }
        );
        $('#stage').centralize();
      });
      $(window).resize(function() { $('#stage').centralize() });
      loadConfig(function() {
        var startAt = document.location.hash.replace('#', '');
        loadSlide(startAt ? startAt : $.shining.slides.current(), true);
        setTitle($.shining.config.title);
        setTheme($.shining.config.theme);
        parseEffects();
        updateControlAnchors();
      });
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
        function() { loadSlide(name) },
        function() {
          $.shining.scripts.run($.shining.currentScript) 
        }
      )
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

    function loadSlide(name, runScript) {
      $('#stage .contents').load(
        slide(name).markup(),
        function(data) {
          $.shining.slides.current(name);
          $('link.slide').remove(); // remove now previous slide styles
          if (SyntaxHighlighter) SyntaxHighlighter.highlight();
          $('#stage').centralize();
          $.shining.scripts.reap();
          updateControlAnchors();
          if (data) {
            loadSlideScript(name, runScript);
            loadSlideStyle(name);
          }
        }
      );
    }

    function loadSlideScript(name, run) {
      $.get(slide(name).script(), function(script) {
        $.shining.currentScript = script;
        if (run) $.shining.scripts.run($.shining.currentScript);
      })
    }

    function loadSlideStyle(name) {
      $('head').append('<link rel="stylesheet" type="text/css" href="' + slide(name).style() + '" media="all" class="slide"/>')
    }

    function loadConfig(callback) {
      $.getJSON('config.json', function(config) {
        $.shining.config = config;
        $.shining.slides.add(config.slides);
        callback.call();
      });
    }

    function parseEffects() {
      $.get($('link[href$=effects.css]').attr('href'),
        function(css) { $.shining.effects = $.parseCSS(css) }
      );
    }

    function updateControlAnchors() {
      $('#controls #first').    attr('href', '#' + $.shining.slides.first());
      $('#controls #previous'). attr('href', ($.shining.slides.previous() ? '#' + $.shining.slides.previous() : ''));
      $('#controls #next').     attr('href', ($.shining.slides.next() ? '#' + $.shining.slides.next() : ''));
      $('#controls #last').     attr('href', '#' + $.shining.slides.first());
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
        $($.shining.scripts.processes).each(function() { clearTimeout(this) });
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

// Trimmed down/modified version of the original Javascript/jQuery CSS parser
// by Danny.
// http://bililite.com/blog/2009/01/16/jquery-css-parser/
(function($){$.parseCSS=function(str){var ret={};str=munge(str).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g,function(s,rule){return'';});$.each(str.split('`b%'),function(i,css){css=css.split('%b`');if(css.length<2)return;css[0]=restore(css[0]);ret[css[0]]=$.extend(ret[css[0]]||{},parsedeclarations(css[1]));});return ret;};$.parseCSS.mediumApplies=(window.media&&window.media.query)||function(str){if(!str)return true;if(str in media)return media[str];var style=$('<style media="'+str+'">body {position: relative; z-index: 1;}</style>').appendTo('head');return media[str]=[$('body').css('z-index')==1,style.remove()][0];};$.parseCSS.parseArguments=function(str){if(!str)return[];var ret=[],mungedArguments=munge(str,true).split(/\s+/);for(var i=0;i<mungedArguments.length;++i){var a=restore(mungedArguments[i]);try{ret.push(eval('('+a+')'));}catch(err){ret.push(a);}}
return ret;};var media={};var munged={};function parsedeclarations(index){var str=munged[index].replace(/^{|}$/g,'');str=munge(str);var parsed={};$.each(str.split(';'),function(i,decl){decl=decl.split(':');if(decl.length<2)return;parsed[restore(decl[0])]=restore(decl[1]);});return parsed;}
var REbraces=/{[^{}]*}/,REfull=/\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/,REatcomment=/\/\*@((?:[^\*]|\*[^\/])*)\*\//g,REcomment_string=/(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g,REmunged=/%\w`(\d+)`\w%/,uid=0;function munge(str,full){str=str.replace(REatcomment,'$1').replace(REcomment_string,function(s,string){if(!string)return'';var replacement='%s`'+(++uid)+'`s%';munged[uid]=string.replace(/^\\/,'');return replacement;});var RE=full?REfull:REbraces;while(match=RE.exec(str)){replacement='%b`'+(++uid)+'`b%';munged[uid]=match[0];str=str.replace(RE,replacement);}
return str;}
function restore(str){if(str===undefined)return str;while(match=REmunged.exec(str)){str=str.replace(REmunged,munged[match[1]]);}
return $.trim(str);}
var RESGMLcomment=/<!--([^-]|-[^-])*-->/g;var REnotATag=/(>)[^<]*/g;var REtag=/<(\w+)([^>]*)>/g;})(jQuery);

/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);

$(window).bind('hashchange', function(event) {
  var slide = document.location.hash.replace('#', '');
  if (slide) { $.shining.getSlide(slide) };
});