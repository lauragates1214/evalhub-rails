class Api::UsersController < Api::BaseController
  self.finder_resource_name = :user
  setup_resource_finder

  skip_before_action :authenticate_user!, only: [:authenticate, :create]
  before_action :find_resource, only: [:show]
  
  def show
    render_success("User retrieved successfully", { user: @resource })
  end
  
  def create
    # Get institution from params for create action
    institution = Institution.find(params[:institution_id])
    
    begin
      user = institution.users.build(user_params)
      
      # Set default password for students if not provided
      if user.student? && !user_params[:password].present?
        user.password = SecureRandom.hex(16)
      end
      
      if user.save
        # Don't sign in automatically for API - just return user data
        session_data = user_session_data(user)
        render_success("User created successfully", session_data, :created)
      else
        raise ActiveRecord::RecordInvalid.new(user)
      end
    rescue ArgumentError => e
      # Handle invalid enum values
      user = institution.users.build
      user.errors.add(:role, "is not valid")
      raise ActiveRecord::RecordInvalid.new(user)
    end
  end
  
  def authenticate
    # Get institution from params for authenticate action
    institution = Institution.find(params[:institution_id])
    
    # Support both email/password and name-only authentication
    if params[:email].present?
      # Email/password authentication (instructors)
      user = institution.users.find_by(email: params[:email])
      
      if user && user.valid_password?(params[:password])
        session_data = user_session_data(user)
        render_success("Authentication successful", session_data)
      else
        render_error("Invalid email or password", :unauthorized)
      end
    else
      # Legacy name-only authentication (students)
      user = institution.users.find_by(name: params[:name])
      
      unless user
        user = institution.users.create!(
          name: params[:name],
          role: params[:role] || 'student',
          email: nil, # Explicitly set to nil for students
          password: SecureRandom.hex(16) # Random password for students
        )
      end
      
      if user && user.persisted?
        session_data = user_session_data(user)
        render_success("Authentication successful", session_data)
      else
        render_error("Authentication failed", :unauthorized)
      end
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :role)
  end
  
  def user_session_data(user)
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: {
          id: user.institution.id,
          name: user.institution.name
        }
      },
      permissions: SessionManager.user_permissions(user)
    }.compact
  end
end