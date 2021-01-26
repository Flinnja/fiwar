class OrdersChannel < ApplicationCable::Channel
	def subscribed
		stream from "orders"
	end
end
