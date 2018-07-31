class AddAnonymousChkToPosts < ActiveRecord::Migration[5.2]
  def change
    if !column_exists?(:posts, :anonymous_chk)
      execute("ALTER TABLE posts ADD COLUMN anonymous_chk boolean DEFAULT false NOT null")
    end
  end
end
