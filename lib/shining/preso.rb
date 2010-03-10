require 'fileutils'
require 'json/pure'

module Shining

class Preso
  include FileMethods
  attr_accessor :path
  
  TEMPLATE_FORMATS = %w(haml markdown)

  def initialize dir
    new_dir dir
    @path   = expand(dir)
    copy_templates
    @config = json(@path/'config.json')
  end
  
  def config refresh = false
    refresh ? @config = json(path/'config.json') : @config
  end

  def save_config!
    new_file path/'config.json' do JSON.pretty_generate(@config) end
    true
  end

  def copy_templates
    %w(config.json slides).each do |template|
      copy Shining.templates_path/template, @path + '/'
    end
    new_file @path/'index.html' do erb(Shining.templates_path/'index.html') end
    true
  end
  
  def templates
    Dir[path/'slides'/"*.{#{TEMPLATE_FORMATS.join(',')}}"].map { |template| basename(template) }
  end
  
  def new_template file, options = {}
    file = basename(file)
    name, format = basename(file, extname(file)), extname(file).sub(/^./, '')
    raise ArgumentError, "Format needs to be #{TEMPLATE_FORMATS.join(' or ')}." unless TEMPLATE_FORMATS.include? format
    new_file path/'slides'/file do
      if format == 'markdown'
        <<-CONTENTS
          # #{name}
          This is a new slide. It needs some lovin'!
        CONTENTS
      else
        <<-CONTENTS
          %h1.centered #{name}
          %p.centered This is a new slide. It needs some lovin'!
        CONTENTS
      end
    end
    new_file path/'slides'/"#{name}.css"  if options[:with].include?('styles') rescue nil
    new_file path/'slides'/"#{name}.js"   if options[:with].include?('script') rescue nil
    config['slides'] << name and save_config!
  end
  
  def slides
    @config['slides']
  end

  def vendorize!
    new_dir @path/'vendor'
    %w(lib css images themes).each do |required|
      copy required, @path/'vendor/'
    end
    new_file @path/'index.html' do erb(Shining.templates_path/'index.html') end
    true
  end

  def vendorized?
    dir? @path/'vendor'
  end

  def unvendorize!
    delete! @path/'vendor'
    copy_templates
  end

  def vendorized?
    dir? @path/'vendor'/'lib' and
      dir? @path/'vendor'/'themes' and
      dir? @path/'vendor'/'css' and
      dir? @path/'vendor'/'images'
  end    
end

end