require 'fileutils'
require 'json/pure'
require 'tilt'

module Shining

class Preso
  include FileMethods and extend FileMethods
  attr_accessor :path

  SLIDE_FORMATS     = %w(haml markdown html)
  TEMPLATE_FORMATS  = SLIDE_FORMATS - ['html']

  def initialize dir, fresh = true
    @path   = expand(dir)
    if fresh
      new_dir dir
      copy_templates
    end
    @config = json(@path/'config.json')
  end

  def self.open dir
    begin
      new dir, false
    rescue
      raise "#{dir} is not a Shining presentation!"
    end
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

  def new_slide file, options = {}
    file = basename(file)
    name, format = basename(file, extname(file)), extname(file).sub(/^./, '')
    raise ArgumentError, "Format needs to be #{SLIDE_FORMATS.join(' or ')}." unless SLIDE_FORMATS.include? format
    new_file path/'slides'/file do Shining.sample_content_for(format) end
    new_file path/'slides'/"#{name}.css"  if options[:with].include?('styles') rescue nil
    new_file path/'slides'/"#{name}.js"   if options[:with].include?('script') rescue nil
    config['slides'] << name and save_config!
  end

  def slides
    @config['slides']
  end

  def templates
    Dir[path/'slides'/"*.{#{TEMPLATE_FORMATS.join(',')}}"].map { |t| basename(t) }
  end

  def compile_templates!
    templates.each do |template|
      begin
        target   = basename(template).sub(extname(template), '.html')
        rendered = Tilt.new(path/'slides'/template).render
        new_file path/'slides'/target do rendered end
      rescue RuntimeError
        Shining.error "Tilt coult not compile #{File.basename template}. Skipping."
      end
    end
  end

  def vendorize!
    new_dir @path/'vendor'
    %w(lib css images themes).each do |required|
      copy Shining.root/required, @path/'vendor/'
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