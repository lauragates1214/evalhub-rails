class MigrateExistingUsersToDevise < ActiveRecord::Migration[7.0]
  def up
    # Ensure all existing users have encrypted_password
    User.find_each do |user|
      # Skip if already has encrypted_password
      next if user.encrypted_password.present?
      
      # Set a secure random password for users without one
      # This is mainly for students who don't need passwords
      random_password = SecureRandom.hex(16)
      user.update_columns(
        encrypted_password: User.new(password: random_password).encrypted_password
      )
    end
    
    # Ensure email field has proper default for existing records
    User.where(email: nil).update_all(email: '')
  end
  
  def down
    # This migration is not reversible since we're generating passwords
    # But we can at least rename the column back
  end
end