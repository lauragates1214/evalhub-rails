#!/bin/bash

echo "Testing instructor registration..."

# First, create an institution
echo "1. Creating institution..."
curl -X POST http://localhost:3000/api/institutions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test University",
    "description": "Test institution for registration"
  }' | python3 -m json.tool

echo -e "\n2. Creating instructor account..."
# Create an instructor user
curl -X POST http://localhost:3000/api/institutions/1/users \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "Test Instructor",
      "email": "test@example.com",
      "password": "password123",
      "role": "instructor"
    }
  }' | python3 -m json.tool

echo -e "\n3. Testing authentication..."
# Test authentication
curl -X POST http://localhost:3000/api/institutions/1/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | python3 -m json.tool