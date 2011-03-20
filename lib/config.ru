require 'rubygems'
require 'json/pure'

use Rack::Static,
  :root => File.dirname(__FILE__),
  :urls => %w(/vendor/css /vendor/lib /config.json /vendor/themes /vendor/images)
  
map '/' do
  run Proc.new { |env|
    [ 200, { 'Content-Type' => 'text/html', 'Cache-Control' => 'public, max-age=86400' }, [File.read('index.html')] ]
  }
end

map '/slides.json' do
  run Proc.new { |env|
    slides = Dir['slides/*[.html,.md,.markdown]']
    slides = slides.inject({}) do |result, slide|
      noext, name = File.basename(slide, File.extname(slide)), File.basename(slide)
      result[name] = {:markup => File.read(slide)}
      result[name][:script] = File.read("slides/#{noext}.js") if Dir["slides/#{noext}.js"].any?
      result
    end    
    [
      200,
      { 'Content-Type' => 'application/x-json', 'Pragma' => 'no-cache' },
      [slides.to_json]
    ] 
  }
end

