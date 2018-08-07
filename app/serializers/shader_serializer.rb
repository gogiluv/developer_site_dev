class ShaderSerializer < ApplicationSerializer
  attributes :id, :user_id, :fbx_text, :vertex_text, :fragment_text, :dat_gui_text, :img_url
end
