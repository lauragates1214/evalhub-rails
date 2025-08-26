class SessionManager
  def self.create_user_session(user)
    user.generate_session_token!
    
    {
      user: user_data(user),
      session_token: user.session_token,
      expires_at: 7.days.from_now,
      permissions: user_permissions(user)
    }
  end
  
  def self.validate_session_token(token)
    return nil unless token.present?
    
    User.find_by(session_token: token)
  end
  
  def self.invalidate_session(user)
    user.update(session_token: nil) if user
  end
  
  def self.refresh_session(user)
    create_user_session(user)
  end
  
  def self.user_data(user)
    {
      id: user.id,
      name: user.name,
      email: user.email || nil,
      role: user.role,
      institution: {
        id: user.institution.id,
        name: user.institution.name
      }
    }
  end
  
  def self.user_permissions(user)
    base_permissions = %w[view_courses submit_answers view_own_answers]
    
    if user.instructor?
      base_permissions + %w[
        create_courses
        edit_courses
        delete_courses
        create_questions
        edit_questions
        delete_questions
        view_all_answers
        manage_users
        view_analytics
      ]
    else
      base_permissions
    end
  end
  
  def self.can_access_course?(user, course)
    return false unless user && course
    
    # Users can only access courses from their institution
    user.institution_id == course.institution_id
  end
  
  def self.can_manage_course?(user, course)
    return false unless can_access_course?(user, course)
    
    user.instructor?
  end
end