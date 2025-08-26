class User < ApplicationRecord
  belongs_to :institution
  has_many :answers, dependent: :destroy
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  validates :name, presence: true
  validates :role, presence: true
  validates :email, uniqueness: { scope: :institution_id }, allow_nil: true
  
  enum role: { student: 'student', instructor: 'instructor' }
  
  def instructor?
    role == 'instructor'
  end
  
  def student?
    role == 'student'
  end
  
  # Override Devise's email_required? to allow students without email
  def email_required?
    instructor?
  end
  
  # Override Devise's password_required? to allow students without password
  def password_required?
    return false if student? && !email.present?
    super
  end
end