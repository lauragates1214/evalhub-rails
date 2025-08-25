class Api::EvaluationQuestionsController < Api::BaseController
  self.finder_resource_name = :evaluation_question
  setup_resource_finder

  before_action :find_resource, only: [:show, :update, :destroy]
  before_action :require_instructor!

  def index
    # Get evaluation from params for index action
    evaluation = Evaluation.find(params[:evaluation_id])
    evaluation_questions = evaluation.evaluation_questions.includes(:question).order(:position)
    
    render_success("Evaluation questions retrieved successfully", {
      evaluation_questions: evaluation_questions.as_json(include: :question)
    })
  end

  def show
    render_success("Evaluation question retrieved successfully", {
      evaluation_question: @resource.as_json(include: :question)
    })
  end

  def create
    # Use join table creation logic from BaseController
    if is_join_table_resource?
      evaluation_question = create_join_table_resource
      
      if evaluation_question.save
        render_success("Question added to evaluation successfully", {
          evaluation_question: evaluation_question.as_json(include: :question)
        }, :created)
      else
        raise ActiveRecord::RecordInvalid.new(evaluation_question)
      end
    else
      render_error("Invalid resource type", :bad_request)
    end
  end

  def update
    # Use join table update logic from BaseController
    return if update_join_table_resource
    
    # Fallback to standard update if not handled by join table logic
    if @resource.update(evaluation_question_params)
      render_success("Evaluation question updated successfully", {
        evaluation_question: @resource.as_json(include: :question)
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
    render_success("Question removed from evaluation successfully")
  end

  private

  def evaluation_question_params
    params.require(:evaluation_question).permit(:question_id, :position, :is_modified)
  end

  # Override permitted_params for join table handling
  def permitted_params
    evaluation_question_params
  end
end