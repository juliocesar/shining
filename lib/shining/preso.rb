module Shining

class Preso
  def initialize(dir)
    @path = File.expand_path(dir)
  end
  
  def vendorized?
    File.exists? @path/'vendor'
  end
  
  def copy_templates
  end
  
  private
  def shines?
    file? @path/'config.json' and
      file? @path/'index.html'
      dir? @path/'slides'
  end
  
  def file? file
    File.exists? file
  end
  
  def dir? dir
    File.directory? dir
  end
end

end