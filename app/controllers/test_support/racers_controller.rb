class TestSupport::RacersController < ApplicationController
  def create
    racer = FactoryBot.create(:racer, **racer_params)
    render json: racer
  end

  def destroy
    Racer.find(params[:id]).destroy
    head :no_content
  end

  private

  def racer_params
    params.require(:racer).permit(:first_name, :last_name, :bib, :place, :time_raw)
  end
end
