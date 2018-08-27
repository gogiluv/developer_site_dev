class CreateShaders < ActiveRecord::Migration[5.2]
  def change
    create_table :shaders do |t|
      t.integer :user_id
      t.text :fbx_text
      t.text :vertex_text
      t.text :fragment_text
      t.text :dat_gui_text
      t.string :img_url
      t.text :img_data
      t.string :title
      t.text :content
      t.integer :view_count
      t.integer :like_count
      t.integer :reply_count
      t.integer :bookmark_count

      t.timestamps
    end
  end
end
