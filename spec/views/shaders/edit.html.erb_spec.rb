require 'rails_helper'

RSpec.describe "shaders/edit", type: :view do
  before(:each) do
    @shader = assign(:shader, Shader.create!(
      :user_id => "",
      :fbx_text => "MyText",
      :vertex_text => "MyText",
      :fragment_text => "MyText",
      :dat_gui_text => "MyText",
      :img_url => "MyString"
    ))
  end

  it "renders the edit shader form" do
    render

    assert_select "form[action=?][method=?]", shader_path(@shader), "post" do

      assert_select "input[name=?]", "shader[user_id]"

      assert_select "textarea[name=?]", "shader[fbx_text]"

      assert_select "textarea[name=?]", "shader[vertex_text]"

      assert_select "textarea[name=?]", "shader[fragment_text]"

      assert_select "textarea[name=?]", "shader[dat_gui_text]"

      assert_select "input[name=?]", "shader[img_url]"
    end
  end
end
