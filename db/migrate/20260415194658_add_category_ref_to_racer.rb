class AddCategoryRefToRacer < ActiveRecord::Migration[7.2]
  def change
    add_reference :racers, :category, null: false, foreign_key: true
  end
end
