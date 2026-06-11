require "rails_helper"

RSpec.describe DivisionImporter do
  let(:valid_csv) do
    <<~CSV
      division,race_no,start_time
      10k,1,10:00
      5k,2,9:30
    CSV
  end

  let(:tempfile) do
    file = Tempfile.new([ "divisions", ".csv" ])
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

  describe "#call" do
    context "when no file is provided" do
      it "returns failure" do
        undefined_file = described_class.new('undefined')
        result = undefined_file.validate_file("clear")

        expect(result.success?).to be false
        expect(result.error).to eq([ "No file provided" ])

        nil_file = described_class.new(nil)
        result = nil_file.validate_file("clear")

        expect(result.success?).to be false
        expect(result.error).to eq([ "No file provided" ])
      end
    end

    context "when CSV is invalid" do
      let(:tempfile) do
        file = Tempfile.new([ "divisions", ".xml" ])
        file.write("not,a,valid,csv\n\0\0\0")
        file.rewind
        file
      end

      it "returns failure" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file("clear")
        expected = [ "Invalid CSV format" ]

        expect(result.success?).to be false
        expect(result.error).to eq(expected)
      end
    end

    context "with valid CSV" do
      it "imports divisions successfully when merging" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file("merge")
        result = importer.call if checked_file.success?

        expect(result.success?).to be true
        expect(Division.count).to eq(2)
      end

      it "imports divisions successfully when clearing" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file("clear")
        result = importer.call if checked_file.success?

        expect(result.success?).to be true
        expect(Division.count).to eq(2)
      end
    end

    context "when division already exists" do
      before do
        create(:division, division: "10k", race_no: 1, start_time: "10:00")
      end

      it "returns duplicate racer error if merging" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file("merge")

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: '10k' has already been created")
      end
    end

    context "when CSV contains duplicate divisions" do
      let(:duplicate_csv) do
        <<~CSV
          division,race_no,start_time
          10k,1,10:00
          10k,2,10:30
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "divisions", ".csv" ])
        file.write(duplicate_csv)
        file.rewind
        file
      end

      # TODO: Verify duplicate divisions allowed for different sexes, etc
      it "does not treat duplicate CSV rows as errors" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file("merge")

        expect(result.success?).to be true
      end
    end

    context "when import fails mid-transaction" do
      before do
        allow_any_instance_of(Division).to receive(:save).and_return(false)
      end

      it "rolls back all inserts" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file("merge")
        result = importer.call if checked_file.success?

        expect(result.success?).to be false
        expect(Division.count).to eq(0)
      end
    end
  end
end
