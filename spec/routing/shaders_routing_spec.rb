require "rails_helper"

RSpec.describe ShadersController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/shaders").to route_to("shaders#index")
    end

    it "routes to #new" do
      expect(:get => "/shaders/new").to route_to("shaders#new")
    end

    it "routes to #show" do
      expect(:get => "/shaders/1").to route_to("shaders#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/shaders/1/edit").to route_to("shaders#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/shaders").to route_to("shaders#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/shaders/1").to route_to("shaders#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/shaders/1").to route_to("shaders#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/shaders/1").to route_to("shaders#destroy", :id => "1")
    end

  end
end
