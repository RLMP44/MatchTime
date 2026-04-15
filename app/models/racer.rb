class Racer < ApplicationRecord
  belongs_to :category
  belongs_to :division
  validates :first_name, :last_name, :email, :sex, :category, :division, :age, presence: true
  validates :age, numericality: { only_integer: true }
  validates :handicap, numericality: true, unless: -> { handicap.blank? }
  validates :bib, numericality: { only_integer: true }, unless: -> { bib.blank? }
  validates :place, numericality: { only_integer: true }, unless: -> { place.blank? }
  validates :time_raw, numericality: true, unless: -> { time_raw.blank? }
  validates :email, uniqueness: true
  validates :first_name, uniqueness: { scope: [ :last_name, :email ],
                                       message: "Full name already used with this email" }
  validates :email, uniqueness: { scope: [ :first_name, :last_name ],
                                  message: "Email already used by someone with this name" }

  after_create :assign_bib

  private

  def assign_bib
    update_column(:bib, id)
  end
end
