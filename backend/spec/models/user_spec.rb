require 'rails_helper'

RSpec.describe User, type: :model do
  let(:institution) { Institution.create!(name: 'Test Org') }

  describe 'validations' do
    it 'requires name to be present' do
      user = User.new(name: nil, institution: institution, password: 'password123')
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'requires role to be present' do
      user = User.new(name: 'Test User', role: nil, institution: institution, password: 'password123')
      expect(user).not_to be_valid
      expect(user.errors[:role]).to include("can't be blank")
    end

    it 'requires role to be valid' do
      expect {
        User.new(name: 'Test User', role: 'invalid_role', institution: institution)
      }.to raise_error(ArgumentError, "'invalid_role' is not a valid role")
    end

    it 'accepts instructor role' do
      user = User.new(name: 'Test User', role: 'instructor', email: 'test@example.com', password: 'password123', institution: institution)
      expect(user).to be_valid
    end

    it 'accepts student role' do
      user = User.new(name: 'Test User', role: 'student', institution: institution, password: 'password123')
      expect(user).to be_valid
    end
    
    context 'Devise validations' do
      it 'requires email for instructors' do
        user = User.new(name: 'Test Instructor', role: 'instructor', institution: institution, password: 'password123')
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include("can't be blank")
      end
      
      it 'does not require email for students' do
        user = User.new(name: 'Test Student', role: 'student', institution: institution, password: 'password123')
        expect(user).to be_valid
      end
      
      it 'validates email format for instructors' do
        user = User.new(name: 'Test Instructor', role: 'instructor', email: 'invalid', password: 'password123', institution: institution)
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include("is invalid")
      end
      
      it 'requires password for instructors' do
        user = User.new(name: 'Test Instructor', role: 'instructor', email: 'test@example.com', institution: institution)
        expect(user).not_to be_valid
      end
      
      it 'does not require password for students without email' do
        user = User.new(name: 'Test Student', role: 'student', institution: institution)
        user.password = SecureRandom.hex(16) # Set a random password
        expect(user).to be_valid
      end
    end
  end

  describe 'associations' do
    let(:user) { User.create!(name: 'Test User', role: 'student', institution: institution, password: SecureRandom.hex(16)) }

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

  
  describe 'Devise authentication' do
    let(:instructor) { User.create!(
      name: 'Test Instructor', 
      role: 'instructor', 
      email: 'instructor@example.com',
      password: 'password123',
      institution: institution
    )}
    
    it 'authenticates with valid password' do
      expect(instructor.valid_password?('password123')).to be true
    end
    
    it 'does not authenticate with invalid password' do
      expect(instructor.valid_password?('wrongpassword')).to be false
    end
  end
end