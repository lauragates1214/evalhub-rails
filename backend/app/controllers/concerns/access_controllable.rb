module AccessControllable
  extend ActiveSupport::Concern

  private

  def require_instructor!
    return if current_user&.instructor?
    
    render_forbidden("Instructor access required")
  end

  def require_student_or_instructor!
    return if current_user&.student? || current_user&.instructor?
    
    render_forbidden("Student or instructor access required")
  end

  def can_access_course?(course)
    return false unless current_user && course
    SessionManager.can_access_course?(current_user, course) if defined?(SessionManager)
  end

  def can_manage_course?(course)
    return false unless current_user && course
    SessionManager.can_manage_course?(current_user, course) if defined?(SessionManager)
  end

  def require_course_access!(course)
    unless can_access_course?(course)
      render_forbidden("You don't have access to this course")
      return false
    end
    true
  end

  def require_course_management!(course)
    unless can_manage_course?(course)
      render_forbidden("You don't have permission to manage this course")
      return false
    end
    true
  end

  def verify_resource_ownership!(resource, user_method = :user)
    resource_user = resource.send(user_method)
    
    return true if resource_user == current_user
    return true if current_user&.instructor?
    
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
    current_user&.institution
  end

  def ensure_same_institution!(resource)
    return true unless current_user
    
    resource_org = case resource.class.name
                   when 'Institution'
                     resource
                   when 'Course'
                     resource.institution
                   when 'Question'
                     resource.institution
                   when 'User'
                     resource.institution
                   else
                     nil
                   end
    
    return true unless resource_org
    
    if current_user.institution != resource_org
      render_forbidden("You can only access resources from your institution")
      return false
    end
    
    true
  end
end