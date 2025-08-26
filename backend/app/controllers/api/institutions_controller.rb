class Api::InstitutionsController < Api::BaseController
  self.finder_resource_name = :institution
  setup_resource_finder

  skip_before_action :authenticate_user!, only: [:index, :show, :create]
  before_action :find_resource, only: [:show, :update, :destroy]
  before_action :require_instructor!, except: [:index, :show, :create]
  
  def index
    institutions = Institution.all
    render_success("Institutions retrieved successfully", { institutions: institutions })
  end
  
  def show
    render_success("Institution retrieved successfully", { institution: @resource })
  end
  
  def create
    institution = Institution.new(institution_params)
    
    if institution.save
      render_success("Institution created successfully", { institution: institution }, :created)
    else
      raise ActiveRecord::RecordInvalid.new(institution)
    end
  end
  
  def update
    if @resource.update(institution_params)
      render_success("Institution updated successfully", { institution: @resource })
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end
  
  def destroy
    @resource.destroy
    render_success("Institution deleted successfully")
  end
  
  private
  
  def institution_params
    params.require(:institution).permit(:name, :description)
  end
end