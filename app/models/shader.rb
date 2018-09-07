class Shader < ActiveRecord::Base
	belongs_to :user
	has_many :shader_like
	has_many :shader_bookmark
end
