import consumer from "./consumer"

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the orders channel!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    $('#order-reciever').append('<p class="received"> ' + data.message + '</p>');
    console.log ("received message: " + data.message);
  },

  speak(message) {
    this.perform('speak', { message: message });
    console.log("sent message");
  }
});

export default ordersChannel;
