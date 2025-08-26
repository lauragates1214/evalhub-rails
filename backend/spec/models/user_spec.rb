require 'rails_helper'

RSpec.describe User, type: :model do
  let(:institution) { Institution.create!(name: 'Test Org') }

  describe 'validations' do
    it 'requires name to be present' do
      user = User.new(name: nil, institution: institution)
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'requires role to be present' do
      user = User.new(name: 'Test User', role: nil, institution: institution)
      expect(user).not_to be_valid
      expect(user.errors[:role]).to include("can't be blank")
    end

    it 'requires role to be valid' do
      expect {
        User.new(name: 'Test User', role: 'invalid_role', institution: institution)
      }.to raise_error(ArgumentError, "'invalid_role' is not a valid role")
    end

    it 'accepts instructor role' do
      user = User.new(name: 'Test User', role: 'instructor', institution: institution)
      expect(user).to be_valid
    end

    it 'accepts student role' do
      user = User.new(name: 'Test User', role: 'student', institution: institution)
      expect(user).to be_valid
    end
  end

  describe 'associations' do
    let(:user) { User.create!(name: 'Test User', role: 'student', institution: institution) }

    it 'belongs to institution' do
      expect(user.institution).to eq(institution)
    end

    it 'has many answers' do
      expect(user).to respond_to(:answers)
      expect(user.answers).to eq([])
    end
  end

  describe 'role methods' do
    it 'returns true for instructor? when role is instructor' do
      user = User.new(role: 'instructor')
      expect(user.instructor?).to be true
      expect(user.student?).to be false
    end

    it 'returns true for student? when role is student' do
      user = User.new(role: 'student')
      expect(user.student?).to be true
      expect(user.instructor?).to be false
    end
  end

  describe 'session token generation' do
    it 'generates session token before create' do
      user = User.new(name: 'Test User', role: 'student', institution: institution)
      expect(user.session_token).to be_nil
      user.save!
      expect(user.session_token).not_to be_nil
      expect(user.session_token).to be_a(String)
    end

    it 'can regenerate session token' do
      user = User.create!(name: 'Test User', role: 'student', institution: institution)
      original_token = user.session_token
      user.generate_session_token!
      expect(user.session_token).not_to eq(original_token)
    end
  end
end