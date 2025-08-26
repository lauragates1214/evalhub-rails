class RenameEvaluationsToCourses < ActiveRecord::Migration[7.0]
  def change
    # Rename evaluations table to courses
    rename_table :evaluations, :courses
    
    # Rename evaluation_questions table to course_questions
    rename_table :evaluation_questions, :course_questions
    
    # Rename foreign key columns
    rename_column :course_questions, :evaluation_id, :course_id
    rename_column :answers, :evaluation_question_id, :course_question_id
    
    # Update foreign key constraints
    remove_foreign_key :course_questions, :evaluations if foreign_key_exists?(:course_questions, :evaluations)
    add_foreign_key :course_questions, :courses
    
    remove_foreign_key :answers, :evaluation_questions if foreign_key_exists?(:answers, :evaluation_questions)
    add_foreign_key :answers, :course_questions
  end
end