require File.join(File.dirname(__FILE__), 'spec_helper')

describe Shining::FileMethods do
  include Shining::FileMethods
  
  before :all do
    TMP = Dir.tmpdir/'shining-tmp' unless defined?(TMP)
    FileUtils.rm_rf   TMP
    FileUtils.mkdir_p TMP
  end

  before :each do
    FileUtils.rm_rf TMP/'temp'
    @preso = Shining::Preso.new TMP/'temp'
  end
  
  it '#file? returns true if the argument is a file' do
    FileUtils.touch TMP/'temp'/'moo'
    file?(TMP/'temp'/'moo').should be_true
  end  
  
  it '#dir? returns true if the argument is a directory' do
    FileUtils.mkdir TMP/'temp'/'adir'
    dir?(TMP/'temp'/'adir').should be_true
  end
  
  context '#delete' do
    it 'deletes files' do
      FileUtils.touch TMP/'temp'/'aboo'
      delete! TMP/'temp'/'aboo'
      File.exists?(TMP/'temp'/'aboo').should be_false
    end
    
    it 'removes directories' do
      FileUtils.mkdir TMP/'temp'/'dirone'
      delete! TMP/'temp'/'dirone'
      File.exists?(TMP/'temp'/'dirone').should be_false
    end
  end
    
  context '#json' do
    it 'parses JSON' do
      File.open(TMP/'foo.json', 'w') { |file| file << "[1, 2, 3]" }
      json(TMP/'foo.json').should be_a Array
    end
    it "raises Shining::NoSuchFile if the file doesn't exist" do
      lambda do json(TMP/'aaabbbbbbcccc') end.should raise_error Shining::NoSuchFile
    end
    it "raises Shining::CantParseJSONFile if the file isn't valid JSON" do
      File.open(TMP/'foo.json', 'w') { |file| file << "oaskdo ksdp kdpo asdk apos" }
      lambda do json(TMP/'foo.json') end.should raise_error Shining::CantParseJSONFile
    end
  end
  
  context '#move and #copy' do
    before do
      FileUtils.mkdir TMP/'temp'/'dir1'
      FileUtils.mkdir TMP/'temp'/'dir2'
      FileUtils.touch TMP/'temp'/'dir1'/'jquery.js'
      FileUtils.touch TMP/'temp'/'dir1'/'shining.js'      
      FileUtils.touch TMP/'temp'/'dir1'/'shining.rb'
    end
    
    it '#move moves specific files or directories from one directory to another' do
      move TMP/'temp'/'dir1'/'jquery.js', TMP/'temp'/'dir2/'
      File.exists?(TMP/'temp'/'dir2'/'jquery.js').should be_true
    end 
    
    it '#move moves files by wildcard from another directory to another' do
      move TMP/'temp'/'dir1'/'*.js', TMP/'temp'/'dir2/'
      File.exists?(TMP/'temp'/'dir2'/'shining.js').should be_true
    end
    
    it '#copy copies specific files or directories from one directory to another' do
      copy TMP/'temp'/'dir1'/'jquery.js', TMP/'temp'/'dir2/'
      File.exists?(TMP/'temp'/'dir2'/'jquery.js').should be_true
    end
    
    it '#copy copies files by wildcard from another directory to another' do
      copy TMP/'temp'/'dir1'/'*.js', TMP/'temp'/'dir2/'
      File.exists?(TMP/'temp'/'dir2'/'shining.js').should be_true
    end
  end
  
end