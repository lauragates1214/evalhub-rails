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

ActiveRecord::Schema[7.0].define(version: 2025_08_26_114900) do
  create_table "answers", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "course_question_id", null: false
    t.text "answer_text"
    t.json "selected_options", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_question_id"], name: "index_answers_on_course_question_id"
    t.index ["user_id", "course_question_id"], name: "index_answers_on_user_id_and_course_question_id", unique: true
    t.index ["user_id"], name: "index_answers_on_user_id"
  end

  create_table "course_questions", force: :cascade do |t|
    t.integer "course_id", null: false
    t.integer "question_id", null: false
    t.integer "position", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id", "position"], name: "index_course_questions_on_course_id_and_position"
    t.index ["course_id", "question_id"], name: "index_course_questions_on_course_id_and_question_id", unique: true
    t.index ["course_id"], name: "index_course_questions_on_course_id"
    t.index ["question_id"], name: "index_course_questions_on_question_id"
  end

  create_table "courses", force: :cascade do |t|
    t.integer "institution_id", null: false
    t.string "name", null: false
    t.text "description"
    t.string "access_code", null: false
    t.boolean "is_active", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["access_code"], name: "index_courses_on_access_code", unique: true
    t.index ["institution_id"], name: "index_courses_on_institution_id"
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["institution_id"], name: "index_users_on_institution_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "answers", "course_questions"
  add_foreign_key "answers", "course_questions"
  add_foreign_key "answers", "users"
  add_foreign_key "course_questions", "courses"
  add_foreign_key "course_questions", "courses"
  add_foreign_key "course_questions", "questions"
  add_foreign_key "courses", "institutions"
  add_foreign_key "questions", "institutions"
  add_foreign_key "users", "institutions"
end
