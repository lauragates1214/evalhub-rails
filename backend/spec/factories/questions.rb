FactoryBot.define do
  factory :question do
    sequence(:question_text) { |n| "What is your opinion about topic #{n}?" }
    question_type { 'text' }
    association :institution

    trait :multiple_choice do
      question_type { 'multiple_choice' }
      options { ['Option A', 'Option B', 'Option C'] }
    end

    trait :text do
      question_type { 'text' }
    end
  end
end