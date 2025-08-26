class User < ApplicationRecord
  belongs_to :institution
  has_many :answers, dependent: :destroy
  
  validates :name, presence: true
  validates :role, presence: true
  
  before_create :generate_session_token
  
  enum role: { student: 'student', instructor: 'instructor' }
  
  def generate_session_token!
    generate_session_token
    save!
  end
  
  def instructor?
    role == 'instructor'
  end
  
  def student?
    role == 'student'
  end
  
  private
  
  def generate_session_token
    self.session_token = SecureRandom.uuid
  end
end