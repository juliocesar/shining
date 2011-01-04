require File.join(File.dirname(__FILE__), 'spec_helper')

describe Shining::Preso do
  context '#new' do
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
  
  context "#open" do
    it "opens an existing presentation" do
      @preso.should be_an_instance_of Shining::Preso
    end
    
    it "errors out if the directory is not a Shining presentation" do
      lambda do Shining::preso.open TMP end.should raise_error
    end
  end

  context 'config' do
    it "#config(true) force loads from config.json" do
      @preso.should_receive :json
      @preso.config(true)
    end

    it "#config simply returns the in-memory config Hash" do
      @preso.should_not_receive :json
      @preso.config
    end
  end

  context 'slides' do
    before do
      FileUtils.rm_f @preso.path/'slides'/'*.haml'
      FileUtils.rm_f @preso.path/'slides'/'*.markdown'      
    end

    it "raises an error if the format is not Markdown, Haml, or HTML" do
      lambda do @preso.new_slide 'foo.erb' end.should raise_error(ArgumentError)
    end

    it "#new_slide creates a new Markdown/HTML template and adds it's name to the config file" do
      @preso.new_slide 'foo.md'
      JSON.parse(File.read(@preso.path/'config.json'))['slides'].should include('foo.md')
    end
    
    context '#remove_slide' do
      it "removes a slide along with it's script and style" do
        @preso.new_slide 'aboo.html'
        @preso.remove_slide 'aboo.html'
        %w(aboo.html aboo.css aboo.js).each do |file|
          File.exists?(@preso.path/'slides'/file).should_not be_true
        end
      end
      
      it "removes the slide from the presentation's list of slides" do
        @preso.slides.should_not include('aboo.html')
      end      
    end    
  end
  
  it "returns a list of the presentation's slides" do
    @preso.slides.should include('welcome.html')
  end
  
  it "returns the preso's name on #name" do
    @preso.name.should == "Your presentation"
  end
end