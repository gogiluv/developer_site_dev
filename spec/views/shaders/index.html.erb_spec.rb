require 'rails_helper'

RSpec.describe "shaders/index", type: :view do
  before(:each) do
    assign(:shaders, [
      Shader.create!(
        :user_id => "",
        :fbx_text => "MyText",
        :vertex_text => "MyText",
        :fragment_text => "MyText",
        :dat_gui_text => "MyText",
        :img_url => "Img Url"
      ),
      Shader.create!(
        :user_id => "",
        :fbx_text => "MyText",
        :vertex_text => "MyText",
        :fragment_text => "MyText",
        :dat_gui_text => "MyText",
        :img_url => "Img Url"
      )
    ])
  end

  it "renders a list of shaders" do
    render
    assert_select "tr>td", :text => "".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
    assert_select "tr>td", :text => "Img Url".to_s, :count => 2
  end
end
