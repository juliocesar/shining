require 'rubygems'
require 'tmpdir'
require File.join(File.dirname(__FILE__), *%w(.. lib shining))

gem 'rspec',      '>= 1.3.0';    require 'spec'
gem 'rake',       '>= 0.8.7';    require 'rake'
gem 'json_pure',  '>= 1.1.9';    require 'json/pure'

Shining.quiet!

def mock_heroku_client
  zemock = mock Heroku::Client, :host => 'heroku.com', :password => 'foo', :user => 'bar'
end

Spec::Runner.configure do |config|
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