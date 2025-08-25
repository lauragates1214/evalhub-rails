class CreateInstitutions < ActiveRecord::Migration[6.1]
  def change
    create_table :institutions do |t|
      t.string :name, null: false
      t.text :description
      
      t.timestamps
    end
    
    add_index :institutions, :name, unique: true
  end
end