import consumer from "./consumer";
import Rails from '@rails/ujs';
Rails.start();

var foldback_moves_list = [];
var audience_moves_list = [];
var audience_moves_images = [];
var fulfillment_timer = 5;
var fulfillment_timer_lower_limit = fulfillment_timer;
var move_length_seconds = 8;
var audience_moves_display_limit = 11;
var random_move_timer = 32;
var time_since_order = 0;

$(document).ready(function(){
  $(".modal-order-link").on("click touch", function(){
    $.modal.close();
  });
});

const ordersChannel = consumer.subscriptions.create("OrdersChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to the orders channel!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    if (data.message == "Update") {
      updateMove();
    }
    else {
      foldback_moves_list.push(data.name);
      audience_moves_list.push(data.display_name);
      audience_moves_images.push(data.img_index);
      time_since_order = 0;
      addToFoldback(data.name)
      addToAudience();
      addToTimer();
    }
  },

  speak(message) {
    this.perform("speak", { message: message });
  }
});


setInterval(syncUpdateMessage, move_length_seconds * 1000);
setInterval(updateTimer, 1000);
setInterval(addRandomMove, 1000)

function syncUpdateMessage(){
  if ($("#sync-update-broadcaster").is("div")) {
    ordersChannel.speak("Update");
  }
}

function updateMove(){
  var foldback_current_move = foldback_moves_list[0] || "No Selection";
  var foldback_next_move = foldback_moves_list[1] || "No Selection";
  updateFoldback(foldback_current_move, foldback_next_move);
  $("#move-amount").html(foldback_moves_list.length);
  foldback_moves_list.shift();

  updateAudience();
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
  if ($("#current-move").html() == "No Selection") {
    $("#move-amount").html(foldback_moves_list.length);
  }
  else {
    $("#move-amount").html(foldback_moves_list.length+1);
  }
}

function updateAudience() {
  if (audience_moves_list.length > 0){
    $("#moves-list-active").html(audience_moves_list.shift());
  }
  else {
    $("#moves-list-active").html("Please make an order at the tablet");
  }

  //need something to move image shift
  for (var i = 0; i < audience_moves_display_limit; i++) {
    if (audience_moves_list[i]) {
      $("#moves-list-" + i).html(audience_moves_list[i]);
    }
    else {
      $("#moves-list-" + i).html("");
    }
  }

  if (audience_moves_list.length > audience_moves_display_limit) {
    $("#moves-list-10").html(audience_moves_list.length - audience_moves_display_limit + 1 + " other orders in the queue")
  }
}

function addToAudience() {
  if (audience_moves_list.length <= audience_moves_display_limit) {
    $("#moves-list-" + (audience_moves_list.length - 1)).html(audience_moves_list[audience_moves_list.length - 1]);
  }
  else {
    $("#moves-list-10").html((audience_moves_list.length - audience_moves_display_limit) + 1 + " other orders in the queue");
  }
}

function addToTimer() {
  fulfillment_timer += move_length_seconds;
}

function updateTimer() {
  time_since_order++;
  var timer_minutes = Math.floor(fulfillment_timer / 60);
  var timer_seconds = fulfillment_timer - (timer_minutes * 60);
  var timer_message = "";
  if (timer_minutes > 1){
    timer_message = timer_minutes + " minutes and ";
  }
  else if (timer_minutes == 1){
    timer_message = "1 minute and ";
  }

  if (timer_seconds == 1){
    timer_message = timer_message + "1 second";
  }
  else {
    timer_message = timer_message + timer_seconds + " seconds";
  }

  if (fulfillment_timer > fulfillment_timer_lower_limit) {
    fulfillment_timer -= 1;
    $(".fulfillment-timer").each(function(){
      $(this).html(timer_message);
    });
  }
}

function addRandomMove() {
  if ($(".kiosk-header").is("div") && (time_since_order > random_move_timer)) {
    var random_index = Math.floor(Math.random() * $(".modal-order-link").length);
    console.log("adding random move index " + random_index);
    var native_element = $(".modal-order-link").eq(random_index)[0];
    Rails.handleRemote.call(native_element);
    addToTimer();
    time_since_order = 0;
  }
}

export default ordersChannel;
