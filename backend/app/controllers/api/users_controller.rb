class Api::UsersController < Api::BaseController
  self.finder_resource_name = :user
  setup_resource_finder

  skip_before_action :authenticate_request, only: [:authenticate, :create]
  before_action :find_resource, only: [:show]
  
  def show
    render_success("User retrieved successfully", { user: @resource })
  end
  
  def create
    # Get institution from params for create action
    institution = Institution.find(params[:institution_id])
    user = institution.users.build(user_params)
    
    if user.save
      session_data = SessionManager.create_user_session(user)
      render_success("User created successfully", session_data, :created)
    else
      raise ActiveRecord::RecordInvalid.new(user)
    end
  end
  
  def authenticate
    # Get institution from params for authenticate action
    institution = Institution.find(params[:institution_id])
    user = institution.users.find_by(name: params[:name])
    
    unless user
      user = institution.users.create(
        name: params[:name],
        role: params[:role] || 'student'
      )
    end
    
    if user.persisted?
      session_data = SessionManager.create_user_session(user)
      render_success("Authentication successful", session_data)
    else
      raise ActiveRecord::RecordInvalid.new(user)
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :role)
  end
end