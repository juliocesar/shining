$:.unshift File.join(File.dirname(__FILE__))

require 'ext/string'
require 'ext/filemethods'
require 'shining/preso'
require 'shining/generators'

SHINING_ROOT = 

module Shining
  class << self
    def say something
      STDOUT.puts(something) unless defined?(Spec) # shush when running tests
      yield if block_given?
    end

    def root
      @root ||= File.expand_path File.dirname(__FILE__)/'..'
    end

    def templates_path
      root/'templates'
    end
  end
end