# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_04_25_013832) do
  create_table "categories", force: :cascade do |t|
    t.string "category"
    t.string "sex"
    t.integer "min_age"
    t.integer "max_age"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "divisions", force: :cascade do |t|
    t.string "division"
    t.integer "race_no"
    t.datetime "start_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "racers", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "city"
    t.string "email"
    t.string "sex"
    t.integer "age"
    t.float "handicap"
    t.integer "bib"
    t.integer "place"
    t.float "time_raw"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "division_id"
    t.integer "category_id"
    t.index ["category_id"], name: "index_racers_on_category_id"
    t.index ["division_id"], name: "index_racers_on_division_id"
  end

  add_foreign_key "racers", "categories"
  add_foreign_key "racers", "divisions"
end
