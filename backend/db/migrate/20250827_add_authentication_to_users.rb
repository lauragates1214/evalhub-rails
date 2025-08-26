class AddAuthenticationToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :password_digest, :string
    add_index :users, :email, unique: true
    
    # Make email required (but allow existing records without email)
    change_column_null :users, :email, true
  end
end