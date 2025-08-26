Rails.application.routes.draw do
  # Devise routes for API authentication
  devise_for :users, skip: [:all]
  
  namespace :api do
    # Devise custom routes for API
    devise_scope :user do
      post 'institutions/:institution_id/users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
      post 'institutions/:institution_id/users', to: 'registrations#create'
    end
    
    # Institution management
    resources :institutions do
      # Custom authentication routes for backward compatibility
      resources :users, only: [:show] do
        collection do
          post :authenticate
        end
      end
      
      # Courses nested under institutions
      resources :courses do
        member do
          get :join
          get :responses
        end
        
        # Course questions (join table)
        resources :course_questions, path: 'questions'
        
        # Answers for course questions
        resources :answers do
          collection do
            post :bulk_create
          end
        end
      end
      
      # Questions nested under institutions
      resources :questions do
        member do
          post :add_to_course
          delete :remove_from_course
        end
      end
    end
    
    # Health check
    get 'health', to: proc { [200, {}, ['{"status":"ok","service":"EvalHub API"}']] }
  end
  
  # Root route
  root to: proc { [200, { 'Content-Type' => 'application/json' }, ['{"message":"EvalHub API","status":"running","version":"1.0"}']] }
end