Rails.application.routes.draw do
  resources :movements do
  	collection do
	  	get "kiosk" => "movements#kiosk"
	  	get "foldback" => "movements#foldback"
	  end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
