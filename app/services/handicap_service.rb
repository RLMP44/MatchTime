class HandicapService
  DATA = JSON.parse(
    Rails.root.join("config", "handicaps.json").read
  ).freeze

  def self.factor(sex, age)
    return if sex.blank? || age.blank?
    DATA[sex][age.to_s]
  end

  def self.calculate_time(time_in_s, sex, age)
    factor = self.factor(sex, age)
    (time_in_s * factor).round(2)
  end
end
