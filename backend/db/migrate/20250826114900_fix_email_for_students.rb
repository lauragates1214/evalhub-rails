class FixEmailForStudents < ActiveRecord::Migration[7.0]
  def up
    # Allow NULL values for email column
    change_column_null :users, :email, true
    # Change default to NULL instead of empty string
    change_column_default :users, :email, from: "", to: nil
    
    # Update existing students with empty email to NULL
    execute "UPDATE users SET email = NULL WHERE role = 'student' AND email = ''"
  end
  
  def down
    change_column_default :users, :email, from: nil, to: ""
    change_column_null :users, :email, false
  end
end
