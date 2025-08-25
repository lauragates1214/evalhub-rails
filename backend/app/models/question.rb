class Question < ApplicationRecord
  belongs_to :institution
  has_many :evaluation_questions, dependent: :destroy
  has_many :evaluations, through: :evaluation_questions
  has_many :answers, through: :evaluation_questions
  
  validates :question_text, presence: true
  validates :question_type, presence: true, inclusion: { in: %w[text multiple_choice] }
  
  enum question_type: {
    text: 'text',
    multiple_choice: 'multiple_choice'
  }
  
  def requires_options?
    multiple_choice?
  end
end