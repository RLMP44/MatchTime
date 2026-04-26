class Racer < ApplicationRecord
  belongs_to :category
  belongs_to :division
  validates :first_name, :last_name, :sex, :category, :division, :age, presence: true, unless: :placeholder?
  validates :age, numericality: { only_integer: true }
  validates :handicap, numericality: true, unless: -> { handicap.blank? }
  validates :bib, numericality: { only_integer: true }, unless: -> { bib.blank? }
  validates :place, numericality: { only_integer: true }, unless: -> { place.blank? }
  validates :time_raw, numericality: true, unless: -> { time_raw.blank? }
  validates :email, uniqueness: true, allow_nil: true
  validates :first_name, uniqueness: { scope: :last_name,
                                       message: "Full name already used" }

  before_create :calculate_handicap, unless: :placeholder?
  after_create :assign_bib, unless: :placeholder?
  before_save :calculate_handicap, if: :needs_handicap_update?, unless: :placeholder?

  private

  def self.create_placeholder!(bib:, place:, time_raw:)
    racer = new({
      id: next_placeholder_id,
      first_name: nil,
      last_name: "Not Found",
      sex: nil,
      age: nil,
      city: nil,
      category_id: nil,
      division_id: nil,
      handicap: nil,
      bib: bib,
      place: place,
      time_raw: time_raw
    })
    racer.save(validate: false)
    racer
  end

  def self.next_placeholder_id
    (minimum(:id) || 0) - 1
  end

  def calculate_handicap
    self.handicap = HandicapService.factor(sex, age)
  end

  def needs_handicap_update?
    will_save_change_to_age? || will_save_change_to_sex?
  end

  def placeholder?
    id.present? && id < 0
  end

  def assign_bib
    update_column(:bib, id)
  end
end
