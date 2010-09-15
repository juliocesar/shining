use Rack::Static,
  :root => File.dirname(__FILE__),
  :urls => %w(/vendor/css /vendor/lib /slides /config.json /vendor/themes /vendor/images)
run lambda { |env|
  [
    200,
    { 'Content-Type' => 'text/html', 'Cache-Control' => 'public, max-age=86400' },
    [File.read('index.html')]
  ]
}
