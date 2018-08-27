class CreateShaderLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :shader_likes do |t|
      t.integer :shader_id
      t.integer :user_id

      t.timestamps
    end
  end
end
