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

# Create test courses
test_course = Course.find_or_create_by(
  name: "Development Test Course",
  institution: test_org
) do |e|
  e.date = Date.current
  e.description = "Test course for development"
end

workshop_course = Course.find_or_create_by(
  name: "Sample Workshop",
  institution: test_org
) do |e|
  e.date = Date.current + 1.day
  e.description = "Sample workshop course"
end

# Create course-question associations
CourseQuestion.find_or_create_by(
  course: test_course,
  question: text_question
)

CourseQuestion.find_or_create_by(
  course: test_course,
  question: choice_question
)

CourseQuestion.find_or_create_by(
  course: workshop_course,
  question: composite_question
)

# Create some sample answers for testing
eq1 = CourseQuestion.find_by(course: test_course, question: text_question)
if eq1
  Answer.find_or_create_by(
    course_question: eq1,
    user: test_user
  ) do |a|
    a.answer_text = "This was a great session, very informative!"
  end
end

eq2 = CourseQuestion.find_by(course: test_course, question: choice_question)
if eq2
  Answer.find_or_create_by(
    course_question: eq2,
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
puts "- #{Course.count} courses"
puts "- #{CourseQuestion.count} course-question associations"
puts "- #{Answer.count} sample answers"