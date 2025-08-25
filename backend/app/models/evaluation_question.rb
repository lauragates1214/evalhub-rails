class EvaluationQuestion < ApplicationRecord
  belongs_to :evaluation
  belongs_to :question
  has_many :answers, dependent: :destroy
  
  validates :evaluation, presence: true
  validates :question, presence: true
  validates :position, presence: true, numericality: { greater_than: 0 }
  validates :evaluation_id, uniqueness: { scope: :question_id }
  
  scope :ordered, -> { order(:position) }
  
  def response_count
    answers.count
  end
  
  def completion_rate
    return 0 unless evaluation.total_students > 0
    
    (response_count.to_f / evaluation.total_students * 100).round(1)
  end
  
  def all_responses
    answers.includes(:user)
  end
end