class ShaderCommentSerializer < ApplicationSerializer
  attributes :id, :content, :seq, :user_id, :username, :avatar_template, :editable, :created_at, :updated_at


  def avatar_template
    user.avatar_template.gsub("{size}", "45")
  end

  def username
    user.username
  end

  def user_id
    user.id
  end

  def editable
    if scope.current_user
      if user.id == scope.current_user.id
        return true
      end
    end

    false    
  end

  def user
    object.user
  end

  def created_at
    object.created_at.in_time_zone('Seoul').strftime('%F %T')
  end

  def updated_at
    object.created_at.in_time_zone('Seoul').strftime('%F %T')
  end

end
