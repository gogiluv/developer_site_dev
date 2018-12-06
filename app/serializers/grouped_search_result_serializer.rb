class GroupedSearchResultSerializer < ApplicationSerializer
  has_many :posts, serializer: SearchPostSerializer
  has_many :users, serializer: SearchResultUserSerializer
  has_many :categories, serializer: BasicCategorySerializer
  has_many :tags, serializer: TagSerializer
  attributes :more_posts, :more_users, :more_categories, :term, :search_log_id, :more_full_page_results, :can_create_topic, :total_count, :total_page

  def search_log_id
    object.search_log_id
  end

  def include_search_log_id?
    search_log_id.present?
  end

  def include_tags?
    SiteSetting.tagging_enabled
  end

  def can_create_topic
    scope.can_create?(Topic)
  end

  def total_page
    # 검색결과가 3이하면 그냥 1
    if total_count <= 3
      return 1
    end
    # 페이지가 딱떨어지지 않으면 +1
    if (total_count % 3)==0
      return total_count / 3
    else
      return (total_count / 3) + 1  
    end
  end

end
