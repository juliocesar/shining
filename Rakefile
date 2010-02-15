require File.join(File.dirname(__FILE__), *%w(.bundle environment))

require 'spec/rake/spectask'

Spec::Rake::SpecTask.new do |t|
  t.spec_files = FileList['spec/*_spec.rb']
  t.spec_opts = ['--colour', '--format nested']
end
