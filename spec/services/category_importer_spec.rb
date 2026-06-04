require "rails_helper"

RSpec.describe CategoryImporter do
  let(:valid_csv) do
    <<~CSV
      category
      M40-49
      F20-29
    CSV
  end

  let(:tempfile) do
    file = Tempfile.new([ "categories", ".csv" ])
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
        file = Tempfile.new([ "categories", ".xml" ])
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
      it "imports categories successfully" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file
        result = importer.call if checked_file.success?

        expect(result.success?).to be true
        expect(Category.count).to eq(2)
      end
    end

    context "when category already exists" do
      before do
        create(:category, category: "M40-49")
      end

      it "returns duplicate racer error" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be false
        expect(result.error).to include("Row 2: 'M40-49' has already been created")
      end
    end

    context "when CSV contains duplicate categories" do
      let(:duplicate_csv) do
        <<~CSV
          category
          M40-49
          M40-49
        CSV
      end

      let(:tempfile) do
        file = Tempfile.new([ "categories", ".csv" ])
        file.write(duplicate_csv)
        file.rewind
        file
      end

      it "does not treat duplicate CSV rows as errors" do
        importer = described_class.new(uploaded_file)
        result = importer.validate_file

        expect(result.success?).to be true
      end
    end

    context "when import fails mid-transaction" do
      before do
        allow_any_instance_of(Category).to receive(:save).and_return(false)
      end

      it "rolls back all inserts" do
        importer = described_class.new(uploaded_file)
        checked_file = importer.validate_file
        result = importer.call if checked_file.success?

        expect(result.success?).to be false
        expect(Category.count).to eq(0)
      end
    end
  end
end
