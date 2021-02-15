import consumer from "./consumer"

var foldback_moves_list = [];
var audience_moves_list = [];
var fulfillment_timer = 10;

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the orders channel!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    //$('#order-reciever').append('<p class="received"> ' + data + '</p>');
    //console.log ("received message: " + data);
    foldback_moves_list.push(data.name);
    audience_moves_list.push(data.display_name);
    if (foldback_moves_list.length <= 2) addToFoldback(data.name)
  },

  speak(message) {
    this.perform('speak', { message: message });
    console.log("sent message");
  }
});

setInterval(updateMove, 15000);
setInterval(updateTimer, 1000);

function updateMove(){
  var foldback_current_move = foldback_moves_list[0] || "No Selection";
  var foldback_next_move = foldback_moves_list[1] || "No Selection";
  foldback_moves_list.shift()
  updateFoldback(foldback_current_move, foldback_next_move);
}

function updateFoldback(current_move, next_move) {
  $('#current-move').html(current_move);
  $('#next-move').html(next_move);
}

function addToFoldback(next_move) {
  if ($("#next-move").html() == "No Selection") {
    $('#next-move').html(next_move);
  }
}

function updateAudience() {

}

function updateTimer() {
  if (fulfillment_timer > 10) {
    fulfillment_timer -= 1;
  }
}

export default ordersChannel;
