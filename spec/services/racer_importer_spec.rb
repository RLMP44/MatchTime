require "rails_helper"

RSpec.describe RacerImporter do
  let(:category)   { create(:category) }
  let(:category2)  { create(:category, category: "F20-29") }
  let(:division)  { create(:division) }

  let(:valid_csv) do
    <<~CSV
      first_name,last_name,city,email,age,division,category
      John,Doe,Denver,john@example.com,40,10k,M40-49
      Jane,Smith,Boulder,jane@example.com,25,10k,F20-29
    CSV
  end

  let(:tempfile) do
    file = Tempfile.new([ "racers", ".csv" ])
    file.write(valid_csv)
    file.rewind
    file
  end

  let(:uploaded_file) do
    instance_double(
      ActionDispatch::Http::UploadedFile,
      tempfile: tempfile
    )
  end

  before do
    category
    category2
    division
  end

  describe "#call" do
    context "when no file is provided" do
      it "returns failure" do
        undefined_file = described_class.new('undefined')
        result = undefined_file.validate_file

        expect(result.success?).to be false
        expect(result.error).to eq([ "No file provided" ])

        nil_file = described_class.new(nil)
        result = nil_file.validate_file

        expect(result.success?).to be false
        expect(result.error).to eq([ "No file provided" ])
      end
    end

    context "when CSV is invalid" do
      let(:tempfile) do
        file = Tempfile.new([ "racers", ".xml" ])
        file.write("not,a,valid,csv\n\0\0\0")
        file.rewind
        file
      end

      it "returns failure" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file
        expected = [ "Invalid CSV format" ]

        expect(result.success?).to be false
        expect(result.error).to eq(expected)
      end
    end

    context "with valid CSV" do
      it "imports racers successfully" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file
        result = importer.call if checked_file.success?

        expect(result.success?).to be true
        expect(Racer.count).to eq(2)
      end
    end

    context "when required fields are missing" do
      let(:invalid_csv) do
        <<~CSV
          first_name,last_name,city,email,age,division,category
          ,Doe,Denver,john@example.com,30,10k,M40-49
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "racers", ".csv" ])
        file.write(invalid_csv)
        file.rewind
        file
      end

      it "returns missing field errors" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: Missing first_name")
      end
    end

    context "when category does not exist" do
      let(:invalid_csv) do
        <<~CSV
          first_name,last_name,city,email,age,division,category
          John,Doe,Denver,john@example.com,30,10k,M70-79
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "racers", ".csv" ])
        file.write(invalid_csv)
        file.rewind
        file
      end

      it "returns unknown category error" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: Unknown category 'M70-79'")
      end
    end

    context "when division does not exist" do
      let(:invalid_csv) do
        <<~CSV
          first_name,last_name,city,email,age,division,category
          John,Doe,Denver,john@example.com,30,100k,M40-49
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "racers", ".csv" ])
        file.write(invalid_csv)
        file.rewind
        file
      end

      it "returns unknown division error" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: Unknown division '100k'")
      end
    end

    context "when racer already exists" do
      before do
        create(:racer, first_name: "John", last_name: "Doe", email: "john@example.com")
      end

      it "returns duplicate racer error" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: 'John Doe' is already registered")
      end
    end

    context "when CSV contains duplicate names" do
      let(:duplicate_csv) do
        <<~CSV
          first_name,last_name,city,email,age,division,category
          John,Doe,Denver,john@example.com,30,10k,M40-49
          John,Doe,Boulder,john2@example.com,28,10k,M40-49
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "racers", ".csv" ])
        file.write(duplicate_csv)
        file.rewind
        file
      end

      it "returns duplicate full name error" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 3: Duplicate full name in CSV 'John Doe'")
      end
    end

    context "when import fails mid-transaction" do
      before do
        allow_any_instance_of(Racer).to receive(:save).and_return(false)
      end

      it "rolls back all inserts" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file
        result = importer.call if checked_file.success?

        expect(result.success?).to be false
        expect(Racer.count).to eq(0)
      end
    end
  end
end
