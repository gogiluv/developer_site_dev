class ShadersController < ApplicationController

  skip_before_action :check_xhr
  before_action :set_shader, only: [:show, :edit, :update, :destroy]
  layout "shaders"

  # GET /shaders
  def index
    puts "\n\n\n\n\n-----------------shadercontroller --------------------\n\n\n\n\n\n\n"
    @shaders = Shader.all   
  end

  # GET /shaders/1
  def show
  end

  # GET /shaders/new
  def new
    @shader = Shader.new
  end

  # GET /shaders/1/edit
  def edit
  end

  # POST /shaders
  def create
    @shader = Shader.new(shader_params)

    if @shader.save
      redirect_to @shader, notice: 'Shader was successfully created.'
    else
      render :new
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
    render layout: "bktree"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shader
      @shader = Shader.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def shader_params
      params.require(:shader).permit(:user_id, :fbx_text, :vertex_text, :fragment_text, :dat_gui_text, :img_url)
    end
end
