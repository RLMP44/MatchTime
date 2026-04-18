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
    racer = Racer.new(racer_params)

    if racer.save
      render json: racer, status: :created
    else
      render json: { errors: racer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: Racer.find(params[:id])
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
      :handicap,
      :place,
      :time_raw,
      :category_id,
      :division_id
    )
  end
end
