require "csv"
require "ostruct"

class DivisionImporter
  attr_reader :file, :errors, :rows

  REQUIRED_FIELDS = %w[division race_no start_time]
  MAX_ALLOWED_ERRORS = 10

  def initialize(file)
    @file = file
    @errors = []
  end

  def call
    import_rows
    return failure(errors) if errors.any?

    success
  end

  def validate_file(action)
    return failure([ "No file provided" ]) if file.blank? || file === "undefined"
    return failure([ "Invalid CSV format" ]) unless parse_csv
    return failure([ "Invalid CSV format" ]) if rows.blank?
    missing_headers = REQUIRED_FIELDS - rows.first.keys
    return failure([ "Invalid CSV format" ]) if missing_headers.any?

    check_rows(action)

    if errors.count > MAX_ALLOWED_ERRORS
      return failure([ "File has too many errors. The format is either invalid or missing too many fields." ])
    end

    return failure(errors) if errors.any?

    success
  end

  private

  # remove underscores, hyphens, normalize capitalization, etc
  def normalize_header(header)
    header = header.to_s.strip
    header = header.gsub(/([a-z])([A-Z])/, '\1_\2')
    header.downcase.gsub(/[^a-z0-9]+/, "_").gsub(/^_+|_+$/, "")
  end

  def normalize_row(row)
    {
      "division"    => row["division"]&.strip,
      "race_no"     => row["race_no"]&.strip&.to_i,
      "start_time"  => row["start_time"]&.strip
    }
  end

  def parse_csv
    csv_text = CSV.read(file.tempfile, headers: true, skip_blanks: true)

    normalized_headers = csv_text.headers.map { |h| normalize_header(h) }

    @rows = csv_text.map do |row|
      normalized = {}
      normalized_headers.each_with_index do |header, i|
        normalized[header] = row[i]
      end
      normalized
    end

    true
  rescue
    false
  end

  # check file for missing field or duplicates
  def check_rows(action)
    rows.each_with_index do |raw_row, index|
      row = normalize_row(raw_row)
      row_number = index + 1

      REQUIRED_FIELDS.each do |field|
        if row[field].blank?
          errors << "Row #{row_number + 1}: Missing #{field}"
        end
      end

      if action == "merge" && Division.exists?(division: row["division"])
        errors << "Row #{row_number + 1}: '#{row["division"]}' has already been created"
      end
    end
  end

  def import_rows
    ActiveRecord::Base.transaction do
      rows.each_with_index do |raw_row, index|
        row = normalize_row(raw_row)

        division = Division.new(
          division: row["division"],
          race_no: row["race_no"],
          start_time: row["start_time"]
        )

        unless division.save
          errors << "Row #{index + 1}: #{division.errors.full_messages.join(', ')}"
        end
      end

      raise ActiveRecord::Rollback if errors.any?
    end
  end

  def success
    OpenStruct.new(success?: true, error: nil)
  end

  def failure(error)
    OpenStruct.new(success?: false, error: error)
  end
end
