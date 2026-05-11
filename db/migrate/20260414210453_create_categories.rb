class CreateCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :categories do |t|
      t.string :category
      t.string :sex
      t.integer :min_age
      t.integer :max_age
      t.references :racer, null: false, foreign_key: true

      t.timestamps
    end
  end
end
