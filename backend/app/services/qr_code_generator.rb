class QrCodeGenerator
  require 'uri'
  
  def self.generate_url(evaluation, role = 'student')
    base_url = ENV.fetch('FRONTEND_URL', 'http://localhost:3001')
    institution_id = evaluation.institution.id
    evaluation_id = evaluation.id
    access_code = evaluation.access_code
    
    "#{base_url}/#{role}/#{institution_id}/#{evaluation_id}?access_code=#{access_code}"
  end
  
  def self.generate_urls_for_evaluation(evaluation)
    {
      student: generate_url(evaluation, 'student'),
      instructor: generate_url(evaluation, 'instructor')
    }
  end
  
  def self.generate_display_data(evaluation)
    urls = generate_urls_for_evaluation(evaluation)
    
    {
      evaluation: {
        id: evaluation.id,
        name: evaluation.name,
        access_code: evaluation.access_code,
        institution: evaluation.institution.name
      },
      urls: urls,
      qr_data: {
        student: {
          url: urls[:student],
          display_text: "Join as Participant",
          instructions: "Scan to join #{evaluation.name} as a student"
        },
        instructor: {
          url: urls[:instructor],
          display_text: "Access as Organizer", 
          instructions: "Scan to access #{evaluation.name} instructor controls"
        }
      }
    }
  end
end