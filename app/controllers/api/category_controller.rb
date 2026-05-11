class Api::CategoryController < Api::ApplicationController
  def index
    render json: Category.all
  end

  def create
    cat = Category.new(category_params)

    if cat.save
      render json: cat, status: :created
    else
      render json: { errors: cat.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: Category.find(params[:id])
  end

  private

  def category_params
    params.require(:category).permit(:category, :sex, :min_age, :max_age)
  end
end
