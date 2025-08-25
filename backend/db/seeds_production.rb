# Production seeds - minimal essential data only
# Safe for production - only creates records that don't exist

puts "Running production seeds..."

# Only create basic system records if they don't exist
if Institution.count == 0
  puts "Creating default institution..."
  Institution.create!(
    name: "EvalHub",
    description: "Default institution"
  )
end

puts "Production seeding complete!"
puts "Institutions: #{Institution.count}"