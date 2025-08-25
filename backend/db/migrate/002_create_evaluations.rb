class CreateEvaluations < ActiveRecord::Migration[6.1]
  def change
    create_table :evaluations do |t|
      t.references :institution, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.string :access_code, null: false
      t.boolean :is_active, default: false
      
      t.timestamps
    end
    
    add_index :evaluations, :access_code, unique: true
    add_index :evaluations, :institution_id
  end
end