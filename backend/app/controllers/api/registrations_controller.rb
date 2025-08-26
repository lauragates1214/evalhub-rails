class Api::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def create
    institution = Institution.find(params[:institution_id])
    
    build_resource(sign_up_params)
    resource.institution = institution
    resource.role = params[:user][:role] || 'instructor' # Default to instructor for registration
    
    if resource.save
      sign_in(resource)
      render_success("User created successfully", user_session_data(resource), :created)
    else
      render_error(resource.errors.full_messages.join(", "), :unprocessable_entity)
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
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