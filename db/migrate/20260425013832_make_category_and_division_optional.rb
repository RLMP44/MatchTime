class MakeCategoryAndDivisionOptional < ActiveRecord::Migration[7.2]
  def change
    change_column_null :racers, :category_id, true
    change_column_null :racers, :division_id, true
  end
end
