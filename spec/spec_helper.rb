require File.join(File.dirname(__FILE__), *%w(.. .bundle environment))
Bundler.require(:default, :test)
ROOT = File.expand_path File.join(File.dirname(__FILE__), '..')
require 'tmpdir'
require 'fileutils'

class String; def /(s) File.join(self, s) end end