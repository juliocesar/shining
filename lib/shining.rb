$:.unshift File.join(File.dirname(__FILE__))

require 'rubygems'
require 'ext/string'
require 'ext/filemethods'
require 'shining/preso'
require 'shining/player'
require 'term/ansicolor'

module Shining
  extend Term::ANSIColor
  
  class << self
    def say something
      STDOUT.puts(blue(something)) unless defined?(Spec) # shush when running tests
      yield if block_given?
    end

    def error message
      STDERR.puts red(bold(message))
    end

    def root
      @root ||= File.expand_path File.dirname(__FILE__)/'..'
    end

    def templates_path
      root/'templates'
    end

    def sample_content_for format = 'html'
      case format
      when 'markdown'
        <<-CONTENTS
# #{name}
This is a new slide. It needs some lovin'!
        CONTENTS
      when 'haml'
        <<-CONTENTS
%h1.centered #{name}
%p.centered This is a new slide. It needs some lovin'!
        CONTENTS
      when 'html'
        <<-CONTENTS
<h1 class="centered">#{name}</h1>
<p class="centered">This is a new slide. It needs some lovin'!</p>
        CONTENTS
      end
    end
  end
end