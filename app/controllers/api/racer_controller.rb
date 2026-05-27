class Api::RacerController < Api::ApplicationController
  def index
    racers = Racer.joins(:division, :category)
      .select(
        "racers.*, divisions.race_no AS race_no,
        divisions.division AS division,
        divisions.id AS division_id,
        categories.category AS category,
        categories.id AS category_id"
      )
      .order(:bib)
    render json: racers.as_json(except: [ :division, :category ])
  end

  def create
    if params[:racer][:placeholder]
      racer = Racer.create_placeholder!(
        bib: params[:racer][:bib],
        place: params[:racer][:place],
        time_raw: params[:racer][:time_raw]
      )
      return render json: racer, status: :created
    end

    racer = Racer.new(racer_params.merge(
      division_id: params[:racer][:division_id],
      category_id: params[:racer][:category_id]
    ))

    if racer.save
      render json: racer, status: :created
    else
      render json: { errors: racer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: Racer.find(params[:id])
  end

  def update
    racer = Racer.find(params[:id])

    if racer.update(racer_params)
      render json: racer, status: :ok
    else
      render json: racer.errors, status: :unprocessable_entity
    end
  end

  def reset
    racer = Racer.find(params[:id])
    racer.update({ place: nil, time_raw: nil })
    render json: racer
  end

  def clear_existing
    file = params[:racer]

    destroyed = Racer.destroy_all

    if destroyed.any? { |div| div.errors.any? }
      render json: { error: div.error }, status: :unprocessable_entity
      return
    end

    upload_file(file)
  end

  def merge
    file = params[:racer]
    upload_file(file)
  end

  def destroy
    racer = Racer.find(params[:id])
    racer.destroy
  end

  private

  def racer_params
    params.require(:racer).permit(
      :first_name,
      :last_name,
      :city,
      :email,
      :sex,
      :age,
      :place,
      :time_raw,
      :category_id,
      :division_id,
      :bib,
      :handicap
    )
  end

  def file_fields_missing?(row)
    required_fields = {
      "first name" => row[0],
      "last name"  => row[1],
      "city"       => row[2],
      "email"      => row[3],
      "category"   => row[4],
      "division"   => row[5],
      "age"        => row[6]
    }

    missing = required_fields.select { |_, v| v.nil? || v.strip == "" }

    if missing.any?
      render json: {
        error: "Import failed! The file has missing fields:\n" \
              "#{missing.keys.map(&:titleize).join(', ')}"
      }, status: :unprocessable_entity
      return true
    end
    false
  end

  def category_and_division_invalid?(row, category, division)
    category = Category.find_by(category: row[4])
    division = Division.find_by(division: row[5])

    if category.nil? || division.nil?
      missing_target = category.nil? ? "category" : "division"
      missing_value  = category.nil? ? row[4] : row[5]

      render json: {
        error: "Import failed! #{row[0]} #{row[1]}'s chosen #{missing_target} doesn't exist:\n" \
              "#{missing_target.titleize}: #{missing_value}"
      }, status: :unprocessable_entity
      return true
    end
    false
  end

  def upload_file(file)
    csv_text = File.read(file).gsub(/\t/, "")
    csv = CSV.parse(csv_text, headers: true, skip_blanks: true)

    csv.each do |row|
      return if file_fields_missing?(row)

      category = Category.find_by(category: row[4])
      division = Division.find_by(division: row[5])

      return if category_and_division_invalid?(row, category, division)
    end

    csv.each do |row|
      category = Category.find_by(category: row[4])
      division = Division.find_by(division: row[5])

      Racer.create!(
        first_name: row[0],
        last_name: row[1],
        city: row[2],
        email: row[3],
        category_id: category.id,
        division_id: division.id,
        age: row[6],
        sex: category.sex
      )
    end
    render json: { message: "Racers imported successfully" }, status: :ok
  end
end
