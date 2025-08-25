class Api::BaseController < ApplicationController
  include ErrorHandler
  include Authenticatable  
  include ResourceFindable

  # API-specific configurations and helpers can go here
  # This provides a clean separation between general application logic 
  # and API-specific functionality

  protected

  # Override to provide API-specific error handling if needed
  def handle_not_found(exception)
    render_error("Resource not found", :not_found, { 
      resource: exception.model,
      path: request.path 
    })
  end

  # API-specific logging or monitoring could go here
  def log_api_request
    Rails.logger.info "API Request: #{request.method} #{request.path} from #{request.remote_ip}"
  end

  # Join table resource handling
  def create_join_table_resource
    return unless is_join_table_resource?

    resource_1_name, resource_2_name = Rails.application.config.join_table_resources[resource_name.to_s]   

    # extract IDs from params
    resource_1_id = params["#{resource_1_name}_id"] # in url
    resource_2_id = permitted_params["#{resource_2_name}_id"] # in request body

    # create & return join record with both IDs
    resource_class.new({
      "#{resource_1_name}_id" => resource_1_id,
      "#{resource_2_name}_id" => resource_2_id,
    }.merge(
      # remove resource ids to avoid duplicates
      permitted_params.to_h.except(
        "#{resource_1_name}_id", "#{resource_2_name}_id"
      )
    ))
  end

  def update_join_table_resource
    return false unless is_join_table_resource?

    resource_1_name, resource_2_name = Rails.application.config.join_table_resources[resource_name.to_s]
    resource_1_id = params["#{resource_1_name}_id"]
    resource_2_id = params["#{resource_2_name}_id"] || permitted_params["#{resource_2_name}_id"]
    
    join_resource = resource_class.find_by("#{resource_1_name}_id": resource_1_id, "#{resource_2_name}_id": resource_2_id)
    
    if join_resource
      if join_resource.update(permitted_params)
        render_success("#{resource_name.humanize} updated successfully", { resource_name.to_sym => join_resource })
      else
        raise ActiveRecord::RecordInvalid.new(join_resource)
      end
      true
    else
      render_error("#{resource_name.humanize} not found", :not_found)
      true
    end
  end

  def destroy_join_table_resource
    return false unless is_join_table_resource?

    resource_1_name, resource_2_name = Rails.application.config.join_table_resources[resource_name.to_s]
    resource_1_id = params["#{resource_1_name}_id"]
    resource_2_id = params["#{resource_2_name}_id"]
    
    join_resource = resource_class.find_by("#{resource_1_name}_id": resource_1_id, "#{resource_2_name}_id": resource_2_id)
    
    if join_resource
      if join_resource.destroy
        render_success("#{resource_name.humanize} deleted successfully")
      else
        render_error("Failed to delete #{resource_name}", :unprocessable_entity)
      end
      true
    else
      render_error("#{resource_name.humanize} not found", :not_found)
      true
    end
  end

  def is_join_table_resource?
    Rails.application.config.join_table_resources&.key?(resource_name.to_s)
  end

  def resource_name
    @resource_name ||= controller_name.singularize
  end

  def resource_class
    @resource_class ||= controller_name.classify.constantize
  end

  # Default permitted params - can be overridden in controllers
  def permitted_params
    params.require(resource_name).permit! if params[resource_name].present?
  end
end