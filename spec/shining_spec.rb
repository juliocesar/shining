require File.join(File.dirname(__FILE__), 'spec_helper')

describe Shining do
  after do Shining.quiet! end
  
  it 'fetches the version on Shining::VERSION' do
    Shining::VERSION.should == File.read(Shining.root + '/VERSION')
  end
  
  context 'quiet and verbose' do
    it '#verbose! means it will output to the console' do
      STDOUT.should_receive :puts
      Shining.verbose!
      Shining.say 'whelps, handle it!'
    end
    
    it '#quiet! means nothing will be outputted to the console' do
      STDOUT.should_not_receive :puts
      Shining.quiet!
      Shining.say "whelps, handle it!"      
    end
  end
end