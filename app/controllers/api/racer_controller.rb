require "ostruct"

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
    file = params[:file]
    importer = RacerImporter.new(file)
    checked_file = importer.validate_file
    unless checked_file.success?
      return render json: { error: checked_file.error }, status: :unprocessable_entity
    end

    destroyed = Racer.destroy_all

    if destroyed.any? { |div| div.errors.any? }
      render json: { error: "Cannot delete racers" }, status: :unprocessable_entity
      return
    end

    result = importer.call

    if result.success?
      render json: { message: "Racers imported successfully" }, status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  def merge
    file = params[:file]
    result = RacerImporter.new(file).call

    if result.success?
      render json: { message: "Racers imported successfully" }, status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
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
end
