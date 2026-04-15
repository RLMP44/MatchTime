class AddDivisionRefToRacer < ActiveRecord::Migration[7.2]
  def change
    add_reference :racers, :division, null: false, foreign_key: true
  end
end
