$:.unshift File.dirname(__FILE__)

require 'rubygems'
require 'ext/string'
require 'ext/filemethods'
require 'shining/preso'
require 'shining/player'
require 'shining/heroku'
require 'shining/errors'

module Shining
  class << self
    def quiet!
      @quiet = true
    end
    
    def quiet?
      !!@quiet
    end
    
    def verbose!
      @quiet = false
    end
    
    def say something
      STDOUT.puts something unless quiet?
      yield if block_given?
    end

    def error message
      STDERR.puts message unless quiet?
    end

    def root
      @root ||= File.expand_path File.dirname(__FILE__)/'..'
    end

    def templates_path
      root/'templates'
    end

    def sample_content_for format = 'html'
      case format
      when 'markdown', 'md'
        <<-CONTENTS
# #{name}
This is a new slide. It needs some lovin'!
        CONTENTS
      when 'html'
        <<-CONTENTS
<h1 class="centered">#{name}</h1>
<p class="centered">This is a new slide. It needs some lovin'!</p>
        CONTENTS
      end
    end
  end
  VERSION = File.read Shining.root/'VERSION'
end
