module ErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
    rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_errors
    rescue_from ActiveModel::ValidationError, with: :handle_validation_errors
  end

  private

  def handle_not_found(exception)
    render_error("Resource not found", :not_found, { resource: exception.model })
  end

  def handle_parameter_missing(exception)
    render_error("Missing required parameter: #{exception.param}", :bad_request)
  end

  def handle_validation_errors(exception)
    errors = if exception.respond_to?(:record) && exception.record
               format_validation_errors(exception.record.errors)
             else
               { base: [exception.message] }
             end
    
    render_error("Validation failed", :unprocessable_entity, { validation_errors: errors })
  end

  def render_error(message, status = :internal_server_error, details = {})
    response_body = {
      success: false,
      error: message,
      status: Rack::Utils.status_code(status)
    }
    
    response_body.merge!(details) if details.any?
    
    render json: response_body, status: status
  end

  def render_success(message = "Success", data = {}, status = :ok)
    response_body = {
      success: true,
      message: message,
      status: Rack::Utils.status_code(status)
    }
    
    response_body[:data] = data if data.any?
    
    render json: response_body, status: status
  end

  private

  def format_validation_errors(errors)
    formatted = {}
    errors.each do |attribute, messages|
      formatted[attribute] = Array(messages)
    end
    formatted
  end
end