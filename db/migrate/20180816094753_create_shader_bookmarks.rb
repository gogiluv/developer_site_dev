class CreateShaderBookmarks < ActiveRecord::Migration[5.2]
  def change
    create_table :shader_bookmarks do |t|
      t.integer :shader_id
      t.integer :user_id

      t.timestamps
    end
  end
end
