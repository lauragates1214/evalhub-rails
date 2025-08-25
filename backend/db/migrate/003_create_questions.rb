class CreateQuestions < ActiveRecord::Migration[6.1]
  def change
    create_table :questions do |t|
      t.references :institution, null: false, foreign_key: true
      t.text :question_text, null: false
      t.string :question_type, null: false
      t.json :options, default: []
      
      t.timestamps
    end
    
    add_index :questions, :institution_id
  end
end