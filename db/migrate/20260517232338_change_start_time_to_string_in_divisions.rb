class ChangeStartTimeToStringInDivisions < ActiveRecord::Migration[7.2]
  def change
    change_column :divisions, :start_time, :string
  end
end
