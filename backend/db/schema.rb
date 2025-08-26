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

ActiveRecord::Schema[7.0].define(version: 2025_08_25_164138) do
  create_table "answers", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "evaluation_question_id", null: false
    t.text "answer_text"
    t.json "selected_options", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["evaluation_question_id"], name: "index_answers_on_evaluation_question_id"
    t.index ["user_id", "evaluation_question_id"], name: "index_answers_on_user_id_and_evaluation_question_id", unique: true
    t.index ["user_id"], name: "index_answers_on_user_id"
  end

  create_table "evaluation_questions", force: :cascade do |t|
    t.integer "evaluation_id", null: false
    t.integer "question_id", null: false
    t.integer "position", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["evaluation_id", "position"], name: "index_evaluation_questions_on_evaluation_id_and_position"
    t.index ["evaluation_id", "question_id"], name: "index_evaluation_questions_on_evaluation_id_and_question_id", unique: true
    t.index ["evaluation_id"], name: "index_evaluation_questions_on_evaluation_id"
    t.index ["question_id"], name: "index_evaluation_questions_on_question_id"
  end

  create_table "evaluations", force: :cascade do |t|
    t.integer "institution_id", null: false
    t.string "name", null: false
    t.text "description"
    t.string "access_code", null: false
    t.boolean "is_active", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["access_code"], name: "index_evaluations_on_access_code", unique: true
    t.index ["institution_id"], name: "index_evaluations_on_institution_id"
  end

  create_table "institutions", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_institutions_on_name", unique: true
  end

  create_table "questions", force: :cascade do |t|
    t.integer "institution_id", null: false
    t.text "question_text", null: false
    t.string "question_type", null: false
    t.json "options", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["institution_id"], name: "index_questions_on_institution_id"
  end

  create_table "users", force: :cascade do |t|
    t.integer "institution_id", null: false
    t.string "name", null: false
    t.string "role", default: "student", null: false
    t.string "session_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.index ["institution_id"], name: "index_users_on_institution_id"
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  add_foreign_key "answers", "evaluation_questions"
  add_foreign_key "answers", "users"
  add_foreign_key "evaluation_questions", "evaluations"
  add_foreign_key "evaluation_questions", "questions"
  add_foreign_key "evaluations", "institutions"
  add_foreign_key "questions", "institutions"
  add_foreign_key "users", "institutions"
end
