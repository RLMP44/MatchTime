class TestSupport::CategoryController < ApplicationController
  skip_forgery_protection

  def index
    render json: Category.all
  end

  def create
    category = FactoryBot.create(:category, **category_params)
    render json: category
  end

  def update
    category = Category.find(params[:id])

    if category.update(category_params)
      render json: category, status: :ok
    end
  end

  def destroy
    Category.find(params[:id]).destroy
    head :no_content
  end

  def destroy_all
    Category.delete_all
    head :no_content
  end

  private

  def category_params
    params.require(:category).permit(
      :category,
      :sex,
      :min_age,
      :max_age
    )
  end
end
