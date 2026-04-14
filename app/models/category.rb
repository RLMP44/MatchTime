class Category < ApplicationRecord
  belongs_to :racer
  has_one :division
  validates :sex, :category, :division, presence: true
  validates :min_age, numericality: { only_integer: true }
  validates :max_age, numericality: { only_integer: true }
end
