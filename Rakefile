require File.join(File.dirname(__FILE__), 'spec', 'spec_helper')
require 'spec/rake/spectask'

Spec::Rake::SpecTask.new do |t|
  t.spec_files = FileList['spec/*_spec.rb']
  t.spec_opts = ['--colour', '--format nested']
end

namespace :spec do
  desc 'runs Javascript specs'
  task :javascripts do
    Dir.chdir File.join(File.dirname(__FILE__), 'spec', 'javascripts')
    system "jspec run dom.html"
  end
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
    gem.add_dependency      'haml',           '>= 2.2.17'
    gem.add_dependency      'json_pure',      '>= 1.1.9'
    gem.add_dependency      'tilt',           '>= 0.6'
    gem.add_dependency      'rdiscount',      '>= 1.6.3'
    gem.add_dependency      'heroku',         '>= 1.9.9'
    gem.add_development_dependency 'rspec', '1.3.0'
    gem.add_development_dependency 'jspec', '4.2.0'    
    gem.add_development_dependency 'rake',  '0.8.7'
  end
rescue LoadError
  puts 'Jeweler (or a dependency) not available. Install it with: gem install jeweler'
end