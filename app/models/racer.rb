class Racer < ApplicationRecord
  belongs_to :category
  belongs_to :division
  validates :first_name, :last_name, :sex, :category, :division, :age, presence: true # :email
  validates :age, numericality: { only_integer: true }
  validates :handicap, numericality: true, unless: -> { handicap.blank? }
  validates :bib, numericality: { only_integer: true }, unless: -> { bib.blank? }
  validates :place, numericality: { only_integer: true }, unless: -> { place.blank? }
  validates :time_raw, numericality: true, unless: -> { time_raw.blank? }
  validates :email, uniqueness: true, allow_nil: true
  validates :first_name, uniqueness: { scope: :last_name,
                                       message: "Full name already used" }

  before_create :calculate_handicap
  after_create :assign_bib

  private

  def calculate_handicap
    self.handicap = HandicapService.factor(sex, age)
  end

  def assign_bib
    update_column(:bib, id)
  end
end
