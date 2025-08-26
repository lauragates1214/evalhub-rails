class Institution < ApplicationRecord
  has_many :courses, dependent: :destroy
  has_many :users, dependent: :destroy
  has_many :questions, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true
end