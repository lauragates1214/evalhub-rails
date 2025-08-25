module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request, except: [:authenticate]
    attr_reader :current_user
  end

  private

  def authenticate_request
    token = extract_token_from_header
    
    unless token
      render_unauthorized("Missing authorization token")
      return
    end

    @current_user = SessionManager.validate_session_token(token)
    
    unless @current_user
      render_unauthorized("Invalid or expired session token")
      return
    end
  end

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    # Support both "Bearer token" and just "token" formats
    if auth_header.start_with?('Bearer ')
      auth_header.sub('Bearer ', '')
    else
      auth_header
    end
  end

  def authenticate_user!
    return if @current_user
    
    authenticate_request
  end

  def user_authenticated?
    @current_user.present?
  end

  def require_instructor!
    authenticate_user!
    return if @current_user&.instructor?
    
    render_forbidden("Instructor access required")
  end

  def require_student_or_instructor!
    authenticate_user!
    return if @current_user&.student? || @current_user&.instructor?
    
    render_forbidden("Student or instructor access required")
  end

  def can_access_evaluation?(evaluation)
    return false unless @current_user && evaluation
    SessionManager.can_access_evaluation?(@current_user, evaluation)
  end

  def can_manage_evaluation?(evaluation)
    return false unless @current_user && evaluation
    SessionManager.can_manage_evaluation?(@current_user, evaluation)
  end

  def require_evaluation_access!(evaluation)
    unless can_access_evaluation?(evaluation)
      render_forbidden("You don't have access to this evaluation")
      return false
    end
    true
  end

  def require_evaluation_management!(evaluation)
    unless can_manage_evaluation?(evaluation)
      render_forbidden("You don't have permission to manage this evaluation")
      return false
    end
    true
  end

  def verify_resource_ownership!(resource, user_method = :user)
    resource_user = resource.send(user_method)
    
    return true if resource_user == @current_user
    return true if @current_user&.instructor?
    
    render_forbidden("You can only access your own #{resource.class.name.downcase.pluralize}")
    false
  end

  def render_unauthorized(message = "Authentication required")
    render_error(message, :unauthorized)
  end

  def render_forbidden(message = "Access forbidden")
    render_error(message, :forbidden)
  end

  def current_institution
    @current_user&.institution
  end

  def ensure_same_institution!(resource)
    return true unless @current_user
    
    resource_org = case resource.class.name
                   when 'Institution'
                     resource
                   when 'Evaluation'
                     resource.institution
                   when 'Question'
                     resource.institution
                   when 'User'
                     resource.institution
                   else
                     nil
                   end
    
    return true unless resource_org
    
    if @current_user.institution != resource_org
      render_forbidden("You can only access resources from your institution")
      return false
    end
    
    true
  end
end