# This class provides helper methods for permissions and course access control
class SessionManager
  # Returns array of permission strings based on user role
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
  
  # Check if user can access a course (must be from same institution)
  def self.can_access_course?(user, course)
    return false unless user && course
    user.institution_id == course.institution_id
  end
  
  # Check if user can manage a course (must be instructor from same institution)
  def self.can_manage_course?(user, course)
    return false unless can_access_course?(user, course)
    user.instructor?
  end
  
  # Helper to format user data for API responses
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
end