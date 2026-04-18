require 'json'
require 'faker'

handicaps_path = Rails.root.join('config', 'handicaps.json')
HANDICAPS = JSON.parse(File.read(handicaps_path))

# create divisions
races = [ [ 1, '5k' ], [ 2, '10k' ], [ 3, '15k' ], [ 4, '21k' ], [ 5, '42k' ] ]
races.each do |race|
  Division.create!(division: race[1], race_no: race[0])
end

# create categories
categories = [
  { 'category' => 'F10-19', 'sex' => 'F', 'min_age' => 10, 'max_age' => 19 },
  { 'category' => 'M10-19', 'sex' => 'M', 'min_age' => 10, 'max_age' => 19 },
  { 'category' => 'F20-29', 'sex' => 'F', 'min_age' => 20, 'max_age' => 29 },
  { 'category' => 'M20-29', 'sex' => 'M', 'min_age' => 20, 'max_age' => 29 },
  { 'category' => 'F30-39', 'sex' => 'F', 'min_age' => 30, 'max_age' => 39 },
  { 'category' => 'M30-39', 'sex' => 'M', 'min_age' => 30, 'max_age' => 39 },
  { 'category' => 'F40-49', 'sex' => 'F', 'min_age' => 40, 'max_age' => 49 },
  { 'category' => 'M40-49', 'sex' => 'M', 'min_age' => 40, 'max_age' => 49 },
  { 'category' => 'F50-59', 'sex' => 'F', 'min_age' => 50, 'max_age' => 59 },
  { 'category' => 'M50-59', 'sex' => 'M', 'min_age' => 50, 'max_age' => 59 },
  { 'category' => 'F60-69', 'sex' => 'F', 'min_age' => 60, 'max_age' => 69 },
  { 'category' => 'M60-69', 'sex' => 'M', 'min_age' => 60, 'max_age' => 69 }
]
for category in categories do
  Category.create!(
    category: category['category'],
    sex: category['sex'],
    min_age: category['min_age'],
    max_age: category['max_age'],
  )
end

# create racers
10.times do
  name_array = Faker::Name.name.split(' ')
  div = Division.all.sample
  cat = Category.all.sample
  age = rand(cat.min_age..cat.max_age)
  Racer.create!(
    first_name: name_array[0],
    last_name: name_array[1],
    city: Faker::Locations::Australia.location,
    email: Faker::Internet.email,
    sex: cat.sex,
    age: age,
    division: div,
    category: cat,
    handicap: HANDICAPS[cat.sex][age.to_s],
    place: nil,
    time_raw: nil
  )
end
