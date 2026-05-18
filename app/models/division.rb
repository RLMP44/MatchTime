class Division < ApplicationRecord
  has_many :racers, dependent: :restrict_with_error
  validates :race_no, presence: true, numericality: { only_integer: true }
  validates :division, presence: true
end
