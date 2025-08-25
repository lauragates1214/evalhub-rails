# Development seeds - comprehensive test data for local development

# Find or create test institution
test_org = Institution.find_or_create_by(name: "Test Institution") do |org|
  org.description = "Development test institution"
end

# Create test users for development
test_user = User.find_or_create_by(name: "Test User") do |u|
  u.institution = test_org
end

admin_user = User.find_or_create_by(name: "Admin User") do |u|
  u.institution = test_org
  u.admin = true
end

# Create sample questions
text_question = Question.find_or_create_by(
  question_text: "What did you think of the session?",
  institution: test_org
) do |q|
  q.question_type = "text"
end

choice_question = Question.find_or_create_by(
  question_text: "How would you rate the session?",
  institution: test_org
) do |q|
  q.question_type = "multiple_choice_single"
  q.multiple_choice_options = ["Excellent", "Good", "Fair", "Poor"]
end

composite_question = Question.find_or_create_by(
  question_text: "Session Feedback",
  institution: test_org
) do |q|
  q.question_type = "composite"
  q.follow_up_questions = [
    {
      id: "rating",
      text: "Overall rating",
      type: "radio",
      options: ["1", "2", "3", "4", "5"]
    },
    {
      id: "comments",
      text: "Additional comments",
      type: "text"
    }
  ]
end

# Create test evaluations
test_evaluation = Evaluation.find_or_create_by(
  name: "Development Test Evaluation",
  institution: test_org
) do |e|
  e.date = Date.current
  e.description = "Test evaluation for development"
end

workshop_evaluation = Evaluation.find_or_create_by(
  name: "Sample Workshop",
  institution: test_org
) do |e|
  e.date = Date.current + 1.day
  e.description = "Sample workshop evaluation"
end

# Create evaluation-question associations
EvaluationQuestion.find_or_create_by(
  evaluation: test_evaluation,
  question: text_question
)

EvaluationQuestion.find_or_create_by(
  evaluation: test_evaluation,
  question: choice_question
)

EvaluationQuestion.find_or_create_by(
  evaluation: workshop_evaluation,
  question: composite_question
)

# Create some sample answers for testing
eq1 = EvaluationQuestion.find_by(evaluation: test_evaluation, question: text_question)
if eq1
  Answer.find_or_create_by(
    evaluation_question: eq1,
    user: test_user
  ) do |a|
    a.answer_text = "This was a great session, very informative!"
  end
end

eq2 = EvaluationQuestion.find_by(evaluation: test_evaluation, question: choice_question)
if eq2
  Answer.find_or_create_by(
    evaluation_question: eq2,
    user: test_user
  ) do |a|
    a.answer_text = "Good"
  end
end

puts "Development seeding complete!"
puts "Created:"
puts "- #{Institution.count} institutions"
puts "- #{User.count} users"
puts "- #{Question.count} questions"
puts "- #{Evaluation.count} evaluations"
puts "- #{EvaluationQuestion.count} evaluation-question associations"
puts "- #{Answer.count} sample answers"