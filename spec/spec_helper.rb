require 'rubygems'
require File.join(File.dirname(__FILE__), *%w(.. lib shining))

gem 'stackdeck',  '0.2.0';          require 'stackdeck'
gem 'johnson',    '2.0.0.pre2';     require 'johnson'
gem 'rspec',      '1.3.0';          require 'spec'
gem 'rake',       '0.8.7';          require 'rake'
gem 'envjs',      '0.1.4';          require 'envjs'
gem 'juliocesar-harmony', '0.5.2';  require 'harmony'
gem 'json_pure',  '1.1.9';          require 'json/pure'

ROOT = File.expand_path File.join(File.dirname(__FILE__), '..')

class String; def /(s) File.join(self, s) end end