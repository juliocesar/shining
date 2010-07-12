require File.join(File.dirname(__FILE__), 'spec_helper')

describe Shining::Heroku do  
  context "initializing" do
    it "checks if Git is in the binaries path" do
      old_path = ENV['PATH']
      ENV['PATH'] = ""
      lambda do Shining::Heroku.new(@preso) end.should raise_error
      ENV['PATH'] = old_path
    end
    
    it "instances a new Heroku::Client" do
      Heroku::Command.should_receive(:run_internal).with('auth:client', []).and_return(mock_heroku_client)
      Shining::Heroku.new @preso
    end
  end  
end