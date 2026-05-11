require "rails_helper"

RSpec.describe Division, type: :model do
  describe "associations" do
    it { should have_many(:racers) }
  end

  describe "validations" do
    it { should validate_presence_of(:division) }
    it { should validate_presence_of(:race_no) }
    it { should validate_numericality_of(:race_no).only_integer }
  end

  describe "factory" do
    it "is valid" do
      expect(build(:division)).to be_valid
    end
  end
end
