class Api::DivisionController < Api::ApplicationController
  def index
    render json: Division.all
  end

  def create
    div = Division.new(division_params)

    if div.save
      render json: div, status: :created
    else
      render json: { errors: div.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: Division.find(params[:id])
  end

  private

  def division_params
    params.require(:division).permit(:division, :race_no, :start_time)
  end
end
