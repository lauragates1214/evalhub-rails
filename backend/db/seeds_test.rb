# Test seeds - minimal data for test environment
# Used for consistent test setup

# Create minimal test data that tests can rely on
test_org = Institution.find_or_create_by(name: "Test Institution")

puts "Test seeding complete!"
puts "Test institutions: #{Institution.where(name: 'Test Institution').count}"