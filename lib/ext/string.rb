class String;
  def /(s)
    File.join(self, s)
  end
  def blank?
    self == ""
  end
end
