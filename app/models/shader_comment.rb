class ShaderComment < ActiveRecord::Base
	belongs_to :user
	belongs_to :shader
end
