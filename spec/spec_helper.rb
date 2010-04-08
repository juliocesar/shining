require 'rubygems'
require 'tmpdir'
require File.join(File.dirname(__FILE__), *%w(.. lib shining))

gem 'rspec',      '>= 1.3.0';    require 'spec'
gem 'jspec',      '4.2.0';       require 'jspec'
gem 'rake',       '>= 0.8.7';    require 'rake'
gem 'json_pure',  '>= 1.1.9';    require 'json/pure'
gem 'haml',       '>= 2.2.17';   require 'haml'