class CreateRacers < ActiveRecord::Migration[7.2]
  def change
    create_table :racers do |t|
      t.string :first_name
      t.string :last_name
      t.string :city
      t.string :email
      t.string :sex
      t.integer :age
      t.float :handicap
      t.integer :bib
      t.integer :place
      t.float :time_raw

      t.timestamps
    end
  end
end
