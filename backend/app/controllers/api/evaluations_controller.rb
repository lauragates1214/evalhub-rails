class Api::EvaluationsController < Api::BaseController
  self.finder_resource_name = :evaluation
  setup_resource_finder

  skip_before_action :authenticate_request, only: [:join]
  before_action :find_resource, only: [:show, :update, :destroy, :join, :responses]
  before_action :require_instructor!, except: [:join]
  before_action -> { require_evaluation_access!(@resource) }, only: [:show, :responses]
  before_action -> { require_evaluation_management!(@resource) }, only: [:update, :destroy]
  
  def index
    # Get institution from params for index action
    institution = Institution.find(params[:institution_id])
    evaluations = institution.evaluations.includes(:questions)
    render_success("Evaluations retrieved successfully", { evaluations: evaluations.as_json(include: :questions) })
  end
  
  def show
    render_success("Evaluation retrieved successfully", { evaluation: @resource.as_json(include: { questions: { only: [:id, :question_text, :question_type, :options] } }) })
  end
  
  def create
    # Get institution from params for create action
    institution = Institution.find(params[:institution_id])
    evaluation = institution.evaluations.build(evaluation_params)
    
    if evaluation.save
      render_success("Evaluation created successfully", { evaluation: evaluation }, :created)
    else
      raise ActiveRecord::RecordInvalid.new(evaluation)
    end
  end
  
  def update
    if @resource.update(evaluation_params)
      render_success("Evaluation updated successfully", { evaluation: @resource })
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end
  
  def destroy
    @resource.destroy
    render_success("Evaluation deleted successfully")
  end
  
  def join
    # Verify access code if provided
    if params[:access_code].present? && @resource.access_code != params[:access_code]
      render_error('Invalid access code', :unauthorized)
      return
    end
    
    questions_data = @resource.evaluation_questions.includes(:question).order(:position).map do |eq|
      {
        id: eq.id,
        question_id: eq.question.id,
        question_text: eq.question.question_text,
        question_type: eq.question.question_type,
        options: eq.question.options,
        position: eq.position
      }
    end
    
    render_success("Successfully joined evaluation", {
      evaluation: @resource,
      questions: questions_data
    })
  end
  
  def responses
    responses = @resource.answers.includes(:user, :evaluation_question => :question)
    
    render_success("Responses retrieved successfully", {
      responses: responses.as_json(include: {
        user: { only: [:id, :name] },
        evaluation_question: { include: { question: { only: [:id, :question_text, :question_type] } } }
      })
    })
  end
  
  private
  
  def evaluation_params
    params.require(:evaluation).permit(:name, :description, :is_active)
  end
end