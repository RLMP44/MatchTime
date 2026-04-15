class Api::RacerController < ApplicationController
  def index
    render json: Racer.all
  end

  def show
    render json: Racer.find(params[:id])
  end
end
