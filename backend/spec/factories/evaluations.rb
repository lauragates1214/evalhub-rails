FactoryBot.define do
  factory :evaluation do
    sequence(:name) { |n| "Test Evaluation #{n}" }
    description { "A test evaluation for development and testing purposes" }
    association :institution
    
    # access_code will be generated automatically by the model
  end
end