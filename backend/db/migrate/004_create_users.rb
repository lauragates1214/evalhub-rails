class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.references :institution, null: false, foreign_key: true
      t.string :name, null: false
      t.string :role, null: false, default: 'student'
      t.string :session_token
      
      t.timestamps
    end
    
    add_index :users, :session_token, unique: true
  end
end