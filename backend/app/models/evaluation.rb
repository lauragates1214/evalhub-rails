class Evaluation < ApplicationRecord
  belongs_to :institution
  has_many :evaluation_questions, dependent: :destroy
  has_many :questions, through: :evaluation_questions
  has_many :answers, through: :evaluation_questions
  
  validates :name, presence: true
  validates :access_code, presence: true, uniqueness: true
  
  before_create :generate_access_code
  
  def generate_qr_code_url(role = 'student')
    "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3001')}/#{role}/#{institution.id}/#{id}?access_code=#{access_code}"
  end
  
  private
  
  def generate_access_code
    self.access_code = SecureRandom.alphanumeric(8).upcase
  end
end