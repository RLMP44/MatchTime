require "rails_helper"

RSpec.describe Racer, type: :model do
  let(:category) { create(:category) }
  let(:division) { create(:division) }

  describe "associations" do
    it { should belong_to(:category) }
    it { should belong_to(:division) }
  end

  describe "validations" do
    subject do
      build(:racer,
        first_name: "John",
        last_name: "Doe",
        sex: "M",
        age: 40,
        category: category,
        division: division
      )
    end

    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:sex) }
    it { should validate_presence_of(:age) }
    it { should validate_presence_of(:category) }
    it { should validate_presence_of(:division) }

    it { should validate_numericality_of(:age).only_integer }
    it { should validate_numericality_of(:handicap).allow_nil }
    it { should validate_numericality_of(:bib).only_integer.allow_nil }
    it { should validate_numericality_of(:place).only_integer.allow_nil }
    it { should validate_numericality_of(:time_raw).allow_nil }

    it { should validate_uniqueness_of(:email).allow_nil }

    it do
      should validate_uniqueness_of(:first_name)
        .scoped_to(:last_name)
        .with_message("Full name already used")
    end
  end

  describe "callbacks" do
    it "calculates handicap before create" do
      racer = create(:racer)
      expect(racer.handicap).not_to be_nil
    end

    it "assigns bib equal to id after create" do
      racer = create(:racer)
      expect(racer.bib).to eq(racer.id)
    end

    it "does not override bib for placeholder racers" do
      racer = Racer.create_placeholder!(bib: 500, place: 1, time_raw: 1000)
      expect(racer.bib).to eq(500)
    end

    it "does not calculate handicap for placeholder racers" do
      racer = Racer.create_placeholder!(bib: 500, place: 1, time_raw: 1000)
      expect(racer.handicap).to be_nil
    end
  end

  describe "placeholder racers" do
    it "allows creating a placeholder racer without normal validations" do
      racer = Racer.create_placeholder!(bib: 500, place: 1, time_raw: 123)
      expect(racer).to be_persisted
      expect(racer.placeholder?).to eq(true)
      expect(racer.id).to be < 0
    end
  end
end
