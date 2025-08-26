FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "Test User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    role { 'student' }
    association :institution

    trait :instructor do
      role { 'instructor' }
    end

    trait :student do
      role { 'student' }
    end
  end
end