class Answer < ApplicationRecord
  belongs_to :user
  belongs_to :evaluation_question
  
  validates :user, presence: true
  validates :evaluation_question, presence: true
  validates :user_id, uniqueness: { scope: :evaluation_question_id }
  
  validate :answer_presence
  validate :answer_format_matches_question_type
  
  def question
    evaluation_question.question
  end
  
  def evaluation
    evaluation_question.evaluation
  end
  
  def answer_data
    case question.question_type
    when 'text'
      answer_text
    when 'multiple_choice_single'
      selected_options.first
    when 'multiple_choice_multiple'
      selected_options
    when 'rating_scale'
      selected_options.first&.to_i
    when 'emoji'
      selected_options.first
    end
  end
  
  def formatted_answer
    case question.question_type
    when 'text'
      answer_text
    when 'multiple_choice_single', 'emoji'
      selected_options.first
    when 'multiple_choice_multiple'
      selected_options.join(', ')
    when 'rating_scale'
      "#{selected_options.first}/5"
    end
  end
  
  private
  
  def answer_presence
    if answer_text.blank? && selected_options.empty?
      errors.add(:base, "Must provide an answer")
    end
  end
  
  def answer_format_matches_question_type
    case question&.question_type
    when 'text'
      errors.add(:answer_text, "is required for text questions") if answer_text.blank?
    when 'multiple_choice_single', 'multiple_choice_multiple', 'rating_scale', 'emoji'
      errors.add(:selected_options, "is required for this question type") if selected_options.empty?
    end
  end
end