Rails.application.routes.draw do
  resources :users, only: [:index, :new, :create, :edit, :update]
  resources :sessions, :only => [:new, :create, :destroy]
  get 'emails/login'

  resources :emails, only: [:index, :new, :create, :edit, :update]
  post 'emails/import'
  get 'emails/load'
  get 'emails/classify'
  patch 'emails/classify'
  get 'emails/edit'

  resources :clusters, only: [:index, :new, :create, :edit, :update]

  root 'emailaggregates#index'
  resources :emailaggregates, only: [:new, :create, :destroy, :edit, :update]
  get 'emailaggregates/totalContact'
  get 'emailaggregates/diversity'
  get 'emailaggregates/intensity'
  get 'emailaggregates/averageIntensity'
  get 'emailaggregates/lHighCharts'
  get 'emailaggregates/totalVolume'
  get 'emailaggregates/norms'
  get 'emailaggregates/dashboard'
  get 'emailaggregates/index'


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
