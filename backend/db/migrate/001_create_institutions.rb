class CreateInstitutions < ActiveRecord::Migration[7.0]
  def change
    create_table :institutions do |t|
      t.string :name, null: false
      t.text :description
      
      t.timestamps
    end
    
    add_index :institutions, :name, unique: true
  end
end