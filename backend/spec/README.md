# EvalHub Backend Test Suite

## Overview

This is a **minimal test suite** focused on core functionality only. It includes:

- ✅ **Model tests** for validations and associations
- ✅ **Basic API endpoint tests** for core functionality  
- ✅ **Test factories** for easy test data creation
- ✅ **RSpec configuration** with FactoryBot integration

## Setup

1. Install test gems:
   ```bash
   bundle install
   ```

2. Set up test database:
   ```bash
   rails db:test:prepare
   ```

## Running Tests

Run all tests:
```bash
bundle exec rspec
```

Run specific test files:
```bash
bundle exec rspec spec/models/user_spec.rb
bundle exec rspec spec/requests/institutions_spec.rb
```

Run tests with documentation format:
```bash
bundle exec rspec --format documentation
```

## Test Coverage

### Model Tests (`spec/models/`)
- **Institution**: Validations (name presence/uniqueness), associations
- **User**: Validations, role methods, session token generation
- **Evaluation**: Validations, access code generation, QR URL generation  
- **Question**: Validations, question type methods

### API Tests (`spec/requests/`)
- **Institutions**: CRUD operations, error handling
- **Evaluations**: Evaluation joining, authentication requirements
- **Users**: Authentication, user creation

### Factories (`spec/factories/`)
- **Institution**: Basic institution factory
- **User**: User factory with instructor/student traits
- **Evaluation**: Evaluation factory with auto-generated access codes
- **Question**: Question factory with text/multiple_choice traits

### Concerns (`spec/controllers/concerns/`)
- **ResourceFindable**: Basic concern functionality tests

## Notes

- Tests focus on **core business logic** only
- **No complex integration tests** or frontend testing
- **No external service testing** (keeping it minimal)
- Uses **transactional fixtures** for fast, isolated tests
- **FactoryBot** for clean test data creation