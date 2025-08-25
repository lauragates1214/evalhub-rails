class CreateAnswers < ActiveRecord::Migration[6.1]
  def change
    create_table :answers do |t|
      t.references :user, null: false, foreign_key: true
      t.references :evaluation_question, null: false, foreign_key: true
      t.text :answer_text
      t.json :selected_options, default: []
      
      t.timestamps
    end
    
    add_index :answers, [:user_id, :evaluation_question_id], unique: true
    add_index :answers, :evaluation_question_id
  end
end