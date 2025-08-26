class CourseQuestion < ApplicationRecord
  belongs_to :course
  belongs_to :question
  has_many :answers, dependent: :destroy
  
  validates :course, presence: true
  validates :question, presence: true
  validates :position, presence: true, numericality: { greater_than: 0 }
  validates :course_id, uniqueness: { scope: :question_id }
  
  scope :ordered, -> { order(:position) }
  
  def response_count
    answers.count
  end
  
  def completion_rate
    return 0 unless course.total_students > 0
    
    (response_count.to_f / course.total_students * 100).round(1)
  end
  
  def all_responses
    answers.includes(:user)
  end
end