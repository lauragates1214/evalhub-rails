class Api::AnswersController < Api::BaseController
  self.finder_resource_name = :answer
  setup_resource_finder

  before_action :find_resource, only: [:show, :update, :destroy]
  before_action :setup_context_resources, except: [:show, :update, :destroy]
  before_action :setup_course_question, only: [:create, :update, :destroy]
  before_action -> { require_course_access!(@course) }
  before_action -> { verify_resource_ownership!(@resource) }, only: [:update, :destroy], if: -> { @resource.present? }
  
  def index
    answers = current_user.answers
                         .joins(:course_question)
                         .where(course_questions: { course: @course })
                         .includes(:course_question => :question)
    
    render_success("Answers retrieved successfully", {
      course: { id: @course.id, name: @course.name },
      answers: answers.map { |answer| answer_data(answer) }
    })
  end
  
  def show
    render_success("Answer retrieved successfully", answer_data(@resource))
  end
  
  def create
    # Check if user already answered this question
    existing_answer = current_user.answers.find_by(course_question: @course_question)
    
    if existing_answer
      render_error('You have already answered this question', :conflict)
      return
    end
    
    answer = @course_question.answers.build(answer_params)
    answer.user = current_user
    
    if answer.save
      render_success("Answer created successfully", answer_data(answer), :created)
    else
      raise ActiveRecord::RecordInvalid.new(answer)
    end
  end
  
  def update
    if @resource.update(answer_params)
      render_success("Answer updated successfully", answer_data(@resource))
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end
  
  def destroy
    @resource.destroy
    render_success("Answer deleted successfully")
  end
  
  def bulk_create
    answers_data = params[:answers] || []
    created_answers = []
    errors = []
    
    Answer.transaction do
      answers_data.each do |answer_params|
        course_question = @course.course_questions.find_by(id: answer_params[:course_question_id])
        
        unless course_question
          errors << "Course question #{answer_params[:course_question_id]} not found"
          next
        end
        
        # Check if user already answered
        existing_answer = current_user.answers.find_by(course_question: course_question)
        if existing_answer
          errors << "Already answered question: #{course_question.question.text}"
          next
        end
        
        answer = course_question.answers.build(
          user: current_user,
          answer_text: answer_params[:answer_text],
          selected_options: answer_params[:selected_options] || []
        )
        
        if answer.save
          created_answers << answer
        else
          errors.concat(answer.errors.full_messages)
        end
      end
      
      raise ActiveRecord::Rollback if errors.any?
    end
    
    if errors.any?
      render_error(errors.join(', '), :unprocessable_entity)
    else
      render_success("Successfully submitted #{created_answers.count} answers", 
                     created_answers.map { |answer| answer_data(answer) }, 
                     :created)
    end
  end
  
  private

  def setup_context_resources
    @institution = Institution.find(params[:institution_id])
    @course = @institution.courses.find(params[:course_id])
  end

  def setup_course_question
    if @resource
      @course_question = @resource.course_question
      @course = @course_question.course
    elsif params[:course_question_id]
      @course_question = @course.course_questions.find(params[:course_question_id])
    end
  end
  
  def answer_params
    params.require(:answer).permit(:answer_text, selected_options: [])
  end
  
  def answer_data(answer)
    {
      id: answer.id,
      user_id: answer.user_id,
      course_question_id: answer.course_question_id,
      question: {
        id: answer.question.id,
        text: answer.question.text,
        question_type: answer.question.question_type,
        options: answer.question.options
      },
      answer_text: answer.answer_text,
      selected_options: answer.selected_options,
      formatted_answer: answer.formatted_answer,
      created_at: answer.created_at,
      updated_at: answer.updated_at
    }
  end
end