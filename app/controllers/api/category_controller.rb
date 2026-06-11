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

  def clear_existing
    file = params[:file]
    destroyed = Category.destroy_all

    if destroyed.any? { |div| div.errors.any? }
      render json: {
        error: "Can't delete a category with racers assigned to it.
          Please reassign racers' categories, then try again."
        },
        status: :unprocessable_entity

      return
    end

    upload_file(file)

    if Category.count > 0
      render json: { message: "Uploaded" }, status: :ok
    else
      render json: { error: "Could not upload" }, status: :unprocessable_entity
    end
  end

  def clear_existing
    file = params[:file]
    importer = CategoryImporter.new(file)
    checked_file = importer.validate_file("clear")
    unless checked_file.success?
      return render json: { error: checked_file.error }, status: :unprocessable_entity
    end

    destroyed = Category.destroy_all

    if destroyed.any? { |div| div.errors.any? }
      render json: { error: "Cannot delete categories" }, status: :unprocessable_entity
      return
    end

    result = importer.call

    if result.success?
      render json: { message: "Categories imported successfully" }, status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  def merge
    file = params[:file]
    importer = CategoryImporter.new(file)
    checked_file = importer.validate_file("merge")
    unless checked_file.success?
      return render json: { error: checked_file.error }, status: :unprocessable_entity
    end

    result = importer.call
    if result.success?
      render json: { message: "Categories merged successfully" }, status: :ok
    else
      render json: { error: result.error }, status: :unprocessable_entity
    end
  end

  def destroy
    cat = Category.find(params[:id])

    if cat.destroy
      render json: { message: "Category deleted" }, status: :ok
    else
      render json: {
        error: "Can't delete a category with racers assigned to it.
          Please reassign racers' categories then try again."
        },
        status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:category, :sex, :min_age, :max_age)
  end

  def upload_file(file)
    csv_text = File.read(file).gsub(/\t/, "")
    csv = CSV.parse(csv_text, headers: true, skip_blanks: true)

    csv.each do |row|
      Category.create!({ category: row[0] })
    end
  end
end
