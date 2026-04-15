class Api::DivisionController < ApplicationController
  def index
    render json: Division.all
  end

  def show
    render json: Division.find(params[:id])
  end
end
