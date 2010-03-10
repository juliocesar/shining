require File.join(File.dirname(__FILE__), 'spec_helper')

describe 'Shining::Preso' do

  before :all do
    TMP = Dir.tmpdir/'shining-tmp'
    FileUtils.rm_rf   TMP
    FileUtils.mkdir_p TMP
  end

  before :each do
    FileUtils.rm_rf TMP/'temp'
    @preso = Shining::Preso.new TMP/'temp'
  end

  describe '#new' do
    it "creates a folder for the presentation on #new" do
      File.directory?(TMP/'temp').should be_true
    end

    it "copies an initial set of templates to the presentation folder" do
      (File.exists?(TMP/'temp'/'config.json')
      File.exists?(TMP/'temp'/'index.html')
      File.directory?(TMP/'temp'/'slides')
      File.exists?(TMP/'temp'/'slides'/'welcome.html')).should be_true
    end
  end

  describe 'vendorization' do
    before do
      @preso.vendorize!
    end

    it "#vendorize! copies everything necessary for the presentation to run without the gem being installed" do
      (File.directory?(@preso.path/'vendor'/'lib') and
        File.directory?(@preso.path/'vendor'/'themes') and
        File.directory?(@preso.path/'vendor'/'css') and
        File.directory?(@preso.path/'vendor'/'images')).should be_true
    end

    it "returns true on #vendorized? if a presentation is vendorized, false when not" do
      @preso.vendorized?.should be_true
      File.read(@preso.path/'index.html').should =~ /vendor\/lib/
    end

    it "\"unvendorizes\" a gem on #unvendorize!" do
      @preso.unvendorize!
      (File.directory?(@preso.path/'vendor'/'lib') and
        File.directory?(@preso.path/'vendor'/'themes') and
        File.directory?(@preso.path/'vendor'/'css') and
        File.directory?(@preso.path/'vendor'/'images')).should be_false
      File.read(@preso.path/'index.html').should_not =~ /vendor\/lib/
    end
  end
  
  describe 'templates' do
    it "returns a collection of Haml/Markdown templates" do
      
    end
  end

  it "returns a collection of slides on #slides"
end