# frozen_string_literal: true

class TopicPosterSerializer < ApplicationSerializer
  attributes :extras, :description, :anonymous_chk
  has_one :user, serializer: BasicUserSerializer
  has_one :primary_group, serializer: PrimaryGroupSerializer
end
