# For now this is just a wrapper for Plainview. More goodness coming soon

require 'rbconfig'

module Shining

class Player
  include FileMethods and extend FileMethods
  
  def initialize(preso)
    raise ArgumentError, "argument needs to be an instance of Shining::Preso" unless preso.is_a? Shining::Preso
    @preso = preso
  end
  
  def go!
    raise RuntimeError, %w(
        Sorry! We currently only support Plainview on MacOSX as
        a player. Manually open your presentation's index.html
        via Safari or Chrome for the time being.
      ).join(' ') unless osx?
    download and decompress and install unless installed?
    `#{@preso.path}/vendor/Plainview.app/Contents/MacOS/Plainview #{@preso.path}/index.html`
  end
  
  def download
    Shining.say "Downloading Plainview from http://s3.amazonaws.com/plainviewapp/plainview_1.0.173.zip..."
    `curl -# http://s3.amazonaws.com/plainviewapp/plainview_1.0.173.zip -o /tmp/plainview.zip`
  end
  
  def decompress
    Shining.say "Decompressing /tmp/plainview.zip"
    `unzip -o -d /tmp /tmp/plainview.zip`
  end
  
  def install
    new_dir @preso.path/'vendor'
    move '/tmp/Plainview.app', @preso.path/'vendor/'
  end
  
  def installed?
    dir? @preso.path/'vendor'/'Plainview.app'
  end
    
  protected
  def osx?
    Config::CONFIG['host_os'].include? 'darwin'
  end
end

end