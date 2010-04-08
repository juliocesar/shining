describe 'Shining'
  before_each
    window.$ = jQuery;
    $.fn.offset = function() { return 0 };
    var hidden = $('<div></div>').css({height: 0, width: 0, opacity: 0, marginLeft: -10000}).appendTo('body');
    var stage = $($(fixture('index.html')).get(0)),
      controls = $($(fixture('index.html')).get(2));
    hidden.append(stage).append(controls);
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
      $.shining.config.constructor.should.be Object
    end
  end
  
  describe 'navigating slides'
  
  end
end