require "rails_helper"

RSpec.describe Category, type: :model do
  describe "associations" do
    it { should have_many(:racers) }
  end

  describe "validations" do
    it { should validate_presence_of(:sex) }
    it { should validate_presence_of(:category) }

    it { should validate_numericality_of(:min_age).only_integer }
    it { should validate_numericality_of(:max_age).only_integer }
  end

  describe "factory" do
    it "is valid" do
      expect(build(:category)).to be_valid
    end
  end
end
