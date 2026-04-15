class RemoveRacerRefFromCategory < ActiveRecord::Migration[7.2]
  def change
    remove_reference :categories, :racer, null: false, foreign_key: true
  end
end
