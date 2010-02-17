require File.join(File.dirname(__FILE__), *%w(.. .bundle environment))
Bundler.require(:default, :test)

__ROOT__ = File.expand_path File.join(File.dirname(__FILE__), '..')

require 'spec'

describe 'Shining' do  
  before do
    Dir.chdir File.join(__ROOT__, *%w(spec sample))
    @page = Harmony::Page.fetch("file:////#{__ROOT__}/spec/sample/home.html")
  end
  
  it "has a stage" do
    @page.execute_js("$('#stage').is(':visible')").should == true
  end
  
  describe ".slides" do
    it ".current should return the first slide by default" do
      @page.execute_js("$.shining.slides.current").should == 'first'
    end
    
    it "sets a slide via .current= returning the slide name" do
      @page.execute_js("$.shining.slides.current = 'second'").should == 'second'
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