class Category < ApplicationRecord
  has_many :racers
  validates :sex, :category, presence: true
  validates :min_age, numericality: { only_integer: true }
  validates :max_age, numericality: { only_integer: true }
end
