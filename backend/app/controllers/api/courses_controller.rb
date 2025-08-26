class Api::CoursesController < Api::BaseController
  self.finder_resource_name = :course
  setup_resource_finder

  skip_before_action :authenticate_request, only: [:join]
  before_action :find_resource, only: [:show, :update, :destroy, :join, :responses]
  before_action :require_instructor!, except: [:join]
  before_action -> { require_course_access!(@resource) }, only: [:show, :responses]
  before_action -> { require_course_management!(@resource) }, only: [:update, :destroy]
  
  def index
    # Get institution from params for index action
    institution = Institution.find(params[:institution_id])
    courses = institution.courses.includes(:questions)
    render_success("Courses retrieved successfully", { courses: courses.as_json(include: :questions) })
  end
  
  def show
    render_success("Course retrieved successfully", { course: @resource.as_json(include: { questions: { only: [:id, :question_text, :question_type, :options] } }) })
  end
  
  def create
    # Get institution from params for create action
    institution = Institution.find(params[:institution_id])
    course = institution.courses.build(course_params)
    
    if course.save
      render_success("Course created successfully", { course: course }, :created)
    else
      raise ActiveRecord::RecordInvalid.new(course)
    end
  end
  
  def update
    if @resource.update(course_params)
      render_success("Course updated successfully", { course: @resource })
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end
  
  def destroy
    @resource.destroy
    render_success("Course deleted successfully")
  end
  
  def join
    # Verify access code if provided
    if params[:access_code].present? && @resource.access_code != params[:access_code]
      render_error('Invalid access code', :unauthorized)
      return
    end
    
    questions_data = @resource.course_questions.includes(:question).order(:position).map do |cq|
      {
        id: cq.id,
        question_id: cq.question.id,
        question_text: cq.question.question_text,
        question_type: cq.question.question_type,
        options: cq.question.options,
        position: cq.position
      }
    end
    
    render_success("Successfully joined course", {
      course: @resource,
      questions: questions_data
    })
  end
  
  def responses
    responses = @resource.answers.includes(:user, :course_question => :question)
    
    render_success("Responses retrieved successfully", {
      responses: responses.as_json(include: {
        user: { only: [:id, :name] },
        course_question: { include: { question: { only: [:id, :question_text, :question_type] } } }
      })
    })
  end
  
  private
  
  def course_params
    params.require(:course).permit(:name, :description, :is_active)
  end
end