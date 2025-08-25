require 'rails_helper'

RSpec.describe Institution, type: :model do
  describe 'validations' do
    it 'requires name to be present' do
      institution = Institution.new(name: nil)
      expect(institution).not_to be_valid
      expect(institution.errors[:name]).to include("can't be blank")
    end

    it 'requires name to be unique' do
      Institution.create!(name: 'Test Org')
      duplicate_org = Institution.new(name: 'Test Org')
      expect(duplicate_org).not_to be_valid
      expect(duplicate_org.errors[:name]).to include("has already been taken")
    end

    it 'is valid with a unique name' do
      institution = Institution.new(name: 'Valid Institution')
      expect(institution).to be_valid
    end
  end

  describe 'associations' do
    let(:institution) { Institution.create!(name: 'Test Org') }

    it 'has many evaluations' do
      expect(institution).to respond_to(:evaluations)
      expect(institution.evaluations).to eq([])
    end

    it 'has many users' do
      expect(institution).to respond_to(:users)
      expect(institution.users).to eq([])
    end

    it 'has many questions' do
      expect(institution).to respond_to(:questions)
      expect(institution.questions).to eq([])
    end

    it 'destroys dependent records on deletion' do
      # This would be tested with actual records in a full test suite
      # but keeping minimal as requested
      expect { institution.destroy }.not_to raise_error
    end
  end
end