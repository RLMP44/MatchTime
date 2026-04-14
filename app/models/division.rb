class Division < ApplicationRecord
  belongs_to :category
  validates :race_no, presence: true, numericality: { only_integer: true }
  validates :division, presence: true
end
