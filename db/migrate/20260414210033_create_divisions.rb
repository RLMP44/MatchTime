class CreateDivisions < ActiveRecord::Migration[7.2]
  def change
    create_table :divisions do |t|
      t.string :division
      t.integer :race_no
      t.timestamp :start_time

      t.timestamps
    end
  end
end
