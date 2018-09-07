class ShaderLike < ActiveRecord::Base
	belongs_to :shader
        belongs_to :user
end
