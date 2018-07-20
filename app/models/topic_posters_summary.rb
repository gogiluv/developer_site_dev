# This is used in topic lists
require_dependency 'topic_poster'

class TopicPostersSummary
  attr_reader :topic, :options

  def initialize(topic, options = {})
    @topic = topic
    @options = options

    @recent_post = Post.find_by_sql(['select distinct(t1.user_id), t1.anonymous_chk from (select user_id, created_at, anonymous_chk 
                                      from posts where topic_id=? and anonymous_chk=false order by created_at desc) as t1 limit 4', topic.id])
    @last_anonymous_post = Post.find_by_sql(['select user_id, anonymous_chk from posts where topic_id=? and anonymous_chk=true order by created_at desc limit 1', topic.id])
    @posters_from_post = @recent_post.concat(@last_anonymous_post)
  end

  def summary
    #sorted_top_posters.compact.map(&method(:new_topic_poster_for))
    new_topic_poster_for()
  end

  private

  def new_topic_poster_for()
    topic_posters = []
    @posters_from_post.each do |poster|      
      user = avatar_lookup[poster.user_id]
      TopicPoster.new.tap do |topic_poster|
        topic_poster.user = user
        topic_poster.description = descriptions_for(user)
        topic_poster.primary_group = primary_group_lookup[user.id]
        if topic.last_post_user_id == user.id
          topic_poster.extras = 'latest'
          topic_poster.extras << ' single' if user_ids.uniq.size == 1
        end
        topic_poster.anonymous_chk = poster.anonymous_chk
        topic_posters << topic_poster
      end      
    end
    topic_posters
  end

  def new_topic_poster_for_back2(uu)
    topic_posters = []
    @posters_from_post.each do |poster|      
      user = avatar_lookup[poster.user_id]
      TopicPoster.new.tap do |topic_poster|
        topic_poster.user = user
        topic_poster.description = descriptions_for(user)
        topic_poster.primary_group = primary_group_lookup[user.id]
        if topic.last_post_user_id == user.id
          topic_poster.extras = 'latest'
          topic_poster.extras << ' single' if user_ids.uniq.size == 1
        end
        topic_poster.anonymous_chk = poster.anonymous_chk
        topic_posters << topic_poster
      end      
    end
    topic_posters
  end

  def new_topic_poster_for_back(user)
    TopicPoster.new.tap do |topic_poster|
      topic_poster.user = user
      topic_poster.description = descriptions_for(user)
      topic_poster.primary_group = primary_group_lookup[user.id]
      if topic.last_post_user_id == user.id
        topic_poster.extras = 'latest'
        topic_poster.extras << ' single' if user_ids.uniq.size == 1
      end
      topic_poster.anonymous_chk = false
    end
  end

  def descriptions_by_id
    @descriptions_by_id ||= begin
      user_ids_with_descriptions.each_with_object({}) do |(id, description), descriptions|
        descriptions[id] ||= []
        descriptions[id] << description
      end
    end
  end

  def descriptions_for(user)
    descriptions_by_id[user.id].join ', '
  end

  def shuffle_last_poster_to_back_in_back(summary)
    unless last_poster_is_topic_creator?
      summary.reject! { |u| u.id == topic.last_post_user_id }
      summary << avatar_lookup[topic.last_post_user_id]
    end
    summary
  end

  def user_ids_with_descriptions
    user_ids.zip([
      :original_poster,
      :most_recent_poster,
      :frequent_poster,
      :frequent_poster,
      :frequent_poster,
      :frequent_poster
      ].map { |description| I18n.t(description) })
  end

  def last_poster_is_topic_creator?
    topic.user_id == topic.last_post_user_id
  end

  def sorted_top_posters
    shuffle_last_poster_to_back_in top_posters
  end

  def top_posters
    #user_ids.map { |id| avatar_lookup[id] }.compact.uniq.take(5)
    user_ids.map { |id| avatar_lookup[id] }.compact.take(5)
  end

  def user_ids
    posted_user_ids = []
    @posters_from_post.each do |poster|
      posted_user_ids << poster.user_id
    end
    posted_user_ids
    #[ topic.user_id, topic.last_post_user_id, *topic.featured_user_ids ]
  end

  def avatar_lookup
    @avatar_lookup ||= options[:avatar_lookup] || AvatarLookup.new(user_ids)
  end

  def primary_group_lookup
    @primary_group_lookup ||= options[:primary_group_lookup] || PrimaryGroupLookup.new(user_ids)
  end
end
