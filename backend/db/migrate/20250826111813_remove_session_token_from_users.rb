class RemoveSessionTokenFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_index :users, :session_token if index_exists?(:users, :session_token)
    remove_column :users, :session_token, :string
  end
end
