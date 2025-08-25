FactoryBot.define do
  factory :institution do
    sequence(:name) { |n| "Test Institution #{n}" }
    description { "A test institution for development and testing purposes" }
  end
end