class ShadersController < ApplicationController

  skip_before_action :check_xhr
  before_action :login_chk, only: [:new, :edit, :create, :update, :destroy, :create_comment, :destroy_comment, :update_comment]
  before_action :set_shader, only: [:show, :edit, :update, :destroy, :bktree, :get_list_comment]
  before_action :set_comment, only: [:destroy_comment, :update_comment]
  #본인이 아니면 수행되선 안된다.
  before_action :shader_auth_chk, only: [:edit, :update, :destroy]
  before_action :comment_auth_chk, only: [:update_comment, :destroy_comment]
  layout "shaders"

  # GET /shaders
  def index
    #게시글 타입 : 최근글, 즐겨찾기, 내글
    @type = params[:type]
    @keyword = params[:keyword].nil? ? '': params[:keyword]

    case @type
      #즐겨찾기
      when 'bookmark'
	@bookmarks = ShaderBookmark.where(user_id: current_user.id).pluck(:shader_id)
	#@shaders = Shader.where(id: @bookmarks, title: @keyword).order('created_at desc')
	@shaders = Shader.where('id in (?) and title like ?', @bookmarks, '%'+@keyword+'%').order('created_at desc')
      #내글
      when 'my'
	@shaders = Shader.where('user_id=? and title like ?', current_user.id, '%'+@keyword+'%').order('created_at desc')
      #최근글
      else
	@shaders = Shader.where('title like ?', '%'+@keyword+'%').order('created_at desc')
    end

    @total_count = @shaders.count()
    @last_page = (@total_count % 12)!=0 ? (@total_count / 12) + 1 : (@total_count / 12)    
    # p = pagenumber, t = list type(index, bookmark, my)
    # 페이지 번호는 마지막 페이지 번호보다 클 수 없다.
    @p = params[:p].to_i > 0 ? params[:p].to_i : 1 
    @p = @last_page if @p > @last_page
    @t = params[:t].to_s ? params[:t].to_s : 'index'
        
    # 하단 페이지번호 배열
    @p_a = []
    for num in 0..4
	if (@p+num) > @last_page
		break
	end
	@p_a.push(@p+num)
    end
    
    # 노출될 게시물 갯수, 0보다 작을 수 없다
    offset = (@p - 1) * 12
    offset = 0 if offset < 0

    @shaders = @shaders.offset(offset).limit(12)
  end

  # GET /shaders/1
  def show
	# 버튼 노출 여부	
	@nomal_action_display = false
	@auth_action_display = false

	if current_user
		@shader_like = ShaderLike.where(shader_id: params[:id], user_id: current_user.id).exists?
		@shader_bookmark = ShaderBookmark.where(shader_id: params[:id], user_id: current_user.id).exists?
		@current_user_avatar_url = current_user.avatar_template.gsub("{size}", "45")

		@nomal_action_display = true
		
		if @shader.user_id == current_user.id
			@auth_action_display = true
		end
	end


	@board_state = 'show'
  end

  # GET /shaders/new
  def new
    @shader = Shader.new
    @user_id = current_user.id
    @board_state = "new"
    
  end

  # GET /shaders/1/edit
  def edit
    @user_id = current_user.id
    @board_state = 'edit'
  end

  # POST /shaders
  def create
    insert_data = shader_params
    insert_data[:user_id] = current_user.id
    #insert_data[:fbx_ba] = insert_data[:fbx_text].bytes.to_a
    @shader = Shader.new(insert_data)

    if @shader.save
      #redirect_to @shader, notice: 'Shader was successfully created.'
      render json: @shader
    else
      #render :new
      render json: {result: false}
    end
  end

  # PATCH/PUT /shaders/1
  def update
    if @shader.update(shader_params)
      #redirect_to @shader, notice: 'Shader was successfully updated.'
      render json: @shader
    else
      render json: {result: false}
    end
  end

  # DELETE /shaders/1
  def destroy

    ShaderComment.transaction do
	#댓글 삭제
	ShaderComment.where(shader_id: @shader.id).destroy_all
	#글 삭제
	@shader.destroy
    end
    render json: {:result => 'complete'}

    rescue => e
      render json: {:result => e.message}
  end

  #get
  def bktree
    if @shader.vertex_text.nil? || @shader.fragment_text.nil? || @shader.fbx_text.nil? || @shader.dat_gui_text.nil?
	render json: {error: 'data_empty'}
    else
    	render json: @shader
    end
    
  end

  def quick
    @shader = Shader.new
    @user_id = current_user.id

    @fbx_file = params[:fbxFile]
    @vertex_file = params[:vertexFile]
    @fragment_file = params[:fragFile]

    render 'shaders/new'
  end

  def user_action
    user_id = current_user.id
    shader_id = params[:shader_id]
    type =  params[:type]
    action_status = params[:action_status]
    
    Shader.transaction do
   
      if action_status == 'add'
        if type == 'like'
	  Shader.find(shader_id).increment(:like_count, 1).save!
          ShaderLike.new(:shader_id => shader_id, :user_id => user_id).save!
        elsif type == 'bookmark'
          ShaderBookmark.new(:shader_id => shader_id, :user_id => user_id).save!
        end
      else
        if type == 'like'
	  Shader.find(shader_id).decrement(:like_count, 1).save!
          ShaderLike.where(:shader_id => shader_id, :user_id => user_id).destroy_all
        elsif type == 'bookmark'
          ShaderBookmark.where(:shader_id => shader_id, :user_id => user_id).destroy_all
        end
      end
    end
    render json: {:result => 'complete'}

    rescue => e
      render json: {:result => e.message}
  end

  # start: def list about comment--------------------------------------------------
  #TODO 특정 코멘트 하나 가져오기
  def get_one_comment
  end

  def get_list_comment
    @list_comment = ShaderComment.where(shader_id: params[:id]).joins(:user).order(seq: :desc)
    
    render json: @list_comment
  end

  def create_comment
    last_comment = ShaderComment.where(shader_id: params[:id]).order(seq: :desc).first

    insert_data = comment_params
    insert_data[:user_id] = current_user.id
    insert_data[:seq] = last_comment.nil? ? 0 : (last_comment.seq + 1)

    @comment = ShaderComment.new(insert_data)
	
    if @comment.save
      render json: {resilt: 'success'}
    else
      render json: {result: false}
    end
  end

  def update_comment
    update_data = comment_params
    update_data[:id] = params[:comment_id]

    if @comment.update(update_data)  
      render json: {resilt: 'success'}
    else
      render json: {result: false}
    end
  end
   
  def destroy_comment
    if @comment.destroy
      render json: {result: true}
    else
      render json: {result: false}
    end
  end
  
  def get_user_info
     id = params[:id]
     # 유저기본 정보
     profile = User.find(id)

     # 작성한 쉐이더 수
     shader_count = Shader.where(user_id: id).count

     # 좋아요 받은 수
     receive_like_count = ShaderLike.where('shaders.user_id': id).joins(:shader).count
     
     # 좋아요 누른  수
     send_like_count = ShaderLike.where(user_id: id).count

     # 타인이 즐겨찾기 한 나의 글  수
     receive_bookmark_count = ShaderBookmark.where('shaders.user_id': id).joins(:shader).count

     # 내가 즐겨찾기 한 글 수
     send_bookmark_count = ShaderBookmark.where(user_id: id).count

     # 최근 작성한 글
     latest_shader = Shader.select(:id, :title, 
		'to_char(shaders.created_at at time zone \'utc\' at time zone \'kst\', \'YYYY-MM-DD\') as created_dt')
		.where('shaders.user_id': id).order(created_at: :desc).limit(5)

     # 최근 작성한 댓글
     latest_comment = ShaderComment.select('shaders.title', :id, :shader_id, :content, 
		'to_char(shader_comments.created_at at time zone \'utc\' at time zone \'kst\', \'YYYY-MM-DD\') as created_dt')
		.where(user_id: id).joins(:shader).order(created_at: :desc).limit(5)

     # 최근 즐겨찾기 한 글
     latest_bookmark = Shader.select(:id, :title, 
		'to_char(shaders.created_at at time zone \'utc\' at time zone \'kst\', \'YYYY-MM-DD\') as created_dt')
		.where('shaders.user_id': id).joins(:shader_bookmark).order(created_at: :desc).limit(5)

     render json: {
	'profile': {username: profile.username, avatar_template: profile.avatar_template.gsub('{size}', '90')},
	'shader_count': shader_count,
	'receive_like_count': receive_like_count,
	'send_like_count': send_like_count,
	'receive_bookmark_count': receive_bookmark_count,
	'send_bookmark_count': send_bookmark_count,
	'latest_shader': latest_shader.to_json,
	'latest_comment': latest_comment.to_json,
	'latest_bookmark': latest_bookmark.to_json
     }
     #render json: {resulta: 'success'}
  end
  
  def guide
  end

  # end: def list about comment----------------------------------------------------

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shader
      @shader = Shader.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def shader_params
      params.require(:shader).permit(:fbx_text, :vertex_text, :fragment_text, :dat_gui_text, :img_data, :title, :content)
    end

    def set_comment
	@comment = ShaderComment.find(params[:comment_id])
    end

    def comment_params
      params.require(:shader_comment).permit(:shader_id, :content)
    end
    
    # login check, if not logined, redirect to index
    def login_chk
	if current_user.nil?
          redirect_to '/shaders'
        end
    end
    # auth check, only self can update, destroy 
    def shader_auth_chk
	if @shader.user_id != current_user.id
		#권한이 없으면 index 로 리다이렉트
		respond_to do |format|
			format.html { redirect_to '/shaders' }
			format.json { render json: {:rsult => 'fail, auth error'} }
		end
	end
    end

    def comment_auth_chk
	if @comment.user_id != current_user.id
		#권한이 없으면 index 로 리다이렉트
		respond_to do |format|
			format.html { redirect_to '/shaders' }
			format.json { render json: {:rsult => 'fail, auth error'} }
		end
	end
    end
end
