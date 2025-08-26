FactoryBot.define do
  factory :course do
    sequence(:name) { |n| "Test Evaluation #{n}" }
    description { "A test course for development and testing purposes" }
    association :institution
    
    # access_code will be generated automatically by the model
  end
end