class Api::CategoryController < Api::ApplicationController
  def index
    render json: Category.all.order(:id)
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

  def update
    cat = Category.find(params[:id])

    if cat.update(category_params)
      render json: cat, status: :ok
    else
      render json: cat.errors, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:category, :sex, :min_age, :max_age)
  end
end
