class ApplicationController < ActionController::API
  # Include Devise helpers for API authentication
  include ActionController::MimeResponds
  respond_to :json
  
  # Global application-level configurations
  # API-specific logic is handled in Api::BaseController
end