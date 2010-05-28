require File.join(File.dirname(__FILE__), 'spec_helper')

describe 'shine' do
  PRESO = Dir.tmpdir/'shining-tmp'/'preso'
  SHINE = Shining.root/'bin'/'shine'

  def quiet command
    system "#{command} > /dev/null"
  end

  def new_preso
    quiet "#{SHINE} #{PRESO}"
  end

  def vendorize
    quiet "cd #{PRESO} && #{SHINE} vendor"
  end

  def new_slide(name, format = 'html')
    quiet "cd #{PRESO} && #{SHINE} slide #{name} #{format}"
  end

  def compile_templates
    quiet "cd #{PRESO} && #{SHINE} compile"
  end

  def make_haml_template!(name)
    File.open(PRESO/'slides'/"#{name}.haml", 'w') { |f| f << "%p LOOK MA" }
  end

  before :all do
    FileUtils.rm_rf   Dir.tmpdir/'shining-tmp'
    FileUtils.mkdir_p Dir.tmpdir/'shining-tmp'
  end

  before :each do
    FileUtils.rm_rf PRESO
    new_preso
  end

  it "creates a new shining preso when passing an argument thats not 'build', 'compile', or 'slide'" do
    File.directory?(PRESO).should == true
  end

  describe 'the slide option' do
    before do new_slide 'foo' end
      
    it 'defaults to HTML when no format is specified' do
      File.exists?(PRESO/'slides'/'foo.html').should be_true
    end
                
    it 'creates a new slide script by default' do
      File.exists?(PRESO/'slides'/'foo.js').should be_true
    end
    
    it 'creates a slide stylesheet by default' do
      File.exists?(PRESO/'slides'/'foo.css').should be_true
    end

    it "creates a new Haml slide named 'test.haml' on 'shine slide test haml'" do
      new_slide 'test', 'haml'
      File.exists?(PRESO/'slides'/'test.haml').should be_true
      File.exists?(PRESO/'slides'/'test.js').should be_true
    end
  end
  
  context 'go' do
    it "for now it only works on Mac OSX" do
      player = Shining::Player.new Shining::Preso.open(PRESO)
      player.should_receive(:osx?).and_return(false)
      lambda { player.go! }.should raise_error
    end
    
    it "downloads and decompresses Plainview and if it's not found #{'PRESO_ROOT'/'vendor'/'Plainview.app'}"
    it "fires up Plainview"
  end
end