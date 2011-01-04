require File.join(File.dirname(__FILE__), 'spec', 'spec_helper')
require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new do |t| 
  t.pattern = 'spec/**/*_spec.rb'
  t.rspec_opts = ['-c', '-f nested', '-r ./spec/spec_helper']
end

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gem|
    gem.name                = "shining"
    gem.summary             = "HTML + CSS + Javascript = awesome presos"
    gem.description         = "HTML + CSS + Javascript = awesome presos"
    gem.email               = "julio.ody@gmail.com"
    gem.homepage            = "http://shining.heroku.com"
    gem.authors             = "Julio Cesar Ody"
    gem.add_dependency      'json_pure',      '>= 1.1.9'
    gem.add_dependency      'heroku',         '>= 1.9.9'
    gem.add_dependency      'rack',           '>= 1.0'
    gem.add_dependency      'stringex',       '>= 1.1.0'
    gem.add_dependency      'jeweler',        '>= 1.4.0'
    gem.add_dependency      'rainbow',        '1.1'
    gem.add_development_dependency 'rspec', '1.3.0'
    gem.add_development_dependency 'jspec', '4.2.0'    
    gem.add_development_dependency 'rake',  '0.8.7'
  end
rescue LoadError
  puts 'Jeweler (or a dependency) not available. Install it with: gem install jeweler'
end