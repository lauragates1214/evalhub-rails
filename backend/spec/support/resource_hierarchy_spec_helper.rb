module ResourceHierarchySpecHelper

  # returns resource with full hierarchy
  def self.create_with_hierarchy(resource_name, attributes = {})
    parent_names = Rails.application.config.resource_hierarchy[resource_name.to_s] || []
    # if no parent, just create the resource
    if parent_names.empty?
      resource = FactoryBot.create(resource_name)
      return resource
    end
    
    ancestor_params = {}
  
    # process each parent in the chain
    parent_names.each do |parent_name|
      # recursively create parent with its own hierarchy
      ancestor_params[parent_name.to_sym] = create_with_hierarchy(parent_name)
    end
    
    # create & return the resource with attributes incl ancestor params
    resource = FactoryBot.create(resource_name, attributes.merge(ancestor_params))
    
    resource
  end

  def self.create_ancestor_params(resource)
    params = {}
    current_resource = resource
    current_resource_name = resource.class.name.underscore
  
    # recursively add all ancestors
    while current_parent_name = Rails.application.config.resource_hierarchy[current_resource_name.to_s]&.first
      current_parent = current_resource.send(current_parent_name)
      params["#{current_parent_name}_id"] = current_parent.id
      
      # Update for next iteration
      current_resource = current_parent
      current_resource_name = current_parent_name
    end

    params
  end

  def self.find_siblings_for(resource_name)
    siblings = []
    parent_name = Rails.application.config.resource_hierarchy[resource_name.to_s]&.first
    
    return [] unless parent_name # Return empty array if no parent

    # Look through the resource hierarchy to find all resources with the same parent
    Rails.application.config.resource_hierarchy.each do |res_name, hierarchy|
      # If this resource has the same parent as our test resource, it's a sibling
      if hierarchy.first == parent_name && res_name != resource_name.to_s
        siblings << res_name.to_sym
      end
    end
    
    siblings
  end
end