class Api::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def create
    institution = Institution.find(params[:institution_id])
    
    # Support both instructor login (email/password) and student creation/login
    if params[:user][:email].present?
      # Instructor login with email/password
      user = institution.users.find_by(email: params[:user][:email])
      
      if user && user.valid_password?(params[:user][:password])
        sign_in(user)
        render_success("Authentication successful", user_session_data(user))
      else
        render_error("Invalid email or password", :unauthorized)
      end
    else
      # Student login/creation with just name (backward compatibility)
      user = institution.users.find_or_create_by(
        name: params[:user][:name],
        role: 'student'
      ) do |u|
        # Generate a random password for students
        u.password = SecureRandom.hex(16)
      end
      
      if user.persisted?
        sign_in(user)
        render_success("Authentication successful", user_session_data(user))
      else
        render_error("Authentication failed", :unauthorized)
      end
    end
  end

  def destroy
    if current_user
      sign_out(current_user)
      render_success("Signed out successfully", {})
    else
      render_error("No active session", :unauthorized)
    end
  end

  private

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
      permissions: SessionManager.user_permissions(user) if defined?(SessionManager)
    }.compact
  end

  def render_success(message, data, status = :ok)
    render json: { success: true, message: message, data: data }, status: status
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { success: false, message: message }, status: status
  end
end