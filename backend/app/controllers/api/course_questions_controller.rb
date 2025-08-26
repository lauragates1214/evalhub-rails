class Api::CourseQuestionsController < Api::BaseController
  self.finder_resource_name = :course_question
  setup_resource_finder

  before_action :find_resource, only: [:show, :update, :destroy]
  before_action :require_instructor!

  def index
    # Get course from params for index action
    course = Course.find(params[:course_id])
    course_questions = course.course_questions.includes(:question).order(:position)
    
    render_success("Course questions retrieved successfully", {
      course_questions: course_questions.as_json(include: :question)
    })
  end

  def show
    render_success("Course question retrieved successfully", {
      course_question: @resource.as_json(include: :question)
    })
  end

  def create
    # Use join table creation logic from BaseController
    if is_join_table_resource?
      course_question = create_join_table_resource
      
      if course_question.save
        render_success("Question added to course successfully", {
          course_question: course_question.as_json(include: :question)
        }, :created)
      else
        raise ActiveRecord::RecordInvalid.new(course_question)
      end
    else
      render_error("Invalid resource type", :bad_request)
    end
  end

  def update
    # Use join table update logic from BaseController
    return if update_join_table_resource
    
    # Fallback to standard update if not handled by join table logic
    if @resource.update(course_question_params)
      render_success("Course question updated successfully", {
        course_question: @resource.as_json(include: :question)
      })
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end

  def destroy
    # Use join table destroy logic from BaseController
    return if destroy_join_table_resource
    
    # Fallback to standard destroy if not handled by join table logic
    @resource.destroy
    render_success("Question removed from course successfully")
  end

  private

  def course_question_params
    params.require(:course_question).permit(:question_id, :position, :is_modified)
  end

  # Override permitted_params for join table handling
  def permitted_params
    course_question_params
  end
end