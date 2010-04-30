describe 'Shining'
  before_each
    window.$ = jQuery;
    $.fn.offset = function() { return 0 }
    $.fn.centralize = function() { return false }
    if (!$('#hidden').length) {
      var hidden = $('<div id="hidden"></div>').css({height: 0, width: 0, opacity: 0, marginLeft: -10000}).appendTo('body');
      var stage = $($(fixture('index.html')).get(0)),
        controls = $($(fixture('index.html')).get(2));
      hidden.append(stage).append(controls);      
    }
  end
  
  describe "structurally speaking"  
    it 'should have a stage'
      $('#stage').length.should.be 1
    end
  
    it 'should have navigation controls'
      $('#controls').length.should.be 1
    end
  end
  
  describe "config file"
    it 'gets read when shining gets loaded'
      Shining.config.constructor.should.be Object
    end
  end
  
  describe "slides"
    it '#current() returns the first slide by default'
      Shining.slides.current().should.be 'welcome'
    end  
    
    it '#current("slide1") sets the current slide to "slide1"'
      Shining.slides.current('slide1')
      Shining.slides.current().should.be 'slide1'
    end
    
    it "#last() returns the last slide in the slides array"
      Shining.slides.last().should.be 'slide2'
    end
  end
  
  describe 'navigating slides'
    it 'navigates to slide1 on Shining.nextSlide()'
      Shining.slides.current('welcome')
      mockRequest().and_return('<h1>Slide1</h1>');    
      Shining.nextSlide();
      $('#stage .contents h1').text().should.be 'Slide1'
    end
    
    it 'navigates to slide2 on Shining.nextSlide()'
      mockRequest().and_return('<h1>Slide2</h1>');
      Shining.nextSlide();
      $('#stage .contents h1').text().should.be 'Slide2'
    end    
  end
end