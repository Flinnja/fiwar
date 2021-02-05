class OrdersChannel < ApplicationCable::Channel
	def subscribed
		stream_from "orders_channel"
	end

	def unsubscribed
	end

	def speak
		ActionCable.server.broadcast "orders_channel", message: data['message']
	end
end
