require File.join(File.dirname(__FILE__), 'spec_helper')

describe 'Shining' do  
  before do
    Dir.chdir File.join(Shining.root, *%w(spec sample))
    @page = Harmony::Page.fetch("file:////#{Shining.root}/spec/sample/index.html")
  end
  
  it "has a stage" do
    @page.execute_js("$('#stage').is(':visible')").should == true
  end
  
  it "has navigation controls" do
    @page.execute_js("$('#controls').length").should == 1
  end
  
  describe ".slides" do
    it ".current should return the first slide by default" do
      @page.execute_js("$.shining.slides.current").should == 'first'
    end
    
    it ".length returns 3 for when there's 3 slides" do
      @page.execute_js("$.shining.slides.length").should == 3
    end
    
    it ".current= sets the current slide, returning it's name" do
      @page.execute_js("$.shining.slides.current = 'second'").should == 'second'
      @page.execute_js("$.shining.slides._current").should == 1
    end    
    
    it ".current returns undefined if set to an unexisting slide" do
      @page.execute_js("$.shining.slides.current = 'omg'; $.shining.slides.current").should == nil
    end
    
    it "returns the next slide in the list on .next" do
      @page.execute_js("$.shining.slides.current = 'second'; $.shining.slides.next").should == 'third'
    end
    
    it "returns the previous slide in the list on .previous" do
      @page.execute_js("$.shining.slides.current = 'second'; $.shining.slides.previous").should == 'first'
    end
  end
end