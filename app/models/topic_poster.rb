class TopicPoster < OpenStruct
  include ActiveModel::Serialization

  attr_accessor :user, :description, :extras, :id, :primary_group, :anonymous_chk

  def attributes
    {
      'user' => user,
      'description' => description,
      'extras' => extras,
      'id' => id,
      'primary_group' => primary_group,
      'anonymous_chk' => anonymous_chk
    }
  end

  # TODO: Remove when old list is removed
  def [](attr)
    send(attr)
  end
end
