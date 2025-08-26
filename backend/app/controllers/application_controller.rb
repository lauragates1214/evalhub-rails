class ApplicationController < ActionController::API
  # Include Devise helpers for API authentication
  include ActionController::MimeResponds
  before_action :configure_permitted_parameters, if: :devise_controller?
  respond_to :json
  
  # Global application-level configurations
  # API-specific logic is handled in Api::BaseController
  
  protected
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :role, :institution_id])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :role, :institution_id])
  end
end