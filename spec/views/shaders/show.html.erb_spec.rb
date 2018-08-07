require 'rails_helper'

RSpec.describe "shaders/show", type: :view do
  before(:each) do
    @shader = assign(:shader, Shader.create!(
      :user_id => "",
      :fbx_text => "MyText",
      :vertex_text => "MyText",
      :fragment_text => "MyText",
      :dat_gui_text => "MyText",
      :img_url => "Img Url"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(//)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Img Url/)
  end
end
