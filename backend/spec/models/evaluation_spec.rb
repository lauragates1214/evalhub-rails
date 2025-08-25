require 'rails_helper'

RSpec.describe Evaluation, type: :model do
  let(:institution) { Institution.create!(name: 'Test Org') }

  describe 'validations' do
    it 'requires name to be present' do
      evaluation = Evaluation.new(name: nil, institution: institution)
      expect(evaluation).not_to be_valid
      expect(evaluation.errors[:name]).to include("can't be blank")
    end

    it 'requires access_code to be present' do
      evaluation = Evaluation.new(name: 'Test Evaluation', access_code: nil, institution: institution)
      expect(evaluation).not_to be_valid
      expect(evaluation.errors[:access_code]).to include("can't be blank")
    end

    it 'requires access_code to be unique' do
      Evaluation.create!(name: 'Evaluation 1', access_code: 'ABC123', institution: institution)
      duplicate_evaluation = Evaluation.new(name: 'Evaluation 2', access_code: 'ABC123', institution: institution)
      expect(duplicate_evaluation).not_to be_valid
      expect(duplicate_evaluation.errors[:access_code]).to include("has already been taken")
    end
  end

  describe 'associations' do
    let(:evaluation) { Evaluation.create!(name: 'Test Evaluation', institution: institution) }

    it 'belongs to institution' do
      expect(evaluation.institution).to eq(institution)
    end

    it 'has many evaluation_questions' do
      expect(evaluation).to respond_to(:evaluation_questions)
      expect(evaluation.evaluation_questions).to eq([])
    end

    it 'has many questions through evaluation_questions' do
      expect(evaluation).to respond_to(:questions)
      expect(evaluation.questions).to eq([])
    end

    it 'has many answers through evaluation_questions' do
      expect(evaluation).to respond_to(:answers)
      expect(evaluation.answers).to eq([])
    end
  end

  describe 'access code generation' do
    it 'generates access code before create' do
      evaluation = Evaluation.new(name: 'Test Evaluation', institution: institution)
      expect(evaluation.access_code).to be_nil
      evaluation.save!
      expect(evaluation.access_code).not_to be_nil
      expect(evaluation.access_code).to match(/^[A-Z0-9]{8}$/)
    end
  end

  describe '#generate_qr_code_url' do
    let(:evaluation) { Evaluation.create!(name: 'Test Evaluation', institution: institution) }

    it 'generates student URL by default' do
      url = evaluation.generate_qr_code_url
      expect(url).to include('student')
      expect(url).to include(institution.id.to_s)
      expect(url).to include(evaluation.id.to_s)
      expect(url).to include(evaluation.access_code)
    end

    it 'generates instructor URL when specified' do
      url = evaluation.generate_qr_code_url('instructor')
      expect(url).to include('instructor')
      expect(url).to include(institution.id.to_s)
      expect(url).to include(evaluation.id.to_s)
      expect(url).to include(evaluation.access_code)
    end
  end
end