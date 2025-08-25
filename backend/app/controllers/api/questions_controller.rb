class Api::QuestionsController < Api::BaseController
  self.finder_resource_name = :question
  setup_resource_finder

  before_action :find_resource, only: [:show, :update, :destroy, :add_to_evaluation, :remove_from_evaluation]
  before_action :require_instructor!, except: [:index, :show]
  
  def index
    # Get institution from params for index action
    institution = Institution.find(params[:institution_id])
    questions = institution.questions.includes(:evaluations)
    render_success("Questions retrieved successfully", 
                   questions.map { |question| question_summary(question) })
  end
  
  def show
    render_success("Question retrieved successfully", question_detail(@resource))
  end
  
  def create
    # Get institution from params for create action
    institution = Institution.find(params[:institution_id])
    question = institution.questions.build(question_params)
    
    if question.save
      render_success("Question created successfully", question_detail(question), :created)
    else
      raise ActiveRecord::RecordInvalid.new(question)
    end
  end
  
  def update
    if @resource.update(question_params)
      render_success("Question updated successfully", question_detail(@resource))
    else
      raise ActiveRecord::RecordInvalid.new(@resource)
    end
  end
  
  def destroy
    @resource.destroy
    render_success("Question deleted successfully")
  end
  
  def add_to_evaluation
    # Get institution from the resource's association
    institution = @resource.institution
    evaluation = institution.evaluations.find(params[:evaluation_id])
    position = params[:position] || (evaluation.evaluation_questions.maximum(:position) || 0) + 1
    
    evaluation_question = evaluation.evaluation_questions.build(
      question: @resource,
      position: position
    )
    
    if evaluation_question.save
      render_success("Question added to evaluation", {
        evaluation_question_id: evaluation_question.id,
        evaluation: { id: evaluation.id, name: evaluation.name },
        question: question_summary(@resource),
        position: position
      })
    else
      raise ActiveRecord::RecordInvalid.new(evaluation_question)
    end
  end
  
  def remove_from_evaluation
    # Get institution from the resource's association
    institution = @resource.institution
    evaluation = institution.evaluations.find(params[:evaluation_id])
    evaluation_question = evaluation.evaluation_questions.find_by(question: @resource)
    
    if evaluation_question
      evaluation_question.destroy
      render_success("Question removed from evaluation")
    else
      render_error("Question not found in evaluation", :not_found)
    end
  end
  
  private
  
  def question_params
    params.require(:question).permit(:text, :question_type, options: [])
  end
  
  def question_summary(question)
    {
      id: question.id,
      text: question.text,
      question_type: question.question_type,
      options: question.options,
      total_evaluations: question.evaluations.count,
      created_at: question.created_at,
      updated_at: question.updated_at
    }
  end
  
  def question_detail(question)
    question_summary(question).merge(
      evaluations: question.evaluations.map do |evaluation|
        {
          id: evaluation.id,
          name: evaluation.name,
          active: evaluation.active
        }
      end,
      recent_responses: question.answers.includes(:user, :evaluation_question => :evaluation)
                               .limit(5)
                               .map do |answer|
        {
          id: answer.id,
          user_name: answer.user.name,
          evaluation_name: answer.evaluation.name,
          answer: answer.formatted_answer,
          created_at: answer.created_at
        }
      end
    )
  end
end