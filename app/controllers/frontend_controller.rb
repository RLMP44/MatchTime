class FrontendController < ApplicationController
  def index
    render file: Rails.root.join("public", "index.html")
  end

  def handicaps
    data = JSON.parse(Rails.root.join("config", "handicaps.json").read)
    render json: data
  end
end
