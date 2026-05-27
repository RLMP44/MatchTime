FactoryBot.define do
  factory :category do
    sex { "M" }
    category { "M40-49" }
    min_age { 40 }
    max_age { 49 }
  end
end
