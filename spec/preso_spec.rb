require File.join(File.dirname(__FILE__), 'spec_helper')

describe 'Shining::Preso' do
  it "returns true on #shines? when inside a presentation dir, and false when outside"
  it "returns the expanded dir path to the presentation on #path"
  it "returns a collection of slides on #slides"
end