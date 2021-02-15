import consumer from "./consumer"

var foldback_moves_list = [];
var audience_moves_list = [];
var audience_moves_images = [];
var fulfillment_timer = 10;
var move_length_seconds = 15;
var audience_moves_display_limit = 11;

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the orders channel!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    //dirty close modal cuz its not playing nice with remote links
    if ($.modal) {
      $.modal.close();
    }

    foldback_moves_list.push(data.name);
    audience_moves_list.push(data.display_name);
    audience_moves_images.push(data.img_index);
    if (foldback_moves_list.length <= 2) addToFoldback(data.name)
    addToAudience();
    addToTimer();
  },

  speak(message) {
    this.perform("speak", { message: message });
    console.log("sent message");
  }
});

setInterval(updateMove, move_length_seconds*1000);
setInterval(updateTimer, 1000);

function updateMove(){
  var foldback_current_move = foldback_moves_list[0] || "No Selection";
  var foldback_next_move = foldback_moves_list[1] || "No Selection";
  updateFoldback(foldback_current_move, foldback_next_move);

  updateAudience();

  foldback_moves_list.shift();
  audience_moves_list.shift();
  audience_moves_images.shift();
}

function updateFoldback(current_move, next_move) {
  $("#current-move").html(current_move);
  $("#next-move").html(next_move);
}

function addToFoldback(next_move) {
  if ($("#next-move").html() == "No Selection") {
    $("#next-move").html(next_move);
  }
}

function updateAudience() {
  for (var i = 0; i < audience_moves_display_limit; i++) {
    if (audience_moves_list[i]) {
      $("#moves-list-" + i).html(audience_moves_list[i]);
    }
    else {
      $("#moves-list-" + i).html("");
    }
  }
  if (audience_moves_list.length > audience_moves_display_limit) {
    $("#moves-list-extra").html(audience_moves_list.length - audience_moves_display_limit + " other orders in the queue.")
  }
}

function addToAudience() {
  if (audience_moves_list.length <= audience_moves_display_limit) {
    $("#moves-list-" + (audience_moves_list.length - 1)).html(audience_moves_list[audience_moves_list.length - 1]);
  }
  else {
    $("#moves-list-extra").html((audience_moves_list.length - audience_moves_display_limit) + " other orders in the queue.")
  }
}

function addToTimer() {
  fulfillment_timer + move_length_seconds;
}

function updateTimer() {
  if (fulfillment_timer > 10) {
    fulfillment_timer -= 1;
  }
}

export default ordersChannel;
