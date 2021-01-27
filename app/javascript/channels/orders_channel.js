import consumer from "./consumer"

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the chat room!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    $('#messages').append('<p class="received"> ' + data.message + '</p>')
  },

  speak(message) {
    this.perform('speak', { message: message })
  }
});

export default ordersChannel;
