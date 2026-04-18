FactoryBot.define do
  factory :racer do
    first_name { "John" }
    last_name  { "Doe" }
    sex        { "M" }
    age        { 35 }

    association :category
    association :division

    email      { nil }
    handicap   { nil }
    bib        { nil }
    place      { nil }
    time_raw   { nil }
  end
end
