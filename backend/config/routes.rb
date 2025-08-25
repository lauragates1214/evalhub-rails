Rails.application.routes.draw do
  namespace :api do
    # Institution management
    resources :institutions do
      # Evaluations nested under institutions
      resources :evaluations do
        member do
          get :join
          get :responses
        end
        
        # Evaluation questions (join table)
        resources :evaluation_questions, path: 'questions'
        
        # Answers for evaluation questions
        resources :answers do
          collection do
            post :bulk_create
          end
        end
      end
      
      # Questions nested under institutions
      resources :questions do
        member do
          post :add_to_evaluation
          delete :remove_from_evaluation
        end
      end
      
      # Users nested under institutions
      resources :users, only: [:show, :create] do
        collection do
          post :authenticate
        end
      end
    end
    
    # Health check
    get 'health', to: proc { [200, {}, ['{"status":"ok","service":"EvalHub API"}']] }
  end
  
  # Root route
  root to: proc { [200, { 'Content-Type' => 'application/json' }, ['{"message":"EvalHub API","status":"running","version":"1.0"}']] }
end
