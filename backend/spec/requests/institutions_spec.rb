require 'rails_helper'

RSpec.describe 'Institutions API', type: :request do
  describe 'GET /api/institutions' do
    it 'returns success response' do
      Institution.create!(name: 'Test Org 1')
      Institution.create!(name: 'Test Org 2')

      get '/api/institutions'

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['institutions']).to be_an(Array)
      expect(json_response['data']['institutions'].length).to eq(2)
    end
  end

  describe 'GET /api/institutions/:id' do
    let(:institution) { Institution.create!(name: 'Test Institution') }

    it 'returns the institution' do
      get "/api/institutions/#{institution.id}"

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['institution']['name']).to eq('Test Institution')
    end

    it 'returns not found for non-existent institution' do
      get '/api/institutions/999999'

      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to include('not found')
    end
  end

  describe 'POST /api/institutions' do
    it 'creates a new institution' do
      post '/api/institutions', params: {
        institution: { name: 'New Institution', description: 'A test org' }
      }

      expect(response).to have_http_status(:created)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['data']['institution']['name']).to eq('New Institution')
      expect(Institution.count).to eq(1)
    end

    it 'returns validation errors for invalid data' do
      post '/api/institutions', params: {
        institution: { name: '', description: 'A test org' }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to eq('Validation failed')
    end
  end
end