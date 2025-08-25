require 'rails_helper'

RSpec.describe Question, type: :model do
  let(:institution) { Institution.create!(name: 'Test Org') }

  describe 'validations' do
    it 'requires question_text to be present' do
      question = Question.new(question_text: nil, question_type: 'text', institution: institution)
      expect(question).not_to be_valid
      expect(question.errors[:question_text]).to include("can't be blank")
    end

    it 'requires question_type to be present' do
      question = Question.new(question_text: 'Test question?', question_type: nil, institution: institution)
      expect(question).not_to be_valid
      expect(question.errors[:question_type]).to include("can't be blank")
    end

    it 'requires question_type to be valid' do
      question = Question.new(question_text: 'Test question?', question_type: 'invalid_type', institution: institution)
      expect(question).not_to be_valid
      expect(question.errors[:question_type]).to include("is not included in the list")
    end

    it 'accepts text question type' do
      question = Question.new(question_text: 'Test question?', question_type: 'text', institution: institution)
      expect(question).to be_valid
    end

    it 'accepts multiple_choice question type' do
      question = Question.new(question_text: 'Test question?', question_type: 'multiple_choice', institution: institution)
      expect(question).to be_valid
    end
  end

  describe 'associations' do
    let(:question) { Question.create!(question_text: 'Test question?', question_type: 'text', institution: institution) }

    it 'belongs to institution' do
      expect(question.institution).to eq(institution)
    end

    it 'has many evaluation_questions' do
      expect(question).to respond_to(:evaluation_questions)
      expect(question.evaluation_questions).to eq([])
    end

    it 'has many evaluations through evaluation_questions' do
      expect(question).to respond_to(:evaluations)
      expect(question.evaluations).to eq([])
    end

    it 'has many answers through evaluation_questions' do
      expect(question).to respond_to(:answers)
      expect(question.answers).to eq([])
    end
  end

  describe 'question type methods' do
    it 'returns true for text? when question_type is text' do
      question = Question.new(question_type: 'text')
      expect(question.text?).to be true
      expect(question.multiple_choice?).to be false
    end

    it 'returns true for multiple_choice? when question_type is multiple_choice' do
      question = Question.new(question_type: 'multiple_choice')
      expect(question.multiple_choice?).to be true
      expect(question.text?).to be false
    end
  end

  describe '#requires_options?' do
    it 'returns false for text questions' do
      question = Question.new(question_type: 'text')
      expect(question.requires_options?).to be false
    end

    it 'returns true for multiple_choice questions' do
      question = Question.new(question_type: 'multiple_choice')
      expect(question.requires_options?).to be true
    end
  end
end