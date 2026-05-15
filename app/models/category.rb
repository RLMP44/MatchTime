class Category < ApplicationRecord
  has_many :racers, dependent: :restrict_with_error
  validates :sex, :category, presence: true
  validates :min_age, numericality: { only_integer: true }
  validates :max_age, numericality: { only_integer: true }

  before_validation :set_min_max_age, :set_sex

  private

  def set_min_max_age
    return unless category.present?

    # "M20-29" → ["M20", "29"]
    array = category.split("-")
    nil unless array.size == 2
    self.min_age = array[0].scan(/\d+/).first.to_i
    self.max_age = array[1].to_i
  end

  def set_sex
    return unless category.present?
    return if sex.present?

    # "M20-29" →"M"
    self.sex = category[0]
  end
end
