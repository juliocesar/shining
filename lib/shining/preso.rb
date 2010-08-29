require 'fileutils'
require 'json/pure'

module Shining

class Preso
  include FileMethods and extend FileMethods
  attr_reader :path, :name

  SLIDE_FORMATS = %w(markdown html)

  def initialize dir, fresh = true
    @path   = expand(dir)
    if fresh
      new_dir dir
      copy_templates
      vendorize!
    end
    @config = json(@path/'config.json')
    @name   = @config['title']
  end

  def self.open dir
    new dir, false
  end

  def config refresh = false
    refresh ? @config = json(path/'config.json') : @config
  end

  def save_config!
    new_file path/'config.json' do JSON.pretty_generate(@config) end
    true
  end

  def copy_templates
    %w(config.json slides index.html).each do |template|
      copy Shining.templates_path/template, @path + '/'
    end
    true
  end

  def new_slide file, options = {}
    file = basename(file)
    name, format = basename(file, extname(file)), extname(file).sub(/^./, '')
    raise ArgumentError, "Format needs to be #{SLIDE_FORMATS.join(' or ')}." unless SLIDE_FORMATS.include? format
    new_file path/'slides'/file do Shining.sample_content_for(format) end
    new_file path/'slides'/"#{name}.css"  if options[:with].include?('styles') rescue nil
    new_file path/'slides'/"#{name}.js"   if options[:with].include?('script') rescue nil
    config['slides'] << file and save_config!
  end

  def remove_slide file
    file = basename(file)
    name, format = basename(file, extname(file)), extname(file).sub(/^./, '')
    delete! file
    delete! "#{name}.css"
    delete! "#{name}.js"
    config['slides'].delete file and save_config!
  end

  def slides
    @config['slides']
  end

  def vendorize!
    new_dir @path/'vendor'
    new_dir @path/'vendor'/'lib'
    copy Shining.root/'lib'/'config.ru', @path + '/'
    copy Shining.root/'lib'/'*.js', @path/'vendor'/'lib'
    copy Shining.root/'lib'/'plugins', @path/'vendor'/'lib/'
    %w(css images themes).each do |required|
      copy Shining.root/required, @path/'vendor/'
    end
    true
  end
end

end