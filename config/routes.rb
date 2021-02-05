Rails.application.routes.draw do
	mount ActionCable.server => '/cable'

  resources :movements do
  	get "order" => "movements#order"
  	collection do
	  	get "kiosk" => "movements#kiosk"
	  	get "foldback" => "movements#foldback"
	  end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
