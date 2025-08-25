require 'rails_helper'

# Simple test controller to test ResourceFindable concern
class TestResourceFindableController < ApplicationController
  include ResourceFindable
  
  self.finder_resource_name = :institution
  setup_resource_finder

  def test_action
    find_institution
    render json: { success: true, institution_id: @resource.id }
  end

  private

  def find_institution
    @resource = Institution.find(params[:id])
  end
end

RSpec.describe TestResourceFindableController, type: :controller do
  let(:institution) { Institution.create!(name: 'Test Institution') }

  before do
    Rails.application.routes.draw do
      get 'test/:id', to: 'test_resource_findable#test_action'
    end
  end

  after do
    Rails.application.reload_routes!
  end

  describe 'ResourceFindable concern' do
    it 'sets finder_resource_name class attribute' do
      expect(TestResourceFindableController.finder_resource_name).to eq(:institution)
    end

    it 'responds to setup_resource_finder' do
      expect(TestResourceFindableController).to respond_to(:setup_resource_finder)
    end

    it 'has the concern included' do
      expect(TestResourceFindableController.included_modules).to include(ResourceFindable)
    end
  end
end