class Question < ApplicationRecord
  belongs_to :institution
  has_many :course_questions, dependent: :destroy
  has_many :courses, through: :course_questions
  has_many :answers, through: :course_questions
  
  validates :question_text, presence: true
  validates :question_type, presence: true
  
  enum question_type: {
    text: 'text',
    multiple_choice: 'multiple_choice'
  }
  
  def requires_options?
    multiple_choice?
  end
end