require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  let(:institution) { Institution.create!(name: 'Test Institution') }

  describe 'POST /api/institutions/:institution_id/users/authenticate' do
    it 'authenticates existing user' do
      user = User.create!(name: 'John Doe', role: 'student', institution: institution)

      post "/api/institutions/#{institution.id}/users/authenticate", 
           params: { name: 'John Doe' }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['user']['name']).to eq('John Doe')
      expect(json_response['data']['session_token']).to be_present
    end

    it 'creates new user if not exists' do
      post "/api/institutions/#{institution.id}/users/authenticate", 
           params: { name: 'New User', role: 'student' }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['user']['name']).to eq('New User')
      expect(json_response['data']['session_token']).to be_present
      expect(User.count).to eq(1)
    end

    it 'defaults to student role when no role specified' do
      post "/api/institutions/#{institution.id}/users/authenticate", 
           params: { name: 'Default User' }

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['data']['user']['role']).to eq('student')
    end
  end

  describe 'POST /api/institutions/:institution_id/users' do
    it 'creates a new user' do
      post "/api/institutions/#{institution.id}/users", 
           params: { user: { name: 'Test User', role: 'instructor' } }

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['user']['name']).to eq('Test User')
      expect(json_response['data']['session_token']).to be_present
    end

    it 'returns validation errors for invalid data' do
      post "/api/institutions/#{institution.id}/users", 
           params: { user: { name: '', role: 'invalid' } }

      expect(response).to have_http_status(:unprocessable_entity)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to eq('Validation failed')
    end
  end
end