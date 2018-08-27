class ShadersController < ApplicationController

  skip_before_action :check_xhr
  before_action :set_shader, only: [:show, :edit, :update, :destroy, :bktree]
  layout "shaders"

  # GET /shaders
  def index
    puts "\n\n\n\n\n-----------------shadercontroller --------------------\n\n\n\n\n\n\n"
    #게시글 타입 : 최근글, 즐겨찾기, 내글
    @type = params[:type]
    @keyword = params[:keyword].nil? ? '': params[:keyword]

    case @type
      #즐겨찾기
      when 'bookmark'
	@bookmarks = ShaderBookmark.where(user_id: current_user.id).pluck(:shader_id)
	puts "\n\n\n\n-----------------------"
	puts @bookmarks
	puts "--------------\n\n\n\n\n"
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
    @last_page = (@total_count % 9)!=0 ? (@total_count / 9) + 1 : (@total_count / 9)    
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
    offset = (@p - 1) * 9
    offset = 0 if offset < 0

    @shaders = @shaders.offset(offset).limit(9)
  end

  # GET /shaders/1
  def show
	@shader_like = ShaderLike.where(shader_id: params[:id], user_id: current_user.id).exists?
	@shader_bookmark = ShaderBookmark.where(shader_id: params[:id], user_id: current_user.id).exists?
  end

  # GET /shaders/new
  def new
    @shader = Shader.new
    @user_id = current_user.id
    
  end

  # GET /shaders/1/edit
  def edit
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
      redirect_to @shader, notice: 'Shader was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /shaders/1
  def destroy
    @shader.destroy
    redirect_to shaders_url, notice: 'Shader was successfully destroyed.'
  end

  def bktree
    
    puts "\n\n\n ajax connect success \n\n\n\n"

    if @shader.vertex_text.nil? || @shader.fragment_text.nil? || @shader.fbx_text.nil? || @shader.dat_gui_text.nil?
	render json: {error: 'data_empty'}
    else
    	render json: @shader
    end
    
  end

  def quick
    puts "\n\n\n\n-------------quick-----------------\n\n\n\n"
    @shader = Shader.new
    @user_id = current_user.id

    @fbx_file = params[:fbxFile]
    @vertex_file = params[:vertexFile]
    @fragment_file = params[:fragFile]

    render 'shaders/new'
  end

  def user_action
    puts "\n\n\n ajax connect success user_action\n\n\n\n"
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shader
      @shader = Shader.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def shader_params
      params.require(:shader).permit(:fbx_text, :vertex_text, :fragment_text, :dat_gui_text, :img_data, :title, :content)
    end
end
