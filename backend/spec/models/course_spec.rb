require 'rails_helper'

RSpec.describe Course, type: :model do
  let(:institution) { Institution.create!(name: 'Test Org') }

  describe 'validations' do
    it 'requires name to be present' do
      course = Course.new(name: nil, institution: institution)
      expect(course).not_to be_valid
      expect(course.errors[:name]).to include("can't be blank")
    end

    it 'generates access_code automatically when blank' do
      course = Course.new(name: 'Test Course', access_code: nil, institution: institution)
      expect(course).to be_valid
      expect(course.access_code).to be_present
    end

    it 'requires access_code to be unique' do
      Course.create!(name: 'Course 1', access_code: 'ABC123', institution: institution)
      duplicate_course = Course.new(name: 'Course 2', access_code: 'ABC123', institution: institution)
      expect(duplicate_course).not_to be_valid
      expect(duplicate_course.errors[:access_code]).to include("has already been taken")
    end
  end

  describe 'associations' do
    let(:course) { Course.create!(name: 'Test Course', institution: institution) }

    it 'belongs to institution' do
      expect(course.institution).to eq(institution)
    end

    it 'has many course_questions' do
      expect(course).to respond_to(:course_questions)
      expect(course.course_questions).to eq([])
    end

    it 'has many questions through course_questions' do
      expect(course).to respond_to(:questions)
      expect(course.questions).to eq([])
    end

    it 'has many answers through course_questions' do
      expect(course).to respond_to(:answers)
      expect(course.answers).to eq([])
    end
  end

  describe 'access code generation' do
    it 'generates access code before create' do
      course = Course.new(name: 'Test Course', institution: institution)
      expect(course.access_code).to be_nil
      course.save!
      expect(course.access_code).not_to be_nil
      expect(course.access_code).to match(/^[A-Z0-9]{8}$/)
    end
  end

  describe '#generate_qr_code_url' do
    let(:course) { Course.create!(name: 'Test Course', institution: institution) }

    it 'generates student URL by default' do
      url = course.generate_qr_code_url
      expect(url).to include('student')
      expect(url).to include(institution.id.to_s)
      expect(url).to include(course.id.to_s)
      expect(url).to include(course.access_code)
    end

    it 'generates instructor URL when specified' do
      url = course.generate_qr_code_url('instructor')
      expect(url).to include('instructor')
      expect(url).to include(institution.id.to_s)
      expect(url).to include(course.id.to_s)
      expect(url).to include(course.access_code)
    end
  end
end