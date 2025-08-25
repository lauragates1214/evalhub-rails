Rails.application.config.resource_hierarchy = {
  'institution' => [],
  'user' => ['institution'],
  'evaluation' => ['institution'], 
  'question' => ['institution'],
  'evaluation_question' => ['evaluation'],
  'answer' => ['evaluation_question']
}