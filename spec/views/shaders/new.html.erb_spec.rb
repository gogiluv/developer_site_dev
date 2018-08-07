require 'rails_helper'

RSpec.describe "shaders/new", type: :view do
  before(:each) do
    assign(:shader, Shader.new(
      :user_id => "",
      :fbx_text => "MyText",
      :vertex_text => "MyText",
      :fragment_text => "MyText",
      :dat_gui_text => "MyText",
      :img_url => "MyString"
    ))
  end

  it "renders new shader form" do
    render

    assert_select "form[action=?][method=?]", shaders_path, "post" do

      assert_select "input[name=?]", "shader[user_id]"

      assert_select "textarea[name=?]", "shader[fbx_text]"

      assert_select "textarea[name=?]", "shader[vertex_text]"

      assert_select "textarea[name=?]", "shader[fragment_text]"

      assert_select "textarea[name=?]", "shader[dat_gui_text]"

      assert_select "input[name=?]", "shader[img_url]"
    end
  end
end
