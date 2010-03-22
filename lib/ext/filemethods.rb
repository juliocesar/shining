require 'fileutils'
require 'erb'

module Shining

module FileMethods
  def file? file
    File.exists? file
  end

  def dir? dir
    File.directory? dir
  end
  
  def move from, to
    Shining.say("Moving #{from} to #{to}") { FileUtils.mv(from, to) }
  end

  def copy from, to
    Shining.say("Copying #{from} to #{to}") { File.directory?(from) ? FileUtils.cp_r(from, to) : FileUtils.cp(from, to) }
  end

  def new_dir dir, careful = true
    confirm "#{dir} already exists. Proceed?" if careful and dir?(dir)
    Shining.say("Creating directory #{dir}") { FileUtils.mkdir_p dir }
  end

  def read_file file
    File.read file
  end

  def erb file
    ERB.new(read_file(file)).result(binding)
  end
  
  def json file
    JSON.parse read_file(file)
  end

  def expand path
    File.expand_path path
  end

  def dirname file
    File.dirname file
  end
  
  def extname file
    File.extname file
  end
  
  def basename file, take = ''
    File.basename file, take
  end
  
  def delete! file
    dir?(file) ? FileUtils.rm_rf(file) : FileUtils.rm(file)
  end

  def new_file path
    Shining.say "Creating file #{path}" do
      File.open path, 'w' do |file|
        yieldage = yield if block_given?
        file.write yieldage unless yieldage.empty? or not yieldage.is_a?(String)
      end
    end
  end

  private
  def confirm text
    Shining.say text
    !!(STDIN.gets =~ /yes|y/i) ? true : exit(-2)
  end
end

end