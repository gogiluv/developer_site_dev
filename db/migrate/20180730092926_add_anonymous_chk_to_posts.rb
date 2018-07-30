class AddAnonymousChkToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :anonymous_chk, :boolean, default: false, null: false
  end
end
