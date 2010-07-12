# Handles deploying a presentation to Heroku.
require 'heroku'
require 'heroku/command'

module Shining

class Heroku
  extend FileMethods
  class FailCreatingApp < RuntimeError; end
  
  def initialize preso
    raise RuntimeError, 'Git is either not installed or not in your PATH. Check and try again.' if `which git`.empty?
    @preso  = preso
    @client = ::Heroku::Command.run_internal 'auth:client', []
  end
  
  def create_app name = preso.name
    Shining.say "\tCreating #{name} on Heroku..."
    begin
      @client.create name
      change_dir @preso.path
      `git remote add heroku git@#{@client.host}:#{name}.git`
    rescue RestClient::RequestFailed => error
      case error.http_code
      when 422
        Shining.error "\tApparently #{name} already exists on Heroku. Try again with a different name."
      else
        Shining.error "\tAn error ocurred when creating #{name}. Maybe try again in a moment?"
      end
      raise FailCreatingApp
    end
  end
    
  def deploy name
    copy Shining.root/'lib'/'config.ru', @preso.path
    change_dir @preso.path
    Shining.say "Creating Git repository on #{@preso.path}" do `git init` end unless git_repo?
    Shining.say "Updating presentation's contents" do
      `git add .`
      system "git commit -a -m 'heroku deploy'"
    end
    create_app(name) unless heroku_app?
    Shining.say "Pushing to Heroku" do
      system "git push heroku master"
    end
    Shining.say "Done! Visit http://#{name}.heroku.com to browse your presentation."
    Shining.say "If you're updating, make sure you do a hard refresh (shift + refresh on most modern browsers)."
  end
  
  private  
  def git_repo?
    dir? Dir.pwd/'.git'
  end  
  
  def heroku_app?
    `git remote`.split("\n").include? 'heroku'
  end
end

end