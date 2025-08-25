module ResourceFindable
  extend ActiveSupport::Concern

  # runs in the context of the class that includes the module
  included do
    class_attribute :finder_resource_name
    class_attribute :_finder_method
  end

  # method that classes can call after setting their resource_name
  def self.setup_finder_method(klass)
    # set up resource references
    outer_resource_name = klass.finder_resource_name # to pass into finder method
    finder_method = "find_#{outer_resource_name}" # dynamically assigned bc changes within function to parent
    private_validate_resource_method = "validate_resource"

    # register finder method for base controller (store method name in class attribute)
    klass._finder_method = finder_method

    # set up parent refs if applicable
    has_parent = !(Rails.application.config.resource_hierarchy[outer_resource_name.to_s] || []).empty?
    if has_parent
      private_validate_parent_method = "validate_parent"
      private_validate_matching_parent_method = "validate_matching_parent"
    end

    ## DEFINE FINDER METHOD ##
    klass.send(:define_method, finder_method) do |resource_name=outer_resource_name|
      # validate resource
      resource = send(private_validate_resource_method, resource_name)

      # recursive
      parent_name = Rails.application.config.resource_hierarchy[resource_name.to_s]&.first
      parent_exists = !parent_name.nil?

      if parent_exists
        # validate parent
        parent = send(private_validate_parent_method, resource, parent_name)

        # check resource assigned to parent
        send(private_validate_matching_parent_method, resource, parent_name, parent.id)
      end
      
      # return resource
      resource
    end

    ## PRIVATE METHODS ##

    # define private resource validation method
    klass.send(:define_method, private_validate_resource_method) do |resource_name|
      # extract resource id from params
      resource_id = params["#{resource_name}_id"] || params[:id]
      resource_class = resource_name.to_s.classify.constantize 

      # Use .with_deleted for restore action if available
      if action_name == 'restore' && resource_class.respond_to?(:with_deleted)
        scope = resource_class.with_deleted
      else
        scope = resource_class
      end
      # check if resource ID is present
      if resource_id.nil?
        raise ActiveRecord::RecordNotFound, "#{resource_class} ID is missing"
      end
      # check if resource exists
      unless scope.exists?(id: resource_id)
        raise ActiveRecord::RecordNotFound, "Couldn't find #{resource_class} with ID=#{resource_id}"
      end
      # retrieve & return resource
      resource = scope.find(resource_id)
    end
    # mark as private
    klass.send(:private, private_validate_resource_method)

    ## PRIVATE PARENT METHODS (if relevant) ##
    if has_parent
      klass.send(:define_method, private_validate_parent_method) do |resource, parent_name|
        # extract parent ID from params
        parent_id = params["#{parent_name}_id"]
        if parent_id.nil?
          raise ActiveRecord::RecordNotFound, "#{parent_name.to_s.classify.constantize} ID is missing"
        end

        # find parent(s) recursively through their respective finder methods
        parent = public_send(finder_method, parent_name)
      end
      # mark as private
      klass.send(:private, private_validate_parent_method)

      klass.send(:define_method, private_validate_matching_parent_method) do |resource, parent_name, parent_id|
        # validate resource assigned to parent
        if resource.send("#{parent_name}_id").to_i != parent_id.to_i
          error_message = "#{resource.class.name} with ID=#{resource.id} not assigned to #{parent_name.to_s.classify.constantize} with ID=#{parent_id}"
          raise ActiveRecord::RecordNotFound, error_message
        end
      end
      # mark as private
      klass.send(:private, private_validate_matching_parent_method)
    end
  end
    
  # include class methods
  class_methods do
    def setup_resource_finder
      ResourceFindable.setup_finder_method(self)
    end
  end
end