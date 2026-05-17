require 'json'
require 'faker'

handicaps_path = Rails.root.join('config', 'handicaps.json')
HANDICAPS = JSON.parse(File.read(handicaps_path))

return if Rails.env.test?

# create divisions
races = [ [ 1, '5k', '10:00' ], [ 2, '10k', '09:30' ], [ 3, '15k', '09:00' ], [ 4, '21k', '08:00' ], [ 5, '42k', '06:30' ] ]
races.each do |race|
  Division.create!(division: race[1], race_no: race[0], start_time: race[2])
end

# create categories
categories = [
  { 'category' => 'F10-19' }, { 'category' => 'M10-19' },
  { 'category' => 'F20-29' }, { 'category' => 'M20-29' },
  { 'category' => 'F30-39' }, { 'category' => 'M30-39' },
  { 'category' => 'F40-49' }, { 'category' => 'M40-49' },
  { 'category' => 'F50-59' }, { 'category' => 'M50-59' },
  { 'category' => 'F60-69' }, { 'category' => 'M60-69' }
]
for category in categories do
  Category.create!(category: category['category'])
end

# create racers
30.times do
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
