require "csv"

class Api::DivisionController < Api::ApplicationController
  def index
    render json: Division.all
  end

  def create
    div = Division.new(division_params)

    if div.save
      render json: div, status: :created
    else
      render json: { errors: div.errors.full_messages },
        status: :unprocessable_entity
    end
  end

  def show
    render json: Division.find(params[:id])
  end

  def update
    div = Division.find(params[:id])

    if div.update(division_params)
      render json: div, status: :ok
    else
      render json: div.errors, status: :unprocessable_entity
    end
  end

  def clear_existing
    file = params[:division]
    destroyed = Division.destroy_all

    if destroyed.any? { |div| div.errors.any? }
      render json: {
        error: "Can't delete a division with racers assigned to it.
          Please reassign racers' divisions, then try again."
        },
        status: :unprocessable_entity

      return
    end

    upload_file(file)

    if Division.count > 0
      render json: { message: "Uploaded" }, status: :ok
    else
      render json: { error: "Could not upload" }, status: :unprocessable_entity
    end
  end

  def merge
    puts params
    file = params[:division]
    upload_file(file)
  end

  def destroy
    div = Division.find(params[:id])

    if div.destroy
      render json: { message: "Division deleted" }, status: :ok
    else
      render json: {
        error: "Can't delete a division with racers assigned to it.
          Please reassign racers' divisions, then try again."
        },
        status: :unprocessable_entity
    end
  end

  private

  def division_params
    params.require(:division).permit(:division, :race_no, :start_time)
  end

  def upload_file(file)
    csv_text = File.read(file).gsub(/\t/, "")
    csv = CSV.parse(csv_text, headers: true, skip_blanks: true)

    csv.each do |row|
      Division.create!({
        division: row[0],
        race_no: row[1].to_i,
        start_time: row[2]
      })
    end
  end
end
