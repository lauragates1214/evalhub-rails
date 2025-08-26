require 'rails_helper'

RSpec.describe 'Courses API', type: :request do
  let(:institution) { Institution.create!(name: 'Test Institution') }
  let(:instructor) { User.create!(name: 'Test Facilitator', role: 'instructor', institution: institution) }
  let(:student) { User.create!(name: 'Test Participant', role: 'student', institution: institution) }

  describe 'GET /api/institutions/:institution_id/courses/:id/join' do
    let(:course) { Course.create!(name: 'Test Course', institution: institution) }

    it 'allows joining course with valid access code' do
      get "/api/institutions/#{institution.id}/courses/#{course.id}/join", 
          params: { access_code: course.access_code }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['course']['id']).to eq(course.id)
    end

    it 'rejects joining with invalid access code' do
      get "/api/institutions/#{institution.id}/courses/#{course.id}/join", 
          params: { access_code: 'INVALID' }

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to include('Invalid access code')
    end

    it 'allows joining without access code' do
      get "/api/institutions/#{institution.id}/courses/#{course.id}/join"

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
    end
  end

  describe 'POST /api/institutions/:institution_id/courses' do
    let(:headers) { { 'Authorization' => instructor.session_token } }

    it 'creates a new course with valid authentication' do
      post "/api/institutions/#{institution.id}/courses", 
           params: { course: { name: 'New Course', description: 'Test course' } },
           headers: headers

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['course']['name']).to eq('New Course')
    end

    it 'requires authentication for creating courses' do
      post "/api/institutions/#{institution.id}/courses", 
           params: { course: { name: 'New Course', description: 'Test course' } }

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
    end
  end
end