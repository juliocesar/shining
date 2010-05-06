require File.join(File.dirname(__FILE__), 'spec_helper')

describe 'Shining::Preso' do

  before :all do
    TMP = Dir.tmpdir/'shining-tmp' unless defined?(TMP)
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

    it "copies everything necessary to run the preso to the target folder" do
      %w(lib themes css).each do |required|
        File.directory?(TMP/'temp'/'vendor'/required).should be_true
      end
      %w(config.json index.html slides/welcome.html).each do |required|
        File.exists?(TMP/'temp'/required).should be_true
      end
    end
  end
  
  describe "#open" do
    it "opens an existing presentation" do
      preso = Shining::Preso.open TMP/'temp'
      preso.should be_an_instance_of(Shining::Preso)
    end
    
    it "errors out if the directory is not a Shining presentation" do
      lambda do Shining::preso.open TMP end.should raise_error
    end
  end

  describe 'config' do
    it "#config(true) force loads from config.json" do
      @preso.should_receive :json
      @preso.config(true)
    end

    it "#config simply returns the in-memory config Hash" do
      @preso.should_not_receive :json
      @preso.config
    end
  end

  describe 'slides' do
    before do
      FileUtils.rm_f @preso.path/'slides'/'*.haml'
      FileUtils.rm_f @preso.path/'slides'/'*.markdown'      
    end

    it "raises an error if the format is not in the allowed formats list" do
      lambda do @preso.new_slide 'foo.erb' end.should raise_error(ArgumentError)
    end

    it "#new_slide creates a new Markdown/Haml/HTML template and adds it's name to the config file" do
      @preso.new_slide 'foo.haml'
      JSON.parse(File.read(@preso.path/'config.json'))['slides'].should include('foo')
    end
  end
  
  describe 'templates' do
    it "#templates returns exclusively these template formats: #{Shining::Preso::TEMPLATE_FORMATS.join(', ')}." do
      @preso.new_slide 'foo.haml'
      @preso.new_slide 'test.markdown'
      @preso.templates.should     include('foo.haml', 'test.markdown')
      @preso.templates.should_not include('welcome.html')
    end
    
    it "#compile_templates! compiles either Markdown/Haml templates into HTML (slides)" do
      @preso.new_slide 'test2.haml'
      @preso.new_slide 'test3.markdown'
      @preso.compile_templates!
      (File.exists?(@preso.path/'slides'/'test2.html') and
        File.exists?(@preso.path/'slides'/'test3.html')).should be_true
    end
  end

  it "returns a collection of slides on #slides, which is what's in @config['slides']" do
    @preso.slides.should include('welcome')
  end
end