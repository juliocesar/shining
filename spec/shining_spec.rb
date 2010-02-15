require File.join(File.dirname(__FILE__), *%w(.. .bundle environment))
Bundler.require(:default, :test)

__ROOT__ = File.expand_path File.join(File.dirname(__FILE__), '..')

require 'spec'

describe 'Shining' do  
  before do
    @page = Harmony::Page.fetch("file:////#{__ROOT__}/spec/sample/home.html")
  end
  
  it "has a stage" do
    @page.execute_js("$('#stage').is(':visible')").should == true
  end  
end