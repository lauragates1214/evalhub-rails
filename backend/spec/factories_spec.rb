require 'rails_helper'

RSpec.describe 'Factories', type: :model do
  describe 'institution factory' do
    it 'creates a valid institution' do
      institution = build(:institution)
      expect(institution).to be_valid
    end
  end

  describe 'user factory' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'creates a valid instructor' do
      user = build(:user, :instructor)
      expect(user).to be_valid
      expect(user.instructor?).to be true
    end
  end

  describe 'evaluation factory' do
    it 'creates a valid evaluation' do
      evaluation = build(:evaluation)
      expect(evaluation).to be_valid
    end
  end

  describe 'question factory' do
    it 'creates a valid text question' do
      question = build(:question, :text)
      expect(question).to be_valid
      expect(question.text?).to be true
    end

    it 'creates a valid multiple choice question' do
      question = build(:question, :multiple_choice)
      expect(question).to be_valid
      expect(question.multiple_choice?).to be true
    end
  end
end