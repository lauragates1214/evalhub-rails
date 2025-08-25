require 'rails_helper'

RSpec.describe 'Evaluations API', type: :request do
  let(:institution) { Institution.create!(name: 'Test Institution') }
  let(:instructor) { User.create!(name: 'Test Facilitator', role: 'instructor', institution: institution) }
  let(:student) { User.create!(name: 'Test Participant', role: 'student', institution: institution) }

  describe 'GET /api/institutions/:institution_id/evaluations/:id/join' do
    let(:evaluation) { Evaluation.create!(name: 'Test Evaluation', institution: institution) }

    it 'allows joining evaluation with valid access code' do
      get "/api/institutions/#{institution.id}/evaluations/#{evaluation.id}/join", 
          params: { access_code: evaluation.access_code }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['evaluation']['id']).to eq(evaluation.id)
    end

    it 'rejects joining with invalid access code' do
      get "/api/institutions/#{institution.id}/evaluations/#{evaluation.id}/join", 
          params: { access_code: 'INVALID' }

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to include('Invalid access code')
    end

    it 'allows joining without access code' do
      get "/api/institutions/#{institution.id}/evaluations/#{evaluation.id}/join"

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
    end
  end

  describe 'POST /api/institutions/:institution_id/evaluations' do
    let(:headers) { { 'Authorization' => instructor.session_token } }

    it 'creates a new evaluation with valid authentication' do
      post "/api/institutions/#{institution.id}/evaluations", 
           params: { evaluation: { name: 'New Evaluation', description: 'Test evaluation' } },
           headers: headers

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['evaluation']['name']).to eq('New Evaluation')
    end

    it 'requires authentication for creating evaluations' do
      post "/api/institutions/#{institution.id}/evaluations", 
           params: { evaluation: { name: 'New Evaluation', description: 'Test evaluation' } }

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
    end
  end
end