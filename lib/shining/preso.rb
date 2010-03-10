require 'fileutils'
require 'json/pure'

module Shining

class Preso
  include FileMethods
  attr_accessor :path

  def initialize(dir)
    new_dir dir
    @path = File.expand_path(dir)
    copy_templates
  end

  def copy_templates
    %w(config.json slides).each do |template|
      copy Shining.templates_path/template, @path + '/'
    end
    new_file @path/'index.html' do |index|
      index.write erb(Shining.templates_path/'index.html')
    end
    true
  end

  def vendorize!
    new_dir @path/'vendor'
    %w(lib css images themes).each do |required|
      copy required, @path/'vendor/'
    end
    new_file @path/'index.html' do |index| index.write erb(Shining.templates_path/'index.html') end
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