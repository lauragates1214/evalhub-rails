class CreateEvaluationQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :evaluation_questions do |t|
      t.references :evaluation, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.integer :position, null: false, default: 1
      
      t.timestamps
    end
    
    add_index :evaluation_questions, [:evaluation_id, :question_id], unique: true
    add_index :evaluation_questions, [:evaluation_id, :position]
  end
end