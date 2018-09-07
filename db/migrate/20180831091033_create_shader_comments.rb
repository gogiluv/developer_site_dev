class CreateShaderComments < ActiveRecord::Migration[5.2]
  def change
    create_table :shader_comments do |t|
      t.integer :shader_id, null: false
      t.integer :user_id, null: false
      t.integer :seq, null: false
      t.string :content, null: false

      t.timestamps
    end
  end
end
