require 'tmpdir'
require File.join(File.dirname(__FILE__), *%w(.. lib shining))
require 'rspec'
require 'rake'
require 'json/pure'

Shining.quiet!

def mock_heroku_client
  zemock = mock Heroku::Client, :host => 'heroku.com', :password => 'foo', :user => 'bar'
end

RSpec.configure do |config|
  config.before :all do
    TMP = Dir.tmpdir/'shining-tmp' unless defined?(TMP)
    FileUtils.rm_rf   TMP
    FileUtils.mkdir_p TMP
  end

  config.before :each do
    FileUtils.rm_rf TMP/'temp'
    @preso = Shining::Preso.new TMP/'temp'
  end
end