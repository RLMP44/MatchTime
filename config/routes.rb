Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  namespace :api do
    put "racer/clear_existing", to: "racer#clear_existing"
    put "racer/merge", to: "racer#merge"
    put "division/clear_existing", to: "division#clear_existing"
    put "division/merge", to: "division#merge"
    put "category/clear_existing", to: "category#clear_existing"
    put "category/merge", to: "category#merge"

    resources :racer do
      member do
        patch :reset
      end
    end

    resources :division do
      member do
        patch :reset
      end
    end

    resources :category do
      member do
        patch :reset
      end
    end
  end

  root "frontend#index"

  get "*path", to: "frontend#index",
    constraints: ->(req) { req.format.html? && !req.xhr? }
end
