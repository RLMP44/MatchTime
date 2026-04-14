class Racer < ApplicationRecord
  has_one :category
  validates :first_name, :last_name, :email, :sex, :category, :age, presence: true
  validates :age, :bib, :place, numericality: { only_integer: true }
  validates :handicap, :time_raw, numericality: true
  validates :email, uniqueness: true
  validates :first_name, uniqueness: { scope: [ :last_name, :email ],
                                       message: "Full name already used with this email" }
  validates :email, uniqueness: { scope: [ :first_name, :last_name ],
                                  message: "Email already used by someone with this name" }
end
