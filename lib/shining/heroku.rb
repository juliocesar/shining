# Class that handles deploying a presentation to Heroku.
# This is REALLY hard to spec, so I just won't. I'm sure you can forgive me.

module Shining

class Heroku
  extend FileMethods
  class << self
    def deploy preso, name
      check_for_git_and_heroku
      preso.vendorize! unless preso.vendorized?
      copy Shining.root/'lib'/'config.ru', preso.path
      change_dir preso.path
      `git init && git add . && git commit -m 'heroku deploy'`
      `heroku create #{name}`
      `git push heroku master`
      Shining.say "Done!"
    end
    
    private
    def check_for_git_and_heroku
      raise RuntimeError, 'You need to install the heroku gem before deploying! (Usually "sudo gem install heroku")' if `which heroku`.empty?
      raise RuntimeError, 'Git is either not installed or not in your PATH. Check and try again.' if `which git`.empty?
    end
  end
end

end