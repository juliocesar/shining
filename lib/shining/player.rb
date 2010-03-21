# For now this is just a wrapper for Plainview. More goodness coming soon

require 'rbconfig'

module Shining

class Player
  
  def go!
    raise RuntimeError, %w(
        Sorry! We currently only support Plainview on MacOSX as
        a player. Manually open your presentation's index.html
        via Safari or Chrome for the time being.
      ).join(' ') unless osx?
  end
  
  protected
  def osx?
    Config::CONFIG['host_os'].include? 'darwin'
  end
end

end